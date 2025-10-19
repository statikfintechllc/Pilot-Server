import { useState, useCallback, useEffect } from 'react';
import { Chat, Message, AIModel, ChatState } from '@/lib/types';
import { useVSCodeAuth } from '@/hooks/use-vscode-auth';
import { chatDatabase } from '@/lib/supabase/chat-service';
import { augmentWithContext } from '@/lib/rag';

/**
 * Chat hook with Supabase integration and RAG support
 */
export function useChatWithDatabase() {
  const { authState } = useVSCodeAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatState, setChatState] = useState<ChatState>({
    currentChatId: null,
    selectedModel: 'GPT 4o',
    isLoading: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load chats from database when user is authenticated
  useEffect(() => {
    const loadChats = async () => {
      if (!authState.isAuthenticated || !authState.user?.id) {
        setChats([]);
        setIsInitialized(true);
        return;
      }

      try {
        const dbChats = await chatDatabase.getUserChats(authState.user.id);
        
        // Convert database chats to app format
        const appChats: Chat[] = await Promise.all(
          dbChats.map(async (dbChat) => {
            const dbMessages = await chatDatabase.getChatMessages(dbChat.id);
            
            return {
              id: dbChat.id,
              title: dbChat.title,
              messages: dbMessages.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                model: msg.model,
                timestamp: new Date(msg.created_at).getTime(),
              })),
              createdAt: new Date(dbChat.created_at).getTime(),
              lastUpdated: new Date(dbChat.updated_at).getTime(),
            };
          })
        );

        setChats(appChats);
        
        // Restore last selected chat from localStorage
        const savedState = localStorage.getItem('pilot-chat-state');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setChatState((prev) => ({
            ...prev,
            currentChatId: parsed.currentChatId || appChats[0]?.id || null,
            selectedModel: parsed.selectedModel || 'GPT 4o',
          }));
        } else if (appChats.length > 0) {
          setChatState((prev) => ({
            ...prev,
            currentChatId: appChats[0].id,
          }));
        }
      } catch (error) {
        console.error('Error loading chats:', error);
        // Fallback to localStorage for backwards compatibility
        const savedChats = localStorage.getItem('pilot-chats');
        if (savedChats) {
          setChats(JSON.parse(savedChats));
        }
      } finally {
        setIsInitialized(true);
      }
    };

    loadChats();
  }, [authState.isAuthenticated, authState.user?.id]);

  // Save chat state to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pilot-chat-state', JSON.stringify(chatState));
    }
  }, [chatState, isInitialized]);

  const currentChat = chats.find((chat) => chat.id === chatState.currentChatId);

  const createNewChat = useCallback(async () => {
    if (!authState.isAuthenticated || !authState.user?.id) {
      // Fallback to local-only chat
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        lastUpdated: Date.now(),
      };
      setChats((prev) => [...prev, newChat]);
      setChatState((prev) => ({ ...prev, currentChatId: newChat.id }));
      return newChat.id;
    }

    try {
      const dbChat = await chatDatabase.createChat(authState.user.id, 'New Chat');
      
      if (dbChat) {
        const newChat: Chat = {
          id: dbChat.id,
          title: dbChat.title,
          messages: [],
          createdAt: new Date(dbChat.created_at).getTime(),
          lastUpdated: new Date(dbChat.updated_at).getTime(),
        };

        setChats((prev) => [...prev, newChat]);
        setChatState((prev) => ({ ...prev, currentChatId: newChat.id }));
        return newChat.id;
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }

    return null;
  }, [authState.isAuthenticated, authState.user?.id]);

  const selectChat = useCallback((chatId: string) => {
    setChatState((prev) => ({ ...prev, currentChatId: chatId }));
  }, []);

  const setModel = useCallback((model: AIModel) => {
    setChatState((prev) => ({ ...prev, selectedModel: model }));
  }, []);

  const deleteChat = useCallback(
    async (chatId: string) => {
      if (authState.isAuthenticated && authState.user?.id) {
        try {
          await chatDatabase.deleteChat(chatId);
        } catch (error) {
          console.error('Error deleting chat:', error);
        }
      }

      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      
      if (chatState.currentChatId === chatId) {
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        setChatState((prev) => ({
          ...prev,
          currentChatId: remainingChats[0]?.id || null,
        }));
      }
    },
    [authState.isAuthenticated, authState.user?.id, chatState.currentChatId, chats]
  );

  const addMessage = useCallback(
    async (message: Omit<Message, 'id' | 'timestamp'>) => {
      if (!chatState.currentChatId) return;

      const timestamp = Date.now();
      let messageId = `msg-${timestamp}`;

      // Save to database if authenticated
      if (authState.isAuthenticated && authState.user?.id) {
        try {
          const dbMessage = await chatDatabase.addMessage(
            authState.user.id,
            chatState.currentChatId,
            message.role,
            message.content,
            message.model
          );

          if (dbMessage) {
            messageId = dbMessage.id;
          }
        } catch (error) {
          console.error('Error saving message:', error);
        }
      }

      const newMessage: Message = {
        ...message,
        id: messageId,
        timestamp,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatState.currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastUpdated: timestamp,
              }
            : chat
        )
      );
    },
    [chatState.currentChatId, authState.isAuthenticated, authState.user?.id]
  );

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (!chatState.currentChatId) return;

      // Update in database if authenticated
      if (authState.isAuthenticated && authState.user?.id) {
        try {
          await chatDatabase.updateMessage(messageId, newContent);
        } catch (error) {
          console.error('Error updating message:', error);
        }
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatState.currentChatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, content: newContent } : msg
                ),
                lastUpdated: Date.now(),
              }
            : chat
        )
      );
    },
    [chatState.currentChatId, authState.isAuthenticated, authState.user?.id]
  );

  const switchMessageVersion = useCallback(
    (messageId: string, direction: 'prev' | 'next') => {
      // This is a placeholder for message version switching
      // Implementation depends on how you want to handle multiple versions
      console.log('Switch message version:', messageId, direction);
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string, images?: string[]) => {
      if (!chatState.currentChatId || !content.trim()) return;

      setChatState((prev) => ({ ...prev, isLoading: true }));

      try {
        // Add user message
        await addMessage({
          role: 'user',
          content,
          images,
        });

        // Augment message with RAG context if authenticated
        let augmentedContent = content;
        if (authState.isAuthenticated && authState.user?.id) {
          try {
            augmentedContent = await augmentWithContext(authState.user.id, content);
          } catch (error) {
            console.warn('RAG augmentation failed, using original message:', error);
          }
        }

        // TODO: Call AI model API with augmented content
        // This is a placeholder - integrate with your AI service
        const response = `This is a placeholder response. Integrate with your AI service to get real responses. Message: ${augmentedContent}`;

        // Add assistant message
        await addMessage({
          role: 'assistant',
          content: response,
          model: chatState.selectedModel,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setChatState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [chatState.currentChatId, chatState.selectedModel, authState.isAuthenticated, authState.user?.id, addMessage]
  );

  return {
    chats,
    currentChat,
    chatState,
    createNewChat,
    selectChat,
    setModel,
    deleteChat,
    editMessage,
    switchMessageVersion,
    sendMessage,
  };
}
