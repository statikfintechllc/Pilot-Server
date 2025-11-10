/**
 * Main entry point for vanilla JS PWA
 * Initializes the application, router, theme, and state
 */

import { router } from './router';
import { Store } from './framework/store';

// Global app state interface
interface AppState {
  currentChatId: string | null;
  selectedModel: string;
  isLoading: boolean;
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
}

// Initialize global store
export const appStore = new Store<AppState>({
  currentChatId: null,
  selectedModel: 'gpt-4o-mini',
  isLoading: false,
  theme: 'dark',
  sidebarCollapsed: false,
});

/**
 * Initialize theme on app load
 */
function initTheme(): void {
  const savedTheme = localStorage.getItem('theme') as AppState['theme'] || 'dark';
  appStore.setState({ theme: savedTheme });
  
  // Apply theme to document
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Listen for theme changes
  appStore.subscribe(state => {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
  });
}

/**
 * Mount the app shell
 */
function mountApp(): void {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found!');
    return;
  }

  // Create basic app structure
  root.innerHTML = `
    <div class="h-screen flex bg-background overflow-hidden">
      <div id="sidebar" class="glass-sidebar"></div>
      <div id="main-content" class="flex-1 flex flex-col min-w-0 min-h-0 relative max-h-screen overflow-hidden">
        <div id="header" class="glass-panel"></div>
        <div id="model-bubble" class="fixed"></div>
        <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div id="messages" class="flex-1 overflow-y-auto"></div>
          <div id="input" class="glass-panel"></div>
        </div>
      </div>
    </div>
  `;

  console.log('App shell mounted');
}

/**
 * Initialize router and routes
 */
function initRouter(): void {
  // Main chat route
  router.on('/', (params) => {
    console.log('Navigating to main chat');
    renderChatApp();
  });

  // OAuth callback route
  router.on('/auth/callback', async (params) => {
    console.log('Handling OAuth callback');
    const code = params.get('code');
    if (code) {
      // Handle OAuth - will be implemented in auth state
      console.log('OAuth code received:', code);
      // Redirect to main app after handling
      setTimeout(() => router.navigate('/'), 1500);
    }
  });

  // Signup route
  router.on('/signup', () => {
    console.log('Navigating to signup');
    renderSignup();
  });

  // Fallback to main app
  router.otherwise(() => {
    router.navigate('/');
  });

  // Initialize router
  router.init();
}

/**
 * Render main chat app
 */
function renderChatApp(): void {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <div class="h-screen flex bg-background overflow-hidden">
      <div class="flex-1 flex items-center justify-center">
        <div class="glass-card p-8 text-center">
          <h1 class="text-2xl font-bold mb-4">Pilot Server</h1>
          <p class="text-gray-400 mb-4">Vanilla JS PWA - Under Construction</p>
          <p class="text-sm text-gray-500">Chat interface will be rendered here</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render signup page
 */
function renderSignup(): void {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <div class="h-screen flex bg-background items-center justify-center">
      <div class="glass-card p-8 max-w-md w-full">
        <h1 class="text-2xl font-bold mb-4">Sign Up</h1>
        <p class="text-gray-400 mb-4">Create your account</p>
        <button class="glass-button w-full" onclick="window.location.hash = '/'">
          Back to App
        </button>
      </div>
    </div>
  `;
}

/**
 * Initialize the application
 */
function init(): void {
  console.log('Initializing Pilot Server...');
  
  // Initialize theme system
  initTheme();
  
  // Initialize router
  initRouter();
  
  console.log('Pilot Server initialized successfully');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
if (typeof window !== 'undefined') {
  (window as any).__APP_STORE__ = appStore;
  (window as any).__ROUTER__ = router;
}
