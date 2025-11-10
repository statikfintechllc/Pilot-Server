/**
 * Chat Messages Component
 * Displays conversation messages with support for editing and version switching
 */

import { chatStore, editMessage, switchMessageVersion } from '../../state/chat';
import type { Message } from '../../lib/types';
import { marked } from 'marked';

// Configure marked for safe HTML
marked.setOptions({
  breaks: true,
  gfm: true,
});

export class ChatMessages {
  private container: HTMLElement;

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
    const currentChat = state.chats.find(
      (chat) => chat.id === state.chatState.currentChatId
    );

    this.container.className =
      'flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4';

    if (!currentChat || currentChat.messages.length === 0) {
      this.container.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="text-center text-gray-400 space-y-4">
            <svg class="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-lg">Start a conversation</p>
            <p class="text-sm">Type a message below to begin</p>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = currentChat.messages
      .map((message, index) => this.renderMessage(message, index))
      .join('');

    // Scroll to bottom
    this.container.scrollTop = this.container.scrollHeight;
  }

  private renderMessage(message: Message, index: number): string {
    const isUser = message.role === 'user';
    const contentHTML = this.renderMessageContent(message.content);

    return `
      <div class="message-container ${isUser ? 'message-user' : 'message-assistant'}">
        <div class="flex ${isUser ? 'justify-end' : 'justify-start'}">
          <div class="max-w-3xl ${isUser ? 'ml-12' : 'mr-12'}">
            <!-- Message Header -->
            <div class="flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}">
              ${!isUser ? `
                <div class="w-8 h-8 rounded-full glass-panel flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              ` : ''}
              <span class="text-sm text-gray-400">
                ${isUser ? 'You' : message.model || 'Assistant'}
              </span>
              ${message.isEdited ? `
                <span class="text-xs text-gray-500">(edited)</span>
              ` : ''}
            </div>

            <!-- Message Bubble -->
            <div class="${isUser ? 'glass-interactive bg-blue-500/20' : 'glass-panel'} p-4 rounded-lg">
              ${message.imageUrl ? `
                <img src="${message.imageUrl}" alt="Uploaded image" class="max-w-sm rounded-lg mb-3" />
              ` : ''}
              
              <div class="prose prose-invert max-w-none message-content">
                ${contentHTML}
              </div>

              <!-- Message Actions -->
              <div class="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                ${isUser ? `
                  <button 
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    onclick="window.editMessagePrompt('${message.id}')"
                    title="Edit message"
                  >
                    <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                ` : ''}
                
                ${message.versions && message.versions.length > 1 ? `
                  <button 
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    onclick="window.cycleMessageVersion('${message.id}', ${message.currentVersionIndex || 0}, ${message.versions.length})"
                    title="View previous versions"
                  >
                    <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${(message.currentVersionIndex || 0) + 1}/${message.versions.length}
                  </button>
                ` : ''}

                <button 
                  class="text-sm text-gray-400 hover:text-white transition-colors"
                  onclick="window.copyMessageContent(\`${this.escapeBackticks(message.content)}\`)"
                  title="Copy message"
                >
                  <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderMessageContent(content: string): string {
    try {
      // Parse markdown to HTML
      const html = marked.parse(content) as string;
      return html;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return content.replace(/\n/g, '<br>');
    }
  }

  private escapeBackticks(str: string): string {
    return str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  }
}

// Global functions for message interactions
if (typeof window !== 'undefined') {
  (window as any).editMessagePrompt = (messageId: string) => {
    const state = chatStore.getState();
    const currentChat = state.chats.find(
      (chat) => chat.id === state.chatState.currentChatId
    );
    if (!currentChat) return;

    const message = currentChat.messages.find((m) => m.id === messageId);
    if (!message) return;

    const newContent = prompt('Edit your message:', message.content);
    if (newContent && newContent !== message.content) {
      editMessage(messageId, newContent);
    }
  };

  (window as any).cycleMessageVersion = (
    messageId: string,
    currentIndex: number,
    totalVersions: number
  ) => {
    const nextIndex = (currentIndex + 1) % totalVersions;
    switchMessageVersion(messageId, nextIndex);
  };

  (window as any).copyMessageContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Could add a toast notification here
      console.log('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
}
