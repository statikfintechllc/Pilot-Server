/**
 * Component Loader
 * Loads and mounts all UI components into the DOM
 */

class ComponentLoader {
  constructor() {
    this.components = [];
  }

  loadComponents() {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) {
      console.error('app-root element not found');
      return;
    }

    // Load components in order
    const components = [
      { Component: window.BackgroundComponent, container: document.body },
      { Component: window.NavbarComponent, container: document.body },
      { Component: window.ChatboxComponent, container: appRoot },
      { Component: window.ChatbarComponent, container: appRoot },
      { Component: window.SendButtonComponent, container: appRoot }
    ];

    components.forEach(({ Component, container }) => {
      if (Component) {
        const instance = new Component();
        instance.mount(container);
        this.components.push(instance);
      }
    });
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.loadComponents());
    } else {
      this.loadComponents();
    }
  }
}

// Export for use by init.js
if (typeof window !== 'undefined') {
  window.ComponentLoader = ComponentLoader;
}
