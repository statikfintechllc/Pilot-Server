/**
 * Message Input Component
 * Text input with send button and image upload support
 */

import { chatStore, sendMessage } from '../../state/chat';

export class MessageInput {
  private container: HTMLElement;
  private textarea: HTMLTextAreaElement | null = null;
  private imagePreviewUrl: string | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();

    // Subscribe to chat store for loading state
    chatStore.subscribe(() => {
      this.updateLoadingState();
    });
  }

  private render(): void {
    const state = chatStore.getState();
    const isLoading = state.chatState.isLoading;

    this.container.className = 'glass-panel p-4 border-t border-white/10';

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto">
        ${this.imagePreviewUrl ? `
          <div class="mb-3 relative inline-block">
            <img src="${this.imagePreviewUrl}" alt="Preview" class="max-w-xs max-h-32 rounded-lg" />
            <button 
              class="absolute top-1 right-1 glass-button p-1 bg-red-500/80 hover:bg-red-500"
              onclick="window.clearImagePreview()"
              title="Remove image"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ` : ''}
        
        <div class="flex items-end gap-2">
          <!-- Image Upload Button -->
          <label class="glass-button p-3 cursor-pointer hover:bg-white/10" title="Upload image">
            <input 
              type="file" 
              accept="image/*" 
              class="hidden" 
              onchange="window.handleImageUpload(event)"
              ${isLoading ? 'disabled' : ''}
            />
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>

          <!-- Text Input -->
          <div class="flex-1 glass-input rounded-lg">
            <textarea 
              id="message-input"
              class="w-full bg-transparent text-white p-3 resize-none focus:outline-none"
              placeholder="${isLoading ? 'AI is thinking...' : 'Type your message...'}"
              rows="1"
              ${isLoading ? 'disabled' : ''}
              onkeydown="window.handleInputKeyDown(event)"
              oninput="window.autoResizeTextarea()"
            ></textarea>
          </div>

          <!-- Send Button -->
          <button 
            class="glass-button p-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/20'}"
            onclick="window.handleSendMessage()"
            ${isLoading ? 'disabled' : ''}
            title="${isLoading ? 'Sending...' : 'Send message'}"
          >
            ${isLoading ? `
              <svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ` : `
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            `}
          </button>
        </div>

        <div class="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    `;

    // Cache textarea reference
    this.textarea = this.container.querySelector('#message-input');
  }

  private updateLoadingState(): void {
    const state = chatStore.getState();
    const isLoading = state.chatState.isLoading;

    if (this.textarea) {
      this.textarea.disabled = isLoading;
      this.textarea.placeholder = isLoading
        ? 'AI is thinking...'
        : 'Type your message...';
    }
  }

  private async handleSend(): Promise<void> {
    if (!this.textarea) return;

    const content = this.textarea.value.trim();
    if (!content) return;

    const state = chatStore.getState();
    if (state.chatState.isLoading) return;

    // Send message
    await sendMessage(content, this.imagePreviewUrl || undefined);

    // Clear input
    this.textarea.value = '';
    this.imagePreviewUrl = null;
    this.autoResize();
    this.render();
  }

  private handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
        this.render();
      };
      reader.readAsDataURL(file);
    }
  }

  private clearImagePreview(): void {
    this.imagePreviewUrl = null;
    this.render();
  }

  private autoResize(): void {
    if (!this.textarea) return;

    this.textarea.style.height = 'auto';
    const newHeight = Math.min(this.textarea.scrollHeight, 200);
    this.textarea.style.height = newHeight + 'px';
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
  }
}

// Global functions
if (typeof window !== 'undefined') {
  let messageInputInstance: MessageInput | null = null;

  (window as any).__setMessageInputInstance = (instance: MessageInput) => {
    messageInputInstance = instance;
  };

  (window as any).handleSendMessage = () => {
    if (messageInputInstance) {
      (messageInputInstance as any).handleSend();
    }
  };

  (window as any).handleImageUpload = (event: Event) => {
    if (messageInputInstance) {
      (messageInputInstance as any).handleImageUpload(event);
    }
  };

  (window as any).clearImagePreview = () => {
    if (messageInputInstance) {
      (messageInputInstance as any).clearImagePreview();
    }
  };

  (window as any).autoResizeTextarea = () => {
    if (messageInputInstance) {
      (messageInputInstance as any).autoResize();
    }
  };

  (window as any).handleInputKeyDown = (event: KeyboardEvent) => {
    if (messageInputInstance) {
      (messageInputInstance as any).handleKeyDown(event);
    }
  };
}
