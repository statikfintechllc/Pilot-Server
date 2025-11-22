/**
 * Navbar Component
 * Creates the unified navigation and copilot header bar
 */

class NavbarComponent {
  constructor() {
    this.element = null;
  }

  render() {
    const nav = document.createElement('nav');
    nav.id = 'chat-header';
    nav.className = 'navbar copilot-unified-header';
    
    nav.innerHTML = `
      <div class="nav-container">
        <!-- Left: Hamburger Menu -->
        <button class="nav-toggle" id="copilot-menu-toggle" aria-label="Toggle navigation">
          <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <!-- Center: Copilot Title & Model Selector -->
        <div class="copilot-header-center">
          <div class="copilot-header-title">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>Copilot</span>
          </div>
          
          <div class="copilot-model-selector">
            <button class="copilot-model-button" id="model-selector-button">
              <span id="current-model-name">GPT-4o</span>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
            <div class="copilot-model-dropdown" id="model-dropdown">
              <!-- Models will be populated by JavaScript -->
            </div>
          </div>
        </div>
        
        <!-- Right: History & New Chat -->
        <div class="copilot-header-right">
          <button class="copilot-history-button" id="history-button">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>History</span>
          </button>
          
          <div class="copilot-history-dropdown" id="history-dropdown">
            <div id="history-list">
              <div class="copilot-history-empty">No chat history yet</div>
            </div>
          </div>
          
          <button class="copilot-new-chat-button" id="copilot-new-chat" aria-label="New Chat">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    // Also create the sidebar and overlay
    const sidebar = document.createElement('div');
    sidebar.className = 'copilot-nav-sidebar';
    sidebar.id = 'copilot-nav-sidebar';
    sidebar.innerHTML = `
      <div class="copilot-nav-header">
        <a href="index.html" class="copilot-nav-brand">
          <span>SFTi-Pennies</span>
        </a>
        <button class="copilot-nav-close" id="copilot-nav-close">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <ul class="copilot-nav-menu">
        <li><a href="index.html" class="copilot-nav-link">Home</a></li>
        <li><a href="books.html" class="copilot-nav-link">Books</a></li>
        <li><a href="notes.html" class="copilot-nav-link">Notes</a></li>
        <li class="copilot-nav-section">
          <div class="copilot-nav-section-title">Trades</div>
          <ul>
            <li><a href="all-trades.html" class="copilot-nav-link">All Trades</a></li>
            <li><a href="all-weeks.html" class="copilot-nav-link">All Summaries</a></li>
            <li><a href="analytics.html" class="copilot-nav-link">Analytics</a></li>
            <li><a href="import.html" class="copilot-nav-link">Import CSV</a></li>
          </ul>
        </li>
        <li class="copilot-nav-section">
          <div class="copilot-nav-section-title">Mentors</div>
          <ul>
            <li><a href="https://www.timothysykes.com/" target="_blank" rel="noopener noreferrer" class="copilot-nav-link">Timothy Sykes</a></li>
            <li><a href="https://www.stockstotrade.com/" target="_blank" rel="noopener noreferrer" class="copilot-nav-link">Tim Bohen</a></li>
          </ul>
        </li>
      </ul>
    `;
    
    const overlay = document.createElement('div');
    overlay.className = 'copilot-nav-overlay';
    overlay.id = 'copilot-nav-overlay';
    
    return { nav, sidebar, overlay };
  }

  mount(container) {
    const components = this.render();
    this.element = components.nav;
    this.sidebar = components.sidebar;
    this.overlay = components.overlay;
    
    container.appendChild(components.nav);
    container.appendChild(components.sidebar);
    container.appendChild(components.overlay);
  }
}

// Export for use by component loader
if (typeof window !== 'undefined') {
  window.NavbarComponent = NavbarComponent;
}
