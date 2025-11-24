/**
 * Application Initialization
 * Initializes all managers and starts the application
 */

(function() {
  'use strict';

  // Initialize application when DOM is ready
  function initializeApp() {
    // Initialize component loader
    if (window.ComponentLoader) {
      const componentLoader = new window.ComponentLoader();
      componentLoader.init().then(() => {
        // Initialize managers after components are mounted
        
        // Initialize keyboard manager
        if (window.KeyboardManager) {
          const keyboardManager = new window.KeyboardManager();
          keyboardManager.init();
        }

        // Initialize viewport manager
        if (window.ViewportManager) {
          const viewportManager = new window.ViewportManager();
          viewportManager.init();
        }

        // Initialize message handler
        if (window.MessageHandler) {
          const messageHandler = new window.MessageHandler();
          messageHandler.init();
        }

        // Initialize Copilot Chat (singleton pattern)
        if (!window.copilotChat && window.CopilotChat) {
          window.copilotChat = new window.CopilotChat();
          window.copilotChat.init();
        }

        console.log('Application initialized successfully');
      }).catch((error) => {
        console.error('Failed to initialize application:', error);
      });
    }
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();
