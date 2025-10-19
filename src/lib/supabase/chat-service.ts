import { supabase, Chat, ChatMessage } from './client';

/**
 * Database service for chat operations
 */
export class ChatDatabaseService {
  /**
   * Get all chats for a user
   */
  async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user chats:', error);
      return [];
    }
  }

  /**
   * Get messages for a specific chat
   */
  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  }

  /**
   * Create a new chat
   */
  async createChat(userId: string, title: string): Promise<Chat | null> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          title,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  }

  /**
   * Update chat title
   */
  async updateChatTitle(chatId: string, title: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', chatId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating chat title:', error);
      return false;
    }
  }

  /**
   * Delete a chat and all its messages
   */
  async deleteChat(chatId: string): Promise<boolean> {
    try {
      // First delete all messages
      await supabase
        .from('chat_messages')
        .delete()
        .eq('chat_id', chatId);

      // Then delete the chat
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return false;
    }
  }

  /**
   * Add a message to a chat
   */
  async addMessage(
    userId: string,
    chatId: string,
    role: 'user' | 'assistant',
    content: string,
    model?: string
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          chat_id: chatId,
          role,
          content,
          model,
        })
        .select()
        .single();

      if (error) throw error;

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  /**
   * Update a message
   */
  async updateMessage(messageId: string, content: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating message:', error);
      return false;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  /**
   * Search messages across all user chats
   */
  async searchMessages(userId: string, query: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .textSearch('content', query)
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }
}

export const chatDatabase = new ChatDatabaseService();
