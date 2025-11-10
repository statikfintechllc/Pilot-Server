/**
 * Chat Header Component
 * Display app title, actions, and status indicators
 */

import { chatStore } from '../../state/chat';
import { authStore } from '../../state/auth';

export class ChatHeader {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();

    // Subscribe to store changes
    chatStore.subscribe(() => this.render());
    authStore.subscribe(() => this.render());
  }

  private render(): void {
    const chatState = chatStore.getState();
    const authState = authStore.getState();

    this.container.className = 'glass-panel p-4 border-b border-white/10';

    this.container.innerHTML = `
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Left: Title -->
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Pilot Server
          </h1>
          ${chatState.chatState.isLoading ? `
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Thinking...</span>
            </div>
          ` : ''}
        </div>

        <!-- Right: User Info -->
        <div class="flex items-center gap-3">
          ${authState.isAuthenticated && authState.user ? `
            <div class="flex items-center gap-2">
              ${authState.user.avatar_url ? `
                <img 
                  src="${authState.user.avatar_url}" 
                  alt="${authState.user.name}" 
                  class="w-8 h-8 rounded-full"
                />
              ` : ''}
              <span class="text-sm text-gray-300 hidden md:block">${authState.user.login}</span>
            </div>
          ` : `
            <button 
              class="glass-button px-4 py-2 text-sm hover:bg-white/10"
              onclick="window.signIn()"
            >
              Sign In
            </button>
          `}

          <!-- Settings/Menu Button -->
          <button 
            class="glass-button p-2 hover:bg-white/10"
            onclick="window.toggleSettings()"
            title="Settings"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}

// Global functions
if (typeof window !== 'undefined') {
  (window as any).toggleSettings = () => {
    alert('Settings dialog coming soon!');
    // TODO: Implement settings dialog
  };
}
