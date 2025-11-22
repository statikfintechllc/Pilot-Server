/**
 * Keyboard Manager
 * Manages keyboard interactions and shortcuts
 */

class KeyboardManager {
  constructor() {
    this.initialized = false;
  }

  init() {
    // Prevent multiple initializations
    if (this.initialized) {
      console.warn('KeyboardManager already initialized');
      return;
    }
    this.initialized = true;
    
    // Handle Enter key in chat input
    const chatInput = document.getElementById('chat-input-field');
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const sendButton = document.getElementById('send-button');
          if (sendButton) {
            sendButton.click();
          }
        }
      });
    }

    // Handle ESC key for closing dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close model dropdown
        const modelDropdown = document.getElementById('model-dropdown');
        if (modelDropdown && modelDropdown.style.display !== 'none') {
          modelDropdown.style.display = 'none';
        }
        
        // Close history dropdown
        const historyDropdown = document.getElementById('history-dropdown');
        if (historyDropdown && historyDropdown.style.display !== 'none') {
          historyDropdown.style.display = 'none';
        }
        
        // Close sidebar
        const sidebar = document.getElementById('copilot-nav-sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          const overlay = document.getElementById('copilot-nav-overlay');
          if (overlay) overlay.classList.remove('active');
        }
      }
    });
  }
}

// Export for use by init.js
if (typeof window !== 'undefined') {
  window.KeyboardManager = KeyboardManager;
}
