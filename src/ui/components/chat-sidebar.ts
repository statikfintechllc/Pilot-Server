/**
 * Chat Sidebar Component
 * Displays list of chats with create, select, and delete functionality
 */

import { chatStore, createNewChat, selectChat, deleteChat } from '../../state/chat';
import type { Chat } from '../../lib/types';

export class ChatSidebar {
  private container: HTMLElement;
  private isCollapsed: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();

    // Subscribe to chat store changes
    chatStore.subscribe(() => {
      this.render();
    });
  }

  private render(): void {
    const state = chatStore.getState();
    const { chats, chatState } = state;

    this.container.className = `glass-sidebar fixed left-0 top-0 h-full w-72 ${
      this.isCollapsed ? 'hidden md:block md:w-12' : 'block'
    } transition-all duration-300 z-10 overflow-hidden`;

    this.container.innerHTML = `
      <div class="flex flex-col h-full p-4">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          ${!this.isCollapsed ? `
            <h2 class="text-xl font-bold text-white">Chats</h2>
            <button 
              class="glass-button p-2 hover:bg-white/10"
              onclick="window.chatSidebarToggle()"
              title="Collapse sidebar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          ` : `
            <button 
              class="glass-button p-2 w-full hover:bg-white/10"
              onclick="window.chatSidebarToggle()"
              title="Expand sidebar"
            >
              <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          `}
        </div>

        ${!this.isCollapsed ? `
          <!-- New Chat Button -->
          <button 
            class="glass-button w-full py-3 mb-4 text-white hover:bg-white/10 flex items-center justify-center gap-2"
            onclick="window.createNewChat()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>

          <!-- Chat List -->
          <div class="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            ${chats.length === 0 ? `
              <div class="text-center text-gray-400 text-sm py-8">
                No chats yet.<br>Create one to get started!
              </div>
            ` : ''}
            ${chats.map(chat => this.renderChatItem(chat, chatState.currentChatId)).join('')}
          </div>
        ` : `
          <!-- Collapsed New Chat Button -->
          <button 
            class="glass-button w-full p-3 mb-4 hover:bg-white/10"
            onclick="window.createNewChat()"
            title="New Chat"
          >
            <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        `}
      </div>

      <style>
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      </style>
    `;
  }

  private renderChatItem(chat: Chat, currentChatId: string | null): string {
    const isActive = chat.id === currentChatId;
    const title = chat.title.slice(0, 30) + (chat.title.length > 30 ? '...' : '');
    const messageCount = chat.messages.length;

    return `
      <div 
        class="glass-interactive p-3 rounded-lg cursor-pointer ${
          isActive ? 'bg-white/10 border-white/20' : ''
        }"
        onclick="window.selectChat('${chat.id}')"
      >
        <div class="flex items-center justify-between mb-1">
          <h3 class="font-medium text-white text-sm truncate flex-1">${title}</h3>
          <button 
            class="glass-button p-1 hover:bg-red-500/20 ml-2"
            onclick="event.stopPropagation(); window.deleteChat('${chat.id}')"
            title="Delete chat"
          >
            <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div class="text-xs text-gray-400">${messageCount} message${messageCount !== 1 ? 's' : ''}</div>
      </div>
    `;
  }

  public toggle(): void {
    this.isCollapsed = !this.isCollapsed;
    this.render();
  }
}

// Global functions for event handlers
if (typeof window !== 'undefined') {
  (window as any).createNewChat = () => {
    createNewChat();
  };

  (window as any).selectChat = (chatId: string) => {
    selectChat(chatId);
  };

  (window as any).deleteChat = (chatId: string) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId);
    }
  };

  let sidebarInstance: ChatSidebar | null = null;
  (window as any).chatSidebarToggle = () => {
    if (sidebarInstance) {
      sidebarInstance.toggle();
    }
  };

  (window as any).__setSidebarInstance = (instance: ChatSidebar) => {
    sidebarInstance = instance;
  };
}
