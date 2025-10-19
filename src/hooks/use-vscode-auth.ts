import { useState, useCallback, useEffect } from 'react';
import { authProvider, VSCodeAuthSession } from '@/lib/auth/vscode-auth';
import { supabase } from '@/lib/supabase/client';

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

/**
 * VS Code-style authentication hook with Supabase integration
 */
export function useVSCodeAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isLoading: true,
    error: null,
  });

  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        // Check for existing session
        const session = authProvider.getSession();
        
        if (session) {
          // Fetch user details from GitHub API
          const user = await fetchGitHubUser(session.accessToken);
          setAuthState({
            isAuthenticated: true,
            user,
            accessToken: session.accessToken,
            isLoading: false,
            error: null,
          });
        } else {
          // Check if we're returning from OAuth callback
          const { data: supabaseSession } = await supabase.auth.getSession();
          
          if (supabaseSession?.session) {
            const vscodeSession = await authProvider.handleCallback();
            if (vscodeSession) {
              const user = await fetchGitHubUser(vscodeSession.accessToken);
              setAuthState({
                isAuthenticated: true,
                user,
                accessToken: vscodeSession.accessToken,
                isLoading: false,
                error: null,
              });
            }
          } else {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
        });
      }
    };

    initAuth();

    // Listen for session changes
    const unsubscribe = authProvider.onDidChangeSessions(async (session) => {
      if (session) {
        try {
          const user = await fetchGitHubUser(session.accessToken);
          setAuthState({
            isAuthenticated: true,
            user,
            accessToken: session.accessToken,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Error updating auth state:', error);
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Sign in using VS Code-style authentication
   */
  const signIn = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authProvider.createSession(['read:user', 'user:email', 'repo']);
      // Session will be updated via the listener
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      }));
    }
  }, []);

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    try {
      await authProvider.deleteSession();
      // State will be updated via the listener
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }));
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    authState,
    signIn,
    signOut,
    clearError,
  };
}

/**
 * Fetch GitHub user details
 */
async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  try {
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
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    throw error;
  }
}
