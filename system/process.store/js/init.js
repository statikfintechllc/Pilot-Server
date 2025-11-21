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
      componentLoader.init();
    }

    // Initialize managers after a short delay to ensure components are mounted
    setTimeout(() => {
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

      console.log('Application initialized successfully');
    }, 100);
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();
