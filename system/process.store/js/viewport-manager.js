/**
 * Viewport Manager
 * Manages viewport adjustments for mobile devices
 */

class ViewportManager {
  constructor() {
    this.isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    this.isMobile = this.isIOS || this.isAndroid;
    this.initialized = false;
    this._resizeHandler = null;
    this._orientationHandler = null;
  }

  init() {
    // Prevent multiple initializations
    if (this.initialized) {
      console.warn('ViewportManager already initialized');
      return;
    }
    this.initialized = true;
    
    if (!this.isMobile) return;

    // Handle viewport resize on mobile
    this._resizeHandler = () => this.handleViewportResize();
    this._orientationHandler = () => {
      // Delay to allow orientation change to complete before recalculating
      setTimeout(() => this.handleViewportResize(), 100);
    };
    
    this.handleViewportResize();
    window.addEventListener('resize', this._resizeHandler);
    window.addEventListener('orientationchange', this._orientationHandler);
  }

  handleViewportResize() {
    // Update CSS custom properties for dynamic sizing
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Adjust chat root bottom position
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      const inputHeight = chatInput.offsetHeight;
      document.documentElement.style.setProperty('--chat-root-bottom', `${inputHeight}px`);
    }
  }
}

// Export for use by init.js
if (typeof window !== 'undefined') {
  window.ViewportManager = ViewportManager;
}
