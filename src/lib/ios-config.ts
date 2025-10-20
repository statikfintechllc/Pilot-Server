/**
 * iOS App Configuration for Pilot Server
 * 
 * This module provides utilities for embedding the Pilot Server
 * in an iOS app with automatic GitHub authentication via Device Flow.
 * 
 * NO MANUAL GITHUB OAUTH APP SETUP REQUIRED!
 */

export interface IOSAppConfig {
  // Server configuration
  serverPort: number;
  serverHost: string;
  
  // App configuration
  appName: string;
  appVersion: string;
  
  // Feature flags
  enableDeviceFlow: boolean;
  enableLegacyOAuth: boolean;
  
  // UI configuration
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
}

export const DEFAULT_IOS_CONFIG: IOSAppConfig = {
  serverPort: 3001,
  serverHost: '127.0.0.1',
  appName: 'Pilot Server',
  appVersion: '2.0.0',
  enableDeviceFlow: true,
  enableLegacyOAuth: false,
  theme: 'auto',
  primaryColor: '#007AFF'
};

/**
 * Get the server URL for the current environment
 */
export function getServerURL(config: Partial<IOSAppConfig> = {}): string {
  const finalConfig = { ...DEFAULT_IOS_CONFIG, ...config };
  
  // For iOS app, always use localhost/127.0.0.1
  if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
    // Likely running in iOS app
    return `http://${finalConfig.serverHost}:${finalConfig.serverPort}`;
  }
  
  // For web development
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:${finalConfig.serverPort}`;
}

/**
 * Check if running in iOS app environment
 */
export function isIOSApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for iOS user agent
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Check for standalone mode (PWA)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check for native app bridge
  const hasNativeBridge = 'webkit' in window || 'DeviceMotionEvent' in window;
  
  return isIOS && (isStandalone || hasNativeBridge);
}

/**
 * Get device information for iOS app
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { platform: 'unknown', userAgent: '', screen: null };
  }
  
  return {
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      devicePixelRatio: window.devicePixelRatio || 1
    },
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    isIOS: isIOSApp()
  };
}

/**
 * iOS App Authentication Configuration
 */
export interface IOSAuthConfig {
  enableAutoAuth: boolean;
  persistAuth: boolean;
  authTimeoutSeconds: number;
  maxRetries: number;
}

export const DEFAULT_AUTH_CONFIG: IOSAuthConfig = {
  enableAutoAuth: true,
  persistAuth: true,
  authTimeoutSeconds: 900, // 15 minutes
  maxRetries: 3
};

/**
 * Start the embedded server for iOS app
 * This would be called from your iOS app's JavaScript bridge
 */
export async function startEmbeddedServer(config: Partial<IOSAppConfig> = {}): Promise<{
  success: boolean;
  serverUrl: string;
  config: IOSAppConfig;
  error?: string;
}> {
  try {
    const finalConfig = { ...DEFAULT_IOS_CONFIG, ...config };
    const serverUrl = getServerURL(finalConfig);
    
    // Test server connectivity
    const healthResponse = await fetch(`${serverUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!healthResponse.ok) {
      throw new Error(`Server health check failed: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Embedded server is running:', healthData);
    
    return {
      success: true,
      serverUrl,
      config: finalConfig
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to start embedded server:', errorMessage);
    
    return {
      success: false,
      serverUrl: '',
      config: { ...DEFAULT_IOS_CONFIG, ...config },
      error: errorMessage
    };
  }
}

/**
 * Device Flow Authentication for iOS App
 */
export class IOSDeviceFlowAuth {
  private config: IOSAppConfig;
  private authConfig: IOSAuthConfig;
  private serverUrl: string;
  
  constructor(
    config: Partial<IOSAppConfig> = {},
    authConfig: Partial<IOSAuthConfig> = {}
  ) {
    this.config = { ...DEFAULT_IOS_CONFIG, ...config };
    this.authConfig = { ...DEFAULT_AUTH_CONFIG, ...authConfig };
    this.serverUrl = getServerURL(this.config);
  }
  
  /**
   * Start device flow authentication
   */
  async authenticate(): Promise<{
    success: boolean;
    accessToken?: string;
    user?: any;
    error?: string;
  }> {
    try {
      // Check for existing valid auth
      if (this.authConfig.persistAuth) {
        const existingAuth = this.getStoredAuth();
        if (existingAuth && this.isAuthValid(existingAuth)) {
          console.log('✅ Using existing authentication');
          return {
            success: true,
            accessToken: existingAuth.accessToken,
            user: existingAuth.user
          };
        }
      }
      
      // Start new device flow
      console.log('🚀 Starting device flow authentication...');
      
      // Step 1: Initiate flow
      const initResponse = await fetch(`${this.serverUrl}/auth/device-flow/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!initResponse.ok) {
        throw new Error('Failed to initiate device flow');
      }
      
      const deviceData = await initResponse.json();
      
      // Step 2: Present code to user (this would be handled by iOS UI)
      console.log('📱 Present this code to user:', deviceData.user_code);
      console.log('🔗 GitHub URL:', deviceData.verification_uri_complete);
      
      // For iOS app integration, you would call your native iOS method here:
      // window.webkit?.messageHandlers?.showAuthCode?.postMessage({
      //   userCode: deviceData.user_code,
      //   verificationUrl: deviceData.verification_uri_complete,
      //   expiresIn: deviceData.expires_in
      // });
      
      // Step 3: Poll for completion
      const result = await this.pollForToken(deviceData);
      
      // Step 4: Store auth if successful
      if (result.success && this.authConfig.persistAuth) {
        this.storeAuth({
          accessToken: result.accessToken!,
          user: result.user!,
          timestamp: Date.now()
        });
      }
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('❌ Authentication error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }
  
  /**
   * Poll for device flow completion
   */
  private async pollForToken(deviceData: any): Promise<{
    success: boolean;
    accessToken?: string;
    user?: any;
    error?: string;
  }> {
    const startTime = Date.now();
    const timeoutMs = this.authConfig.authTimeoutSeconds * 1000;
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const pollResponse = await fetch(`${this.serverUrl}/auth/device-flow/poll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: deviceData.session_id })
        });
        
        const result = await pollResponse.json();
        
        if (result.status === 'complete') {
          // Get user data
          const userResponse = await fetch('https://api.github.com/user', {
            headers: {
              'Authorization': `token ${result.access_token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          const userData = await userResponse.json();
          
          return {
            success: true,
            accessToken: result.access_token,
            user: userData
          };
          
        } else if (result.status === 'pending') {
          // Continue polling
          await new Promise(resolve => setTimeout(resolve, deviceData.interval * 1000));
          
        } else if (result.status === 'slow_down') {
          // Slow down polling
          await new Promise(resolve => setTimeout(resolve, (deviceData.interval + 5) * 1000));
          
        } else {
          throw new Error(result.error || 'Authorization failed');
        }
        
      } catch (error) {
        console.error('Polling error:', error);
        await new Promise(resolve => setTimeout(resolve, deviceData.interval * 1000));
      }
    }
    
    return { success: false, error: 'Authentication timeout' };
  }
  
  /**
   * Store authentication data
   */
  private storeAuth(authData: { accessToken: string; user: any; timestamp: number }) {
    try {
      localStorage.setItem('ios_pilot_auth', JSON.stringify(authData));
    } catch (error) {
      console.error('Failed to store auth:', error);
    }
  }
  
  /**
   * Get stored authentication data
   */
  private getStoredAuth(): { accessToken: string; user: any; timestamp: number } | null {
    try {
      const stored = localStorage.getItem('ios_pilot_auth');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get stored auth:', error);
      return null;
    }
  }
  
  /**
   * Check if stored auth is still valid
   */
  private isAuthValid(authData: { timestamp: number }): boolean {
    const ageMs = Date.now() - authData.timestamp;
    const maxAgeMs = 30 * 24 * 60 * 60 * 1000; // 30 days
    return ageMs < maxAgeMs;
  }
  
  /**
   * Clear stored authentication
   */
  clearAuth() {
    try {
      localStorage.removeItem('ios_pilot_auth');
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  }
}

/**
 * iOS App Integration Example
 * 
 * For iOS developers: This is how you would integrate Pilot Server into your iOS app:
 * 
 * 1. Embed this JavaScript bundle in your iOS app
 * 2. Start the embedded server when your app launches
 * 3. Use Device Flow authentication to authenticate users
 * 4. Present the auth code in your native iOS UI
 * 5. Let users authenticate via Safari/WebView
 * 6. The embedded server handles all OAuth complexity
 * 
 * No manual GitHub OAuth app setup required!
 */
export const IOSIntegrationGuide = {
  
  /**
   * Step 1: Initialize the embedded server
   */
  async initialize() {
    const result = await startEmbeddedServer({
      serverPort: 3001,
      appName: 'My iOS App with Pilot Server',
      theme: 'auto'
    });
    
    if (!result.success) {
      throw new Error(`Failed to start server: ${result.error}`);
    }
    
    return result;
  },
  
  /**
   * Step 2: Authenticate user
   */
  async authenticateUser() {
    const auth = new IOSDeviceFlowAuth();
    const result = await auth.authenticate();
    
    if (!result.success) {
      throw new Error(`Authentication failed: ${result.error}`);
    }
    
    return {
      accessToken: result.accessToken!,
      user: result.user!
    };
  },
  
  /**
   * Step 3: Use authenticated API
   */
  async makeAuthenticatedRequest(accessToken: string, endpoint: string) {
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json'
      }
    });
    
    return await response.json();
  }
};
