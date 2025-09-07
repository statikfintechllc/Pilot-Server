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

  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!chatState.currentChatId) return;

    const currentChatData = chats.find(chat => chat.id === chatState.currentChatId);
    if (!currentChatData) return;

    // Find the message being edited
    const messageIndex = currentChatData.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const messageToEdit = currentChatData.messages[messageIndex];
    
    // If this is a user message, truncate all subsequent messages and regenerate AI response
    if (messageToEdit.role === 'user') {
      setLoading(true);
      
      try {
        // Create version history for the message
        const versions = messageToEdit.versions || [
          { content: messageToEdit.content, timestamp: messageToEdit.timestamp, model: messageToEdit.model }
        ];
        
        // Add new version
        const newVersion = { content: newContent, timestamp: Date.now(), model: messageToEdit.model };
        const updatedVersions = [...versions, newVersion];
        
        // Update the user message and remove all subsequent messages
        const truncatedMessages = currentChatData.messages.slice(0, messageIndex);
        const updatedUserMessage = {
          ...messageToEdit,
          content: newContent,
          isEdited: true,
          editedAt: Date.now(),
          versions: updatedVersions,
          currentVersionIndex: updatedVersions.length - 1
        };

        // Update chat with edited message and truncated conversation
        setChats(currentChats => 
          currentChats.map(chat => 
            chat.id === chatState.currentChatId
              ? {
                  ...chat,
                  messages: [...truncatedMessages, updatedUserMessage],
                  lastUpdated: Date.now()
                }
              : chat
          )
        );

        // Generate new AI response
        if (typeof window !== 'undefined' && window.spark) {
          const prompt = spark.llmPrompt`${newContent}`;
          const response = await spark.llm(prompt, chatState.selectedModel);
          
          // Add new AI response
          const aiMessage: Message = {
            id: `msg-${Date.now()}-ai`,
            content: response,
            role: 'assistant',
            timestamp: Date.now(),
            model: chatState.selectedModel
          };

          setChats(currentChats => 
            currentChats.map(chat => 
              chat.id === chatState.currentChatId
                ? {
                    ...chat,
                    messages: [...truncatedMessages, updatedUserMessage, aiMessage],
                    lastUpdated: Date.now()
                  }
                : chat
            )
          );
        } else {
          throw new Error('Spark runtime not available');
        }
      } catch (error) {
        console.error('Error regenerating AI response:', error);
        // Add error message
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          content: 'Sorry, I encountered an error processing your edited message. Please try again.',
          role: 'assistant',
          timestamp: Date.now(),
          model: chatState.selectedModel
        };

        setChats(currentChats => 
          currentChats.map(chat => 
            chat.id === chatState.currentChatId
              ? {
                  ...chat,
                  messages: [...currentChatData.messages.slice(0, messageIndex), 
                            { ...messageToEdit, content: newContent, isEdited: true, editedAt: Date.now() },
                            errorMessage],
                  lastUpdated: Date.now()
                }
              : chat
          )
        );
      } finally {
        setLoading(false);
      }
    } else {
      // For AI messages, just update the content without regenerating
      const versions = messageToEdit.versions || [
        { content: messageToEdit.content, timestamp: messageToEdit.timestamp, model: messageToEdit.model }
      ];
      
      // Add new version
      const newVersion = { content: newContent, timestamp: Date.now(), model: messageToEdit.model };
      const updatedVersions = [...versions, newVersion];
      
      setChats(currentChats => 
        currentChats.map(chat => 
          chat.id === chatState.currentChatId
            ? {
                ...chat,
                messages: chat.messages.map(msg => 
                  msg.id === messageId
                    ? {
                        ...msg,
                        content: newContent,
                        isEdited: true,
                        editedAt: Date.now(),
                        versions: updatedVersions,
                        currentVersionIndex: updatedVersions.length - 1
                      }
                    : msg
                ),
                lastUpdated: Date.now()
              }
            : chat
        )
      );
    }
  }, [chatState.currentChatId, chatState.selectedModel, chats, setChats, setLoading]);

  const switchMessageVersion = useCallback((messageId: string, versionIndex: number) => {
    if (!chatState.currentChatId) return;

    setChats(currentChats => 
      currentChats.map(chat => 
        chat.id === chatState.currentChatId
          ? {
              ...chat,
              messages: chat.messages.map(msg => {
                if (msg.id === messageId && msg.versions && msg.versions[versionIndex]) {
                  const version = msg.versions[versionIndex];
                  return {
                    ...msg,
                    content: version.content,
                    currentVersionIndex: versionIndex,
                    model: version.model
                  };
                }
                return msg;
              }),
              lastUpdated: Date.now()
            }
          : chat
      )
    );
  }, [chatState.currentChatId, setChats]);

  const sendMessage = useCallback(async (content: string, imageUrl?: string) => {
    if (!content.trim() && !imageUrl) return;
    
    // Ensure we have a current chat
    let targetChatId = chatState.currentChatId;
    if (!targetChatId) {
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
      targetChatId = newChat.id;
    }

    setLoading(true);

    try {
      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        role: 'user',
        timestamp: Date.now(),
        imageUrl,
        model: chatState.selectedModel
      };

      setChats(currentChats => 
        currentChats.map(chat => 
          chat.id === targetChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                lastUpdated: Date.now(),
                title: chat.title === 'New Chat' && chat.messages.length === 0 
                  ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
                  : chat.title
              }
            : chat
        )
      );

      // Check if spark is available
      if (typeof window !== 'undefined' && window.spark) {
        // Get AI response
        const prompt = spark.llmPrompt`${content}`;
        const response = await spark.llm(prompt, chatState.selectedModel);
        
        // Add AI response
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          content: response,
          role: 'assistant',
          timestamp: Date.now(),
          model: chatState.selectedModel
        };

        setChats(currentChats => 
          currentChats.map(chat => 
            chat.id === targetChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, aiMessage],
                  lastUpdated: Date.now()
                }
              : chat
          )
        );
      } else {
        throw new Error('Spark runtime not available');
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      // Add error message
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: Date.now(),
        model: chatState.selectedModel
      };

      setChats(currentChats => 
        currentChats.map(chat => 
          chat.id === targetChatId
            ? {
                ...chat,
                messages: [...chat.messages, errorMessage],
                lastUpdated: Date.now()
              }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  }, [chatState.currentChatId, chatState.selectedModel, setChats, setChatState, setLoading]);

  return {
    chats,
    currentChat,
    chatState,
    createNewChat,
    selectChat,
    setModel,
    addMessage,
    editMessage,
    switchMessageVersion,
    deleteChat,
    sendMessage
  };
}