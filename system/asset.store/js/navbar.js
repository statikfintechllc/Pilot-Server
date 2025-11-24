/**
 * Navbar Component
 * Creates floating glassmorphic bubbles for navigation
 */

class NavbarComponent {
  constructor() {
    this.element = null;
    this.isAuthenticated = false;
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    // Check if user is authenticated via GitHub
    const storedPAT = localStorage.getItem('github_pat');
    this.isAuthenticated = storedPAT !== null;
  }

  render() {
    const nav = document.createElement('nav');
    nav.id = 'chat-header';
    nav.className = 'navbar copilot-unified-header';
    
    nav.innerHTML = `
      <div class="nav-container">
        <!-- Profile Bubble - Icon only on mobile -->
        <div class="nav-bubble profile-bubble">
          <select class="nav-native-select profile-select" id="profile-select" aria-label="Profile menu">
            <option value="" disabled selected>Profile</option>
            <option value="${this.isAuthenticated ? 'logout' : 'login'}">${this.isAuthenticated ? 'Logout' : 'Sign In'}</option>
            <option value="preferences">Preferences</option>
          </select>
          <svg class="bubble-icon profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        
        <!-- Model Selector Bubble - No icon, dynamically sized -->
        <div class="nav-bubble model-bubble">
          <select class="nav-native-select model-select" id="model-selector" aria-label="Select AI model">
            <optgroup label="Fast & Efficient">
              <option value="gpt-5-mini">GPT-5-mini</option>
              <option value="grok-code-fast-1">Grok Code Fast 1</option>
            </optgroup>
            <optgroup label="Versatile and Highly Intelligent">
              <option value="gpt-4.1">GPT-4.1</option>
              <option value="gpt-5">GPT-5</option>
              <option value="gpt-4o" selected>GPT-4o</option>
              <option value="claude-sonnet-3.5">Claude Sonnet 3.5</option>
              <option value="claude-sonnet-4">Claude Sonnet 4</option>
              <option value="claude-sonnet-4.5">Claude Sonnet 4.5</option>
              <option value="claude-haiku-4.5">Claude Haiku 4.5</option>
            </optgroup>
            <optgroup label="Most Powerful at Complex Tasks">
              <option value="claude-opus-4.1">Claude Opus 4.1</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            </optgroup>
          </select>
        </div>
        
        <!-- Recent Chats Bubble - Native select on mobile, button on desktop -->
        <div class="nav-bubble history-bubble">
          <select class="nav-native-select history-select" id="history-select" aria-label="Recent chats">
            <option value="" disabled selected>History</option>
            <!-- History items will be populated by JavaScript -->
          </select>
          <svg class="bubble-icon history-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <!-- New Chat Bubble - Icon only on mobile -->
        <div class="nav-bubble new-chat-bubble">
          <button class="nav-bubble-button" id="copilot-new-chat" aria-label="New Chat">
            <svg class="bubble-icon new-chat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="bubble-label">New Chat</span>
          </button>
        </div>
      </div>
    `;
    
    // No sidebar or overlay needed anymore
    return { nav };
  }

  mount(container) {
    const components = this.render();
    this.element = components.nav;
    
    container.appendChild(components.nav);
    
    // Attach event listeners after mounting
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Use dataset to prevent duplicate listener attachment
    
    // Profile select handler
    const profileSelect = document.getElementById('profile-select');
    if (profileSelect && !profileSelect.dataset.listenersAttached) {
      profileSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        if (value === 'login') {
          this.handleLogin();
        } else if (value === 'logout') {
          this.handleLogout();
        } else if (value === 'preferences') {
          window.location.href = 'system/system.html';
        }
        // Reset select to default
        e.target.value = '';
      });
      profileSelect.dataset.listenersAttached = 'true';
    }

    // Model selector handler
    const modelSelect = document.getElementById('model-selector');
    if (modelSelect && !modelSelect.dataset.listenersAttached) {
      modelSelect.addEventListener('change', (e) => {
        const modelId = e.target.value;
        if (modelId) {
          this.handleModelChange(modelId);
        }
      });
      modelSelect.dataset.listenersAttached = 'true';
    }

    // History select handler
    const historySelect = document.getElementById('history-select');
    if (historySelect && !historySelect.dataset.listenersAttached) {
      historySelect.addEventListener('change', (e) => {
        const chatId = e.target.value;
        if (chatId) {
          // Dispatch event for loading chat
          const event = new CustomEvent('loadChat', { detail: { chatId } });
          document.dispatchEvent(event);
        }
        // Reset select to default
        e.target.value = '';
      });
      historySelect.dataset.listenersAttached = 'true';
    }
  }

  handleLogin() {
    // Show authentication prompt
    if (window.showAuthPrompt) {
      window.showAuthPrompt();
    } else {
      console.error('Authentication system not loaded. Please refresh the page.');
    }
  }

  handleLogout() {
    // TODO: Replace with custom modal dialog to match glassmorphic design
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('github_pat');
      this.checkAuthStatus(); // Update authentication state
      
      // Re-render navbar to update all options
      const container = this.element.parentElement;
      this.element.remove();
      this.mount(container);
      
      console.log('Logged out successfully');
    }
  }

  handleModelChange(modelId) {
    // Check if authenticated
    if (!this.isAuthenticated) {
      // Automatically trigger the login prompt when user tries to select a model
      this.handleLogin();
      
      // Reset to default model
      const modelSelect = document.getElementById('model-selector');
      if (modelSelect) {
        modelSelect.value = 'gpt-4o';
      }
      return;
    }

    // Dispatch event for model change
    const event = new CustomEvent('modelChanged', { detail: { modelId } });
    document.dispatchEvent(event);
  }
}

// Export for use by component loader
if (typeof window !== 'undefined') {
  window.NavbarComponent = NavbarComponent;
}
