/**
 * Main entry point for vanilla JS PWA
 * Initializes the application, router, theme, and state
 */

import { router } from './router';
import { Store } from './framework/store';
import { initAuth, authStore, handleOAuthCallback } from './state/auth';
import { chatStore } from './state/chat';

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
    renderOAuthCallback();
    
    const code = params.get('code');
    if (code) {
      await handleOAuthCallback(code);
      // Redirect to main app after handling
      setTimeout(() => router.navigate('/'), 1500);
    } else {
      // No code, redirect immediately
      router.navigate('/');
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

  const authState = authStore.getState();
  const chatState = chatStore.getState();

  root.innerHTML = `
    <div class="h-screen flex bg-background overflow-hidden">
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="glass-card p-8 max-w-2xl w-full text-center space-y-6">
          <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Pilot Server
          </h1>
          <p class="text-xl text-gray-400 mb-4">Vanilla JS PWA</p>
          
          <div class="glass-panel p-6 text-left space-y-4">
            <h2 class="text-lg font-semibold text-gray-200">Migration Status</h2>
            <ul class="text-sm text-gray-400 space-y-2">
              <li>✅ Build system: esbuild + PostCSS + Tailwind v4</li>
              <li>✅ Framework: Vanilla TypeScript with Store + Router</li>
              <li>✅ State management: chat.ts and auth.ts</li>
              <li>✅ PWA: Service worker + manifest configured</li>
              <li>🚧 UI components: In progress</li>
              <li>🚧 Chat functionality: In progress</li>
            </ul>
          </div>

          <div class="glass-panel p-6 text-left space-y-4">
            <h2 class="text-lg font-semibold text-gray-200">Auth Status</h2>
            ${authState.isAuthenticated ? `
              <div class="flex items-center gap-4">
                ${authState.user?.avatar_url ? `
                  <img src="${authState.user.avatar_url}" alt="Avatar" class="w-12 h-12 rounded-full" />
                ` : ''}
                <div>
                  <p class="text-white font-semibold">${authState.user?.name || 'User'}</p>
                  <p class="text-sm text-gray-400">@${authState.user?.login || 'unknown'}</p>
                </div>
              </div>
              <button class="glass-button w-full mt-4" onclick="window.signOut()">
                Sign Out
              </button>
            ` : `
              <p class="text-gray-400 text-sm">Not authenticated - running in localStorage mode</p>
              <button class="glass-button w-full" onclick="window.signIn()">
                Sign In with GitHub
              </button>
            `}
          </div>

          <div class="glass-panel p-6 text-left space-y-4">
            <h2 class="text-lg font-semibold text-gray-200">Chat State</h2>
            <p class="text-sm text-gray-400">
              Chats: ${chatState.chats.length}<br>
              Selected Model: ${chatState.chatState.selectedModel}<br>
              Current Chat: ${chatState.chatState.currentChatId || 'None'}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render OAuth callback loading state
 */
function renderOAuthCallback(): void {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <div class="h-screen flex bg-background items-center justify-center">
      <div class="glass-card p-8 max-w-md w-full text-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <h2 class="text-xl font-semibold">Processing Authentication...</h2>
        <p class="text-gray-400 text-sm">Please wait while we complete your sign-in.</p>
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
      <div class="glass-card p-8 max-w-md w-full text-center space-y-4">
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
async function init(): Promise<void> {
  console.log('Initializing Pilot Server...');
  
  // Initialize theme system
  initTheme();
  
  // Initialize authentication
  await initAuth();
  
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

// Export auth functions to window for button handlers
if (typeof window !== 'undefined') {
  (window as any).__APP_STORE__ = appStore;
  (window as any).__ROUTER__ = router;
  (window as any).__AUTH_STORE__ = authStore;
  (window as any).__CHAT_STORE__ = chatStore;
  
  // Import auth functions for global access
  import('./state/auth').then(({ signIn, signOut, clearError }) => {
    (window as any).signIn = signIn;
    (window as any).signOut = signOut;
    (window as any).clearError = clearError;
  });
}
