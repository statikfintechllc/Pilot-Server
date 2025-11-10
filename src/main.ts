/**
 * Main entry point for vanilla JS PWA
 * Initializes the application, router, theme, and state
 */

import { router } from './router';
import { Store } from './framework/store';
import { initAuth, authStore, handleOAuthCallback } from './state/auth';
import { chatStore, createNewChat } from './state/chat';
import { ChatSidebar } from './ui/components/chat-sidebar';
import { ChatHeader } from './ui/components/chat-header';
import { ChatMessages } from './ui/components/chat-messages';
import { MessageInput } from './ui/components/message-input';
import { ModelBubble } from './ui/components/model-bubble';

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
 * Render main chat app with all components
 */
function renderChatApp(): void {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <div class="h-screen flex bg-background overflow-hidden">
      <!-- Sidebar -->
      <div id="chat-sidebar"></div>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 min-h-0 relative max-h-screen overflow-hidden md:ml-72 transition-all duration-300">
        <!-- Header -->
        <div id="chat-header"></div>
        
        <!-- Model Bubble -->
        <div id="model-bubble"></div>
        
        <!-- Messages Area -->
        <div id="chat-messages" class="flex-1 overflow-hidden"></div>
        
        <!-- Input Area -->
        <div id="message-input"></div>
      </div>
    </div>
  `;

  // Initialize components
  const sidebarEl = document.getElementById('chat-sidebar');
  const headerEl = document.getElementById('chat-header');
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('message-input');
  const modelBubbleEl = document.getElementById('model-bubble');

  if (sidebarEl) {
    const sidebar = new ChatSidebar(sidebarEl);
    (window as any).__setSidebarInstance(sidebar);
  }

  if (headerEl) {
    new ChatHeader(headerEl);
  }

  if (messagesEl) {
    new ChatMessages(messagesEl);
  }

  if (inputEl) {
    const input = new MessageInput(inputEl);
    (window as any).__setMessageInputInstance(input);
  }

  if (modelBubbleEl) {
    const bubble = new ModelBubble(modelBubbleEl);
    (window as any).__setModelBubbleInstance(bubble);
  }

  // Create initial chat if none exists
  const state = chatStore.getState();
  if (state.chats.length === 0) {
    createNewChat();
  }
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
