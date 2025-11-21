/**
 * Message Handler
 * Handles message-related logic and events
 */

class MessageHandler {
  constructor() {
    this.initialized = false;
  }

  init() {
    // Prevent multiple initializations
    if (this.initialized) {
      console.warn('MessageHandler already initialized');
      return;
    }
    this.initialized = true;
    
    // Set up event listeners for message handling
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
      sendButton.addEventListener('click', () => this.handleSendMessage());
    }

    const chatInput = document.getElementById('chat-input-field');
    if (chatInput) {
      // Auto-resize textarea
      chatInput.addEventListener('input', (e) => {
        this.autoResizeTextarea(e.target);
      });
    }
  }

  handleSendMessage() {
    const chatInput = document.getElementById('chat-input-field');
    if (!chatInput) return;

    const message = chatInput.value.trim();
    if (message) {
      // Message will be handled by CopilotChat class
      // This is just a placeholder for any additional logic
      console.log('Message handler: preparing to send message');
    }
  }

  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  }
}

// Export for use by init.js
if (typeof window !== 'undefined') {
  window.MessageHandler = MessageHandler;
}
