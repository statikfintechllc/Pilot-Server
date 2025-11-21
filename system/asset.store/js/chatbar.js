/**
 * Chatbar Component
 * Creates the input area container
 */

class ChatbarComponent {
  constructor() {
    this.element = null;
  }

  render() {
    const inputArea = document.createElement('div');
    inputArea.id = 'chat-input';
    inputArea.className = 'copilot-input-bar';
    
    const textarea = document.createElement('textarea');
    textarea.id = 'chat-input-field';
    textarea.className = 'copilot-input';
    textarea.placeholder = 'Ask about your trading...';
    textarea.rows = 1;
    
    inputArea.appendChild(textarea);
    
    return inputArea;
  }

  mount(container) {
    this.element = this.render();
    container.appendChild(this.element);
  }
}

// Export for use by component loader
if (typeof window !== 'undefined') {
  window.ChatbarComponent = ChatbarComponent;
}
