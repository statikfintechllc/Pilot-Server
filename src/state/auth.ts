/**
 * Authentication state management (vanilla JS port)
 * Handles GitHub OAuth, user session, and available models
 */

import { Store } from '../framework/store';
import { config } from '../lib/config';

export interface GitHubUser {
  id: string;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  bio?: string;
  company?: string;
  location?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// Load initial auth state from localStorage
function loadInitialAuthState(): AuthState {
  const savedAuth = localStorage.getItem('pilot-auth-state');
  if (savedAuth) {
    try {
      return JSON.parse(savedAuth);
    } catch {
      // Invalid saved state
    }
  }

  return {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,
  };
}

// Create auth store
export const authStore = new Store<AuthState>(loadInitialAuthState());

// Auto-save to localStorage on changes
authStore.subscribe((state) => {
  const { isLoading, error, ...persistedState } = state;
  localStorage.setItem('pilot-auth-state', JSON.stringify(persistedState));
  
  // Make auth state available globally for API calls
  (window as any).__AUTH_STATE__ = state;
});

/**
 * Fetch GitHub user details
 */
async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub user');
  }

  const data = await response.json();

  return {
    id: data.id.toString(),
    login: data.login,
    name: data.name || data.login,
    email: data.email || '',
    avatar_url: data.avatar_url,
    bio: data.bio || '',
    company: data.company || '',
    location: data.location || '',
  };
}

/**
 * Initialize authentication on app load
 */
export async function initAuth(): Promise<void> {
  authStore.setState({ ...authStore.getState(), isLoading: true });

  try {
    // Check for existing session
    const state = authStore.getState();
    
    if (state.accessToken) {
      // Validate existing token by fetching user
      try {
        const user = await fetchGitHubUser(state.accessToken);
        authStore.setState({
          isAuthenticated: true,
          user,
          accessToken: state.accessToken,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        // Token is invalid, clear it
        console.error('Invalid token, clearing session:', error);
        authStore.setState({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          isLoading: false,
          error: null,
        });
      }
    } else {
      authStore.setState({ ...authStore.getState(), isLoading: false });
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    authStore.setState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      isLoading: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
}

/**
 * Sign in using GitHub OAuth
 */
export async function signIn(): Promise<void> {
  if (!config.github.enabled) {
    authStore.setState({
      ...authStore.getState(),
      error: 'GitHub OAuth is not configured. Running in localStorage-only mode.',
    });
    return;
  }

  try {
    authStore.setState({ ...authStore.getState(), isLoading: true, error: null });

    // Redirect to GitHub OAuth
    const githubClientId = config.github.clientId;
    const redirectUri = `${window.location.origin}/#/auth/callback`;
    const scope = 'read:user user:email';
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  } catch (error) {
    console.error('Sign in error:', error);
    authStore.setState({
      ...authStore.getState(),
      isLoading: false,
      error: error instanceof Error ? error.message : 'Sign in failed',
    });
  }
}

/**
 * Handle OAuth callback
 */
export async function handleOAuthCallback(code: string): Promise<void> {
  try {
    authStore.setState({ ...authStore.getState(), isLoading: true, error: null });

    // In a real implementation, this would exchange the code for a token
    // via your backend server (to keep client secret secure)
    // For now, we'll show an error since this needs backend support
    
    // TODO: Implement token exchange via backend
    // Example:
    // const response = await fetch('/api/auth/github/callback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ code })
    // });
    // const { access_token } = await response.json();

    authStore.setState({
      ...authStore.getState(),
      isLoading: false,
      error: 'OAuth callback requires backend implementation. Please configure your authentication server.',
    });

    console.warn('OAuth callback received but backend token exchange not implemented');
    console.log('Code:', code);
  } catch (error) {
    console.error('OAuth callback error:', error);
    authStore.setState({
      ...authStore.getState(),
      isLoading: false,
      error: error instanceof Error ? error.message : 'OAuth callback failed',
    });
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  authStore.setState({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,
  });
}

/**
 * Clear error
 */
export function clearError(): void {
  authStore.setState({ ...authStore.getState(), error: null });
}

/**
 * Manually set access token (for testing or development)
 */
export async function setAccessToken(token: string): Promise<void> {
  try {
    authStore.setState({ ...authStore.getState(), isLoading: true });
    
    const user = await fetchGitHubUser(token);
    
    authStore.setState({
      isAuthenticated: true,
      user,
      accessToken: token,
      isLoading: false,
      error: null,
    });
  } catch (error) {
    console.error('Error setting access token:', error);
    authStore.setState({
      ...authStore.getState(),
      isLoading: false,
      error: error instanceof Error ? error.message : 'Invalid access token',
    });
  }
}

// Available AI models
export const AVAILABLE_MODELS = [
  'GPT-4.1',
  'GPT 4o',
  'GPT-5 mini',
  'Grok Code Fast 1',
  'Claude Opus 4(x10)',
  'Claude Opus 4.1(x10)',
  'Claude Sonnet 3.5(x1)',
  'Claude Sonnet 3.7(x1)',
  'Claude Sonnet 3.7 Thinking(x1.25)',
  'Claude Sonnet 4(x1)',
  'Gemini 2.0 Flash(x0.25)',
  'Gemini 2.5 Pro(x1)',
  'GPT-5(x1)',
  'o3(x1)',
  'o3-mini(x0.33)',
  'o4-mini(x0.33)',
] as const;
