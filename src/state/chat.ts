/**
 * Chat state management (vanilla JS port of use-chat hook)
 * Handles chat CRUD operations, message management, and AI responses
 */

import { Store } from '../framework/store';
import type { Chat, Message, AIModel, ChatState } from '../lib/types';

// Chat store state interface
interface ChatStoreState {
  chats: Chat[];
  chatState: ChatState;
}

// Load initial state from localStorage
function loadInitialState(): ChatStoreState {
  const savedChats = localStorage.getItem('pilot-chats');
  const savedChatState = localStorage.getItem('pilot-chat-state');

  return {
    chats: savedChats ? JSON.parse(savedChats) : [],
    chatState: savedChatState
      ? JSON.parse(savedChatState)
      : {
          currentChatId: null,
          selectedModel: 'GPT 4o' as AIModel,
          isLoading: false,
        },
  };
}

// Create chat store
export const chatStore = new Store<ChatStoreState>(loadInitialState());

// Auto-save to localStorage on changes
chatStore.subscribe((state) => {
  localStorage.setItem('pilot-chats', JSON.stringify(state.chats));
  localStorage.setItem('pilot-chat-state', JSON.stringify(state.chatState));
});

/**
 * Get current chat
 */
export function getCurrentChat(): Chat | undefined {
  const state = chatStore.getState();
  return state.chats.find((chat) => chat.id === state.chatState.currentChatId);
}

/**
 * Create a new chat
 */
export function createNewChat(): string {
  const newChat: Chat = {
    id: `chat-${Date.now()}`,
    title: 'New Chat',
    messages: [],
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  chatStore.setState((prev) => ({
    chats: [...prev.chats, newChat],
    chatState: {
      ...prev.chatState,
      currentChatId: newChat.id,
    },
  }));

  return newChat.id;
}

/**
 * Select a chat
 */
export function selectChat(chatId: string): void {
  chatStore.setState((prev) => ({
    ...prev,
    chatState: {
      ...prev.chatState,
      currentChatId: chatId,
    },
  }));
}

/**
 * Delete a chat
 */
export function deleteChat(chatId: string): void {
  chatStore.setState((prev) => {
    const newChats = prev.chats.filter((chat) => chat.id !== chatId);
    const newChatState = { ...prev.chatState };

    // If deleting current chat, clear selection
    if (newChatState.currentChatId === chatId) {
      newChatState.currentChatId = null;
    }

    return {
      chats: newChats,
      chatState: newChatState,
    };
  });
}

/**
 * Set the selected AI model
 */
export function setModel(model: AIModel): void {
  chatStore.setState((prev) => ({
    ...prev,
    chatState: {
      ...prev.chatState,
      selectedModel: model,
    },
  }));
}

/**
 * Set loading state
 */
export function setLoading(loading: boolean): void {
  chatStore.setState((prev) => ({
    ...prev,
    chatState: {
      ...prev.chatState,
      isLoading: loading,
    },
  }));
}

/**
 * Add a message to the current chat
 */
export function addMessage(
  message: Omit<Message, 'id' | 'timestamp'>
): string | undefined {
  const state = chatStore.getState();
  const currentChatId = state.chatState.currentChatId;

  if (!currentChatId) return undefined;

  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: Date.now(),
  };

  chatStore.setState((prev) => ({
    ...prev,
    chats: prev.chats.map((chat) =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastUpdated: Date.now(),
            title:
              chat.title === 'New Chat' && chat.messages.length === 0
                ? message.content.slice(0, 100) +
                  (message.content.length > 100 ? '...' : '')
                : chat.title,
          }
        : chat
    ),
  }));

  return newMessage.id;
}

/**
 * Send a message and get AI response
 */
export async function sendMessage(
  content: string,
  imageUrl?: string
): Promise<void> {
  const state = chatStore.getState();
  const currentChatId = state.chatState.currentChatId;

  if (!currentChatId) {
    // Create new chat if none exists
    createNewChat();
  }

  // Add user message
  addMessage({
    content,
    role: 'user',
    imageUrl,
    model: state.chatState.selectedModel,
  });

  // Set loading state
  setLoading(true);

  try {
    // Get auth token (will implement auth state next)
    const authState = (window as any).__AUTH_STATE__;
    const accessToken = authState?.accessToken;

    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    // Call GitHub Models API
    const response = await fetch(
      'https://models.github.ai/inference/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          model: state.chatState.selectedModel,
          messages: [{ role: 'user', content }],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub Models API error: ${response.status}`);
    }

    const result = await response.json();
    const aiContent =
      result.choices?.[0]?.message?.content ||
      'Sorry, I could not generate a response.';

    // Add AI response
    addMessage({
      content: aiContent,
      role: 'assistant',
      model: state.chatState.selectedModel,
    });
  } catch (error) {
    console.error('Error calling GitHub Models API:', error);

    // Add error message
    addMessage({
      content:
        'Sorry, I encountered an error processing your request. Please try again.',
      role: 'assistant',
      model: state.chatState.selectedModel,
    });
  } finally {
    setLoading(false);
  }
}

/**
 * Edit a message and regenerate AI response
 */
export async function editMessage(
  messageId: string,
  newContent: string
): Promise<void> {
  const state = chatStore.getState();
  const currentChatId = state.chatState.currentChatId;

  if (!currentChatId) return;

  const currentChat = state.chats.find((chat) => chat.id === currentChatId);
  if (!currentChat) return;

  // Find the message being edited
  const messageIndex = currentChat.messages.findIndex(
    (msg) => msg.id === messageId
  );
  if (messageIndex === -1) return;

  const messageToEdit = currentChat.messages[messageIndex];

  // Only handle user message edits
  if (messageToEdit.role !== 'user') return;

  setLoading(true);

  try {
    // Create version history
    const versions = messageToEdit.versions || [
      {
        content: messageToEdit.content,
        timestamp: messageToEdit.timestamp,
        model: messageToEdit.model,
      },
    ];

    const newVersion = {
      content: newContent,
      timestamp: Date.now(),
      model: messageToEdit.model,
    };
    const updatedVersions = [...versions, newVersion];

    // Truncate messages and update edited message
    const truncatedMessages = currentChat.messages.slice(0, messageIndex);
    const updatedUserMessage: Message = {
      ...messageToEdit,
      content: newContent,
      isEdited: true,
      editedAt: Date.now(),
      versions: updatedVersions,
      currentVersionIndex: updatedVersions.length - 1,
    };

    // Update chat with edited message
    chatStore.setState((prev) => ({
      ...prev,
      chats: prev.chats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...truncatedMessages, updatedUserMessage],
              lastUpdated: Date.now(),
            }
          : chat
      ),
    }));

    // Generate new AI response
    const authState = (window as any).__AUTH_STATE__;
    const accessToken = authState?.accessToken;

    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(
      'https://models.github.ai/inference/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          model: state.chatState.selectedModel,
          messages: [{ role: 'user', content: newContent }],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub Models API error: ${response.status}`);
    }

    const result = await response.json();
    const aiContent =
      result.choices?.[0]?.message?.content ||
      'Sorry, I could not generate a response.';

    // Add new AI response
    const aiMessage: Message = {
      id: `msg-${Date.now()}-ai`,
      content: aiContent,
      role: 'assistant',
      timestamp: Date.now(),
      model: state.chatState.selectedModel,
    };

    chatStore.setState((prev) => ({
      ...prev,
      chats: prev.chats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...truncatedMessages, updatedUserMessage, aiMessage],
              lastUpdated: Date.now(),
            }
          : chat
      ),
    }));
  } catch (error) {
    console.error('Error regenerating AI response:', error);

    // Add error message
    const errorMessage: Message = {
      id: `msg-${Date.now()}-error`,
      content:
        'Sorry, I encountered an error processing your edited message. Please try again.',
      role: 'assistant',
      timestamp: Date.now(),
      model: state.chatState.selectedModel,
    };

    const currentState = chatStore.getState();
    const chat = currentState.chats.find((c) => c.id === currentChatId);
    if (chat) {
      chatStore.setState((prev) => ({
        ...prev,
        chats: prev.chats.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [...c.messages, errorMessage],
                lastUpdated: Date.now(),
              }
            : c
        ),
      }));
    }
  } finally {
    setLoading(false);
  }
}

/**
 * Switch to a different version of a message
 */
export function switchMessageVersion(
  messageId: string,
  versionIndex: number
): void {
  const state = chatStore.getState();
  const currentChatId = state.chatState.currentChatId;

  if (!currentChatId) return;

  chatStore.setState((prev) => ({
    ...prev,
    chats: prev.chats.map((chat) =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === messageId && msg.versions
                ? {
                    ...msg,
                    content: msg.versions[versionIndex].content,
                    currentVersionIndex: versionIndex,
                  }
                : msg
            ),
            lastUpdated: Date.now(),
          }
        : chat
    ),
  }));
}
