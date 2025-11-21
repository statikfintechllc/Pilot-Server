/**
 * Component Loader
 * Loads and mounts all UI components into the DOM
 */

class ComponentLoader {
  constructor() {
    this.components = [];
    this.initialized = false;
  }

  loadComponents() {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) {
      console.error('app-root element not found');
      return Promise.reject(new Error('app-root element not found'));
    }

    // Load components in order
    const componentConfigs = [
      { name: 'BackgroundComponent', Component: window.BackgroundComponent, container: document.body },
      { name: 'NavbarComponent', Component: window.NavbarComponent, container: document.body },
      { name: 'ChatboxComponent', Component: window.ChatboxComponent, container: appRoot },
      { name: 'ChatbarComponent', Component: window.ChatbarComponent, container: appRoot },
      { name: 'SendButtonComponent', Component: window.SendButtonComponent, container: appRoot }
    ];

    componentConfigs.forEach(({ name, Component, container }, idx) => {
      if (Component) {
        try {
          const instance = new Component();
          instance.mount(container);
          this.components.push(instance);
        } catch (error) {
          console.error(`Failed to mount ${name}:`, error);
        }
      } else {
        console.warn(
          `Component at index ${idx} (${name}) not found or failed to load. ` +
          `Check that the script loaded correctly.`
        );
      }
    });
    
    return Promise.resolve();
  }

  init() {
    // Prevent multiple initializations
    if (this.initialized) {
      console.warn('ComponentLoader already initialized');
      return Promise.resolve();
    }
    this.initialized = true;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', () => {
          this.loadComponents().then(resolve);
        });
      });
    } else {
      return this.loadComponents();
    }
  }
}

// Export for use by init.js
if (typeof window !== 'undefined') {
  window.ComponentLoader = ComponentLoader;
}
