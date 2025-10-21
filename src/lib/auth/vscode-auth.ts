import { supabase } from '../supabase/client';

export interface VSCodeAuthSession {
  accessToken: string;
  account: {
    id: string;
    label: string;
    email?: string;
  };
  scopes: string[];
}

/**
 * VS Code-style authentication manager
 * Handles GitHub OAuth with device flow or web redirect
 */
export class VSCodeAuthProvider {
  private static instance: VSCodeAuthProvider;
  private session: VSCodeAuthSession | null = null;
  private listeners: Set<(session: VSCodeAuthSession | null) => void> = new Set();

  private constructor() {
    this.loadSession();
  }

  static getInstance(): VSCodeAuthProvider {
    if (!VSCodeAuthProvider.instance) {
      VSCodeAuthProvider.instance = new VSCodeAuthProvider();
    }
    return VSCodeAuthProvider.instance;
  }

  /**
   * Load session from storage
   */
  private loadSession(): void {
    try {
      const stored = localStorage.getItem('vscode_auth_session');
      if (stored) {
        this.session = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      localStorage.removeItem('vscode_auth_session');
    }
  }

  /**
   * Save session to storage
   */
  private saveSession(session: VSCodeAuthSession | null): void {
    if (session) {
      localStorage.setItem('vscode_auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('vscode_auth_session');
    }
  }

  /**
   * Get current session
   */
  getSession(): VSCodeAuthSession | null {
    return this.session;
  }

  /**
   * Create a new session (sign in)
   * This mimics VS Code's authentication flow
   */
  async createSession(scopes: string[] = ['read:user', 'user:email']): Promise<VSCodeAuthSession> {
    try {
      // Use Supabase Auth with GitHub provider
      // Use BASE_URL from Vite to support both local dev and GitHub Pages
      const basePath = import.meta.env.BASE_URL || '/';
      const redirectUrl = `${window.location.origin}${basePath}auth/callback`.replace(/\/+/g, '/').replace(':/', '://');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: scopes.join(' '),
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      // The actual session will be set in the callback handler
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Authentication timeout'));
        }, 60000); // 60 second timeout

        const checkSession = async () => {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            clearTimeout(timeout);
            const vscodeSession = await this.convertToVSCodeSession(sessionData.session);
            resolve(vscodeSession);
          } else {
            setTimeout(checkSession, 1000);
          }
        };

        setTimeout(checkSession, 2000); // Start checking after 2 seconds
      });
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create authentication session');
    }
  }

  /**
   * Convert Supabase session to VS Code session format
   */
  private async convertToVSCodeSession(supabaseSession: { user: { id: string; email?: string; user_metadata?: Record<string, unknown> }; access_token: string }): Promise<VSCodeAuthSession> {
    const user = supabaseSession.user;
    const session: VSCodeAuthSession = {
      accessToken: supabaseSession.access_token,
      account: {
        id: user.id,
        label: user.user_metadata?.user_name || user.email || 'GitHub User',
        email: user.email,
      },
      scopes: ['read:user', 'user:email'],
    };

    this.session = session;
    this.saveSession(session);
    this.notifyListeners(session);

    // Store user profile in database
    await this.syncUserProfile(user);

    return session;
  }

  /**
   * Sync user profile with database
   */
  private async syncUserProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }): Promise<void> {
    try {
      const profile = {
        id: user.id,
        github_id: user.user_metadata?.provider_id || 0,
        username: user.user_metadata?.user_name || user.email?.split('@')[0] || 'unknown',
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url || '',
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profile, { onConflict: 'id' });

      if (error) {
        console.error('Error syncing user profile:', error);
      }
    } catch (error) {
      console.error('Error in syncUserProfile:', error);
    }
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(): Promise<VSCodeAuthSession | null> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (data?.session) {
        return await this.convertToVSCodeSession(data.session);
      }

      return null;
    } catch (error) {
      console.error('Error handling callback:', error);
      return null;
    }
  }

  /**
   * Delete session (sign out)
   */
  async deleteSession(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.session = null;
      this.saveSession(null);
      this.notifyListeners(null);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Add session change listener
   */
  onDidChangeSessions(listener: (session: VSCodeAuthSession | null) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of session change
   */
  private notifyListeners(session: VSCodeAuthSession | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(session);
      } catch (error) {
        console.error('Error in session listener:', error);
      }
    });
  }
}

export const authProvider = VSCodeAuthProvider.getInstance();
