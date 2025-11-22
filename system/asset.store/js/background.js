/**
 * Background Component
 * Creates and manages the animated background canvas
 */

class BackgroundComponent {
  constructor() {
    this.canvas = null;
  }

  render() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    return canvas;
  }

  mount(container) {
    this.canvas = this.render();
    container.appendChild(this.canvas);
  }
}

// Export for use by component loader
if (typeof window !== 'undefined') {
  window.BackgroundComponent = BackgroundComponent;
}
