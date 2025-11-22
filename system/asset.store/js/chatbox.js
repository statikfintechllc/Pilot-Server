/**
 * Chatbox Component
 * Creates the chat messages container
 */

class ChatboxComponent {
  constructor() {
    this.element = null;
  }

  render() {
    const chatRoot = document.createElement('div');
    chatRoot.id = 'chat-root';
    chatRoot.className = 'flex flex-col';
    chatRoot.style.cssText = 'z-index: 1; overflow: hidden;';
    
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'chat-messages';
    messagesContainer.className = 'flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 space-y-4';
    messagesContainer.style.cssText = '-webkit-overflow-scrolling: touch; overscroll-behavior: contain; padding-bottom: 120px;';
    
    messagesContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-12 px-4">
        <div class="bg-gradient-to-br from-purple-500/20 to-transparent rounded-full p-4 mb-4">
          <svg class="w-12 h-12 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Welcome to GitHub Copilot</h3>
        <p class="text-gray-400 max-w-md">Ask me anything about trading, analyze your trades, or get help with your trading journal. I'm here to assist you!</p>
      </div>
    `;
    
    chatRoot.appendChild(messagesContainer);
    return chatRoot;
  }

  mount(container) {
    this.element = this.render();
    container.appendChild(this.element);
  }
}

// Export for use by component loader
if (typeof window !== 'undefined') {
  window.ChatboxComponent = ChatboxComponent;
}
