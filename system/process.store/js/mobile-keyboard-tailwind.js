/**
 * Mobile Keyboard Handler for Tailwind Chat Component
 * 
 * Creates chat input elements dynamically to avoid mobile browser
 * DOM positioning issues with keyboards.
 */

class MobileChatKeyboard {
  // Constants
  static TEXTAREA_MAX_HEIGHT = 150; // Maximum textarea height (in pixels, matches CSS max-height)
  
  constructor(rootElementId = 'chat-root') {
    this.root = document.getElementById(rootElementId);
    this.messages = document.getElementById('chat-messages');
    
    if (!this.root || !this.messages) {
      console.warn('MobileChatKeyboard: Required elements not found');
      return;
    }
    
    // Create entire input bar container, textarea, and button dynamically
    this.createInputBar();
    
    // Setup textarea auto-resize
    this.setupTextareaAutoResize();
  }
  
  /**
   * Create entire input bar container with textarea and send button
   */
  createInputBar() {
    // Create input bar container
    this.input = document.createElement('div');
    this.input.id = 'chat-input';
    this.input.className = 'copilot-input-bar';
    
    // Create textarea
    this.inputField = document.createElement('textarea');
    this.inputField.id = 'chat-input-field';
    this.inputField.className = 'copilot-input';
    this.inputField.placeholder = 'Ask about your trading...';
    this.inputField.rows = 1;
    
    // Create send button
    const sendButton = document.createElement('button');
    sendButton.id = 'send-button';
    sendButton.className = 'copilot-send';
    sendButton.innerHTML = `
      <span>Send</span>
      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
      </svg>
    `;
    
    // Append textarea and button to input bar
    this.input.appendChild(this.inputField);
    this.input.appendChild(sendButton);
    
    // Append input bar to chat root
    this.root.appendChild(this.input);
  }
  
  /**
   * Setup auto-resize for textarea
   */
  setupTextareaAutoResize() {
    this.inputField.addEventListener('input', () => {
      // Reset height to auto to get the correct scrollHeight
      this.inputField.style.height = 'auto';
      
      // Set height to scrollHeight, with max constraint
      const maxHeight = MobileChatKeyboard.TEXTAREA_MAX_HEIGHT;
      const newHeight = Math.min(this.inputField.scrollHeight, maxHeight);
      this.inputField.style.height = `${newHeight}px`;
    });
    
    // Reset height on Enter key
    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        // Submit message (implement your send logic here)
        e.preventDefault();
        this.inputField.style.height = 'auto';
      }
    });
  }
  
  /**
   * Static initializer
   */
  static init(rootElementId = 'chat-root') {
    return new MobileChatKeyboard(rootElementId);
  }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    MobileChatKeyboard.init();
  });
} else {
  MobileChatKeyboard.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileChatKeyboard;
}