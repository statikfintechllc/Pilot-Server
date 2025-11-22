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
        <!-- Profile Bubble -->
        <div class="nav-bubble profile-bubble">
          <select class="nav-native-select profile-select" id="profile-select" aria-label="Profile menu">
            <option value="" disabled selected>Profile</option>
            <option value="${this.isAuthenticated ? 'logout' : 'login'}">${this.isAuthenticated ? 'Logout' : 'Sign In'}</option>
            <option value="preferences">Preferences</option>
          </select>
          <svg class="bubble-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        
        <!-- Model Selector Bubble -->
        <div class="nav-bubble model-bubble">
          <select class="nav-native-select model-select" id="model-selector" aria-label="Select AI model">
            <option value="" disabled selected>Select Model</option>
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
          <svg class="bubble-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        
        <!-- Recent Chats Bubble -->
        <div class="nav-bubble history-bubble">
          <button class="nav-bubble-button" id="history-button" aria-label="Recent chats">
            <svg class="bubble-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="bubble-label">History</span>
          </button>
          
          <div class="copilot-history-dropdown" id="history-dropdown">
            <div id="history-list">
              <div class="copilot-history-empty">No chat history yet</div>
            </div>
          </div>
        </div>
        
        <!-- New Chat Bubble -->
        <div class="nav-bubble new-chat-bubble">
          <button class="nav-bubble-button" id="copilot-new-chat" aria-label="New Chat">
            <svg class="bubble-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    // Profile select handler
    const profileSelect = document.getElementById('profile-select');
    if (profileSelect) {
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
    }

    // Model selector handler
    const modelSelect = document.getElementById('model-selector');
    if (modelSelect) {
      modelSelect.addEventListener('change', (e) => {
        const modelId = e.target.value;
        if (modelId) {
          this.handleModelChange(modelId);
        }
      });
    }
  }

  handleLogin() {
    // Show authentication prompt
    if (window.showAuthPrompt) {
      window.showAuthPrompt();
    } else {
      alert('Authentication system not loaded. Please refresh the page.');
    }
  }

  handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('github_pat');
      this.isAuthenticated = false;
      alert('Logged out successfully');
      window.location.reload();
    }
  }

  handleModelChange(modelId) {
    // Check if authenticated
    if (!this.isAuthenticated) {
      alert('Please sign in to use AI models. You need a GitHub account to access these models.');
      const modelSelect = document.getElementById('model-selector');
      if (modelSelect) {
        modelSelect.value = 'gpt-4o'; // Reset to default
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
