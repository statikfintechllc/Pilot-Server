/**
 * Send Button Component
 * Creates the send button for the chat input
 */

class SendButtonComponent {
  constructor() {
    this.element = null;
  }

  render() {
    const button = document.createElement('button');
    button.id = 'send-button';
    button.className = 'copilot-send';
    
    button.innerHTML = `
      <span>Send</span>
      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
      </svg>
    `;
    
    return button;
  }

  mount(container) {
    this.element = this.render();
    const chatInput = container.querySelector('#chat-input');
    if (chatInput) {
      chatInput.appendChild(this.element);
    }
  }
}

// Export for use by component loader
if (typeof window !== 'undefined') {
  window.SendButtonComponent = SendButtonComponent;
}
