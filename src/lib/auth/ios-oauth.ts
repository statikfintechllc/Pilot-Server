/**
 * iOS OAuth Integration - Automatic GitHub Authentication
 * Implements ASWebAuthenticationSession equivalent for seamless OAuth flow
 */

export interface IOSAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
}

export interface AuthResult {
  success: boolean;
  code?: string;
  state?: string;
  error?: string;
}

// iOS WKWebView message handler interface
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        authHandler?: {
          postMessage: (message: any) => void;
        };
        urlHandler?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

export class IOSGitHubAuth {
  private config: IOSAuthConfig;
  private authPromise: Promise<AuthResult> | null = null;
  private authResolver: ((result: AuthResult) => void) | null = null;

  constructor(config: IOSAuthConfig) {
    this.config = config;
    this.setupMessageListeners();
  }

  private setupMessageListeners() {
    // Listen for authentication completion messages
    window.addEventListener('message', this.handleAuthMessage.bind(this));
    
    // Listen for URL handling messages from iOS
    document.addEventListener('authComplete', this.handleAuthComplete.bind(this) as EventListener);
  }

  private handleAuthMessage(event: MessageEvent) {
    if (event.data.type === 'IOS_AUTH_RESULT') {
      const { success, code, state, error } = event.data;
      
      if (this.authResolver) {
        this.authResolver({
          success,
          code,
          state,
          error
        });
      }
    }
  }

  private handleAuthComplete(event: CustomEvent) {
    const { code, state, error } = event.detail;
    
    if (this.authResolver) {
      this.authResolver({
        success: !error,
        code,
        state,
        error
      });
    }
  }

  /**
   * Start automatic GitHub OAuth authentication
   * This will use ASWebAuthenticationSession on iOS for seamless authentication
   */
  async authenticate(): Promise<AuthResult> {
    if (this.authPromise) {
      return this.authPromise;
    }

    this.authPromise = new Promise<AuthResult>((resolve) => {
      this.authResolver = resolve;

      const authUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${encodeURIComponent(this.config.clientId)}&` +
        `redirect_uri=${encodeURIComponent(this.config.redirectUri)}&` +
        `scope=${encodeURIComponent(this.config.scope)}&` +
        `state=${encodeURIComponent(this.config.state)}`;

      if (this.isIOSApp()) {
        this.startIOSAuthentication(authUrl);
      } else {
        this.startWebAuthentication(authUrl);
      }
    });

    const result = await this.authPromise;
    this.authPromise = null;
    this.authResolver = null;
    
    return result;
  }

  private isIOSApp(): boolean {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const hasWebKit = window.webkit && window.webkit.messageHandlers;
    const isWebView = window.location.protocol === 'file:' || hasWebKit;
    
    return isIOS && isWebView;
  }

  private startIOSAuthentication(authUrl: string) {
    // Method 1: Use WKWebView message handler if available
    if (window.webkit?.messageHandlers?.authHandler) {
      window.webkit.messageHandlers.authHandler.postMessage({
        action: 'startAuth',
        url: authUrl,
        redirectUri: this.config.redirectUri,
        state: this.config.state
      });
      return;
    }

    // Method 2: Try to trigger iOS URL scheme
    const iOSScheme = `ios-oauth://authenticate?url=${encodeURIComponent(authUrl)}&redirect=${encodeURIComponent(this.config.redirectUri)}`;
    
    try {
      window.location.href = iOSScheme;
    } catch (error) {
      console.error('Failed to launch iOS authentication:', error);
      this.startWebAuthentication(authUrl);
    }
  }

  private startWebAuthentication(authUrl: string) {
    const authWindow = window.open(
      authUrl,
      'github-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    if (!authWindow) {
      if (this.authResolver) {
        this.authResolver({
          success: false,
          error: 'Failed to open authentication window'
        });
      }
      return;
    }

    // Poll for window closure or success
    const checkInterval = setInterval(() => {
      try {
        if (authWindow.closed) {
          clearInterval(checkInterval);
          if (this.authResolver) {
            this.authResolver({
              success: false,
              error: 'Authentication window was closed'
            });
          }
          return;
        }

        // Check if we can access the window URL (same origin)
        const currentUrl = authWindow.location.href;
        if (currentUrl.includes(this.config.redirectUri)) {
          const urlParams = new URLSearchParams(authWindow.location.search);
          const code = urlParams.get('code');
          const state = urlParams.get('state');
          const error = urlParams.get('error');

          clearInterval(checkInterval);
          authWindow.close();

          if (this.authResolver) {
            this.authResolver({
              success: !error && !!code,
              code: code || undefined,
              state: state || undefined,
              error: error || undefined
            });
          }
        }
      } catch (error) {
        // Cross-origin access error is expected
        // Continue polling
      }
    }, 1000);

    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!authWindow.closed) {
        authWindow.close();
      }
      if (this.authResolver) {
        this.authResolver({
          success: false,
          error: 'Authentication timeout'
        });
      }
    }, 300000);
  }

  /**
   * Handle OAuth callback URL
   * This method should be called when the app receives the OAuth callback
   */
  handleCallback(url: string): AuthResult {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error) {
        return {
          success: false,
          error: errorDescription || error
        };
      }

      if (!code) {
        return {
          success: false,
          error: 'No authorization code received'
        };
      }

      if (state !== this.config.state) {
        return {
          success: false,
          error: 'Invalid state parameter'
        };
      }

      return {
        success: true,
        code,
        state
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse callback URL: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Utility function to generate secure random state
export function generateAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Main authentication function for easy use
export async function authenticateWithGitHub(
  clientId: string,
  redirectUri: string = 'http://localhost:3001/auth/callback',
  scope: string = 'user:email'
): Promise<AuthResult> {
  const state = generateAuthState();
  
  const auth = new IOSGitHubAuth({
    clientId,
    redirectUri,
    scope,
    state
  });

  return auth.authenticate();
}

// Export for iOS Swift integration
export const IOSOAuth = {
  authenticateWithGitHub,
  IOSGitHubAuth,
  generateAuthState
};

// Make available globally for iOS Swift bridge
if (typeof window !== 'undefined') {
  (window as any).IOSOAuth = IOSOAuth;
}
