import { useKV } from '@github/spark/hooks';
import { useState, useCallback } from 'react';
import { Chat, Message, AIModel, ChatState } from '@/lib/types';

export function useChat() {
  const [chats, setChats] = useKV<Chat[]>('pilot-chats', []);
  const [chatState, setChatState] = useKV<ChatState>('pilot-chat-state', {
    currentChatId: null,
    selectedModel: 'gpt-4o',
    isLoading: false
  });

  const currentChat = chats.find(chat => chat.id === chatState.currentChatId);

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    setChats(currentChats => [...currentChats, newChat]);
    setChatState(prev => ({
      ...prev,
      currentChatId: newChat.id
    }));

    return newChat.id;
  }, [setChats, setChatState]);

  const selectChat = useCallback((chatId: string) => {
    setChatState(prev => ({
      ...prev,
      currentChatId: chatId
    }));
  }, [setChatState]);

  const setModel = useCallback((model: AIModel) => {
    setChatState(prev => ({
      ...prev,
      selectedModel: model
    }));
  }, [setChatState]);

  const setLoading = useCallback((loading: boolean) => {
    setChatState(prev => ({
      ...prev,
      isLoading: loading
    }));
  }, [setChatState]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!chatState.currentChatId) return;

    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: Date.now()
    };

    setChats(currentChats => 
      currentChats.map(chat => 
        chat.id === chatState.currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastUpdated: Date.now(),
              title: chat.title === 'New Chat' && chat.messages.length === 0 
                ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                : chat.title
            }
          : chat
      )
    );

    return newMessage.id;
  }, [chatState.currentChatId, setChats]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(currentChats => currentChats.filter(chat => chat.id !== chatId));
    if (chatState.currentChatId === chatId) {
      setChatState(prev => ({
        ...prev,
        currentChatId: null
      }));
    }
  }, [setChats, setChatState, chatState.currentChatId]);

  const sendMessage = useCallback(async (content: string, imageUrl?: string) => {
    if (!content.trim() && !imageUrl) return;
    if (!chatState.currentChatId) {
      createNewChat();
    }

    setLoading(true);

    const userMessageId = addMessage({
      content,
      role: 'user',
      imageUrl,
      model: chatState.selectedModel
    });

    try {
      const prompt = spark.llmPrompt`${content}`;
      const response = await spark.llm(prompt, chatState.selectedModel);
      
      addMessage({
        content: response,
        role: 'assistant',
        model: chatState.selectedModel
      });
    } catch (error) {
      addMessage({
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        model: chatState.selectedModel
      });
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  }, [chatState.currentChatId, chatState.selectedModel, createNewChat, addMessage, setLoading]);

  return {
    chats,
    currentChat,
    chatState,
    createNewChat,
    selectChat,
    setModel,
    addMessage,
    deleteChat,
    sendMessage
  };
}