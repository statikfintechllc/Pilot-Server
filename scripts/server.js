import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { randomBytes } from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS for iOS automatic authentication
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (iOS apps)
    if (!origin) return callback(null, true);
    
    // Allow all localhost and 127.0.0.1 variants
    if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      return callback(null, true);
    }
    
    // Allow file:// protocol for iOS apps
    if (origin.startsWith('file://')) {
      return callback(null, true);
    }
    
    // Allow all origins for development
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

app.use(express.json());

// In-memory storage
const deviceFlowSessions = new Map();
const authSessions = new Map();

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Iv1.b507a08c87ecfe98';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ''; // Not needed for public client

// **AUTOMATIC OAUTH ENDPOINTS - NO MANUAL INTERACTION**

// Automatic OAuth callback - this is where GitHub redirects automatically
app.get('/auth/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;
  
  console.log('🎯 OAuth callback received:', { code: !!code, state, error });

  if (error) {
    console.error('❌ OAuth error:', error, error_description);
    return res.send(createErrorPage(error_description || error));
  }

  if (!code) {
    console.error('❌ No authorization code received');
    return res.send(createErrorPage('No authorization code received'));
  }

  try {
    // Exchange code for access token - AUTOMATICALLY
    console.log('🔄 Exchanging code for token...');
    
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Pilot-Server-Auto-OAuth'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(`GitHub error: ${tokenData.error_description || tokenData.error}`);
    }

    const accessToken = tokenData.access_token;
    console.log('✅ Token obtained successfully');

    // Get user info automatically
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'Pilot-Server-Auto-OAuth'
      }
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to get user info: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    console.log(`🎉 User authenticated: ${userData.login}`);

    // Create session token
    const sessionToken = randomBytes(32).toString('hex');
    
    authSessions.set(sessionToken, {
      accessToken,
      user: userData,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

    // Return success page with automatic app redirect
    res.send(createSuccessPage(sessionToken, userData, code, state));

  } catch (error) {
    console.error('❌ OAuth processing error:', error);
    res.send(createErrorPage(error.message));
  }
});

// Start automatic OAuth flow
app.post('/auth/automatic/start', (req, res) => {
  try {
    const { redirectUri = 'http://localhost:3001/auth/callback' } = req.body;
    
    // Generate state for CSRF protection
    const state = randomBytes(16).toString('hex');
    
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent('user:email read:user')}&` +
      `state=${encodeURIComponent(state)}`;

    console.log('🚀 Starting automatic OAuth flow...');
    
    res.json({
      success: true,
      authUrl,
      state,
      redirectUri
    });

  } catch (error) {
    console.error('❌ Failed to start automatic OAuth:', error);
    res.status(500).json({ 
      error: 'Failed to start authentication',
      details: error.message 
    });
  }
});

// Exchange authorization code for session token
app.post('/auth/exchange', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    console.log('🔄 Exchanging authorization code...');

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Pilot-Server-Auto-OAuth'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(`GitHub error: ${tokenData.error_description || tokenData.error}`);
    }

    const accessToken = tokenData.access_token;

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'Pilot-Server-Auto-OAuth'
      }
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to get user info: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    console.log(`✅ User authenticated via API: ${userData.login}`);

    // Create session token
    const sessionToken = randomBytes(32).toString('hex');
    
    authSessions.set(sessionToken, {
      accessToken,
      user: userData,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

    res.json({
      success: true,
      token: sessionToken,
      user: userData
    });

  } catch (error) {
    console.error('❌ Code exchange error:', error);
    res.status(500).json({ 
      error: 'Failed to exchange authorization code',
      details: error.message 
    });
  }
});

// Verify session token
app.get('/auth/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid token provided' });
    }

    const token = authHeader.substring(7);
    const session = authSessions.get(token);

    if (!session) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    if (Date.now() > session.expiresAt) {
      authSessions.delete(token);
      return res.status(401).json({ error: 'Session expired' });
    }

    res.json({
      user: session.user,
      expiresAt: session.expiresAt
    });

  } catch (error) {
    console.error('❌ Session verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Helper function to create success page
function createSuccessPage(token, user, code, state) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authentication Successful</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          text-align: center; 
          padding: 50px 20px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .container {
          max-width: 400px;
          padding: 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .success { color: #4caf50; font-size: 3em; margin-bottom: 20px; }
        .spinner { 
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #4caf50;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .user-info {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
        }
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 0 auto 10px;
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success">✅</div>
        <h1>Authentication Successful!</h1>
        <div class="spinner"></div>
        <p>Redirecting you back to the app...</p>
        <div class="user-info">
          <img src="${user.avatar_url}" alt="Avatar" class="avatar">
          <strong>${user.name || user.login}</strong>
          ${user.bio ? `<br><small>${user.bio}</small>` : ''}
        </div>
      </div>
      <script>
        const authData = {
          token: '${token}',
          user: ${JSON.stringify(user)},
          code: '${code}',
          state: '${state || ''}'
        };
        
        console.log('🎉 Authentication successful:', authData);
        
        // Multiple communication methods for maximum compatibility
        setTimeout(() => {
          // Method 1: PostMessage to parent window (web popup)
          if (window.opener) {
            console.log('📤 Sending auth data to opener window');
            window.opener.postMessage({
              type: 'GITHUB_AUTH_SUCCESS',
              ...authData
            }, '*');
            window.close();
          }
          // Method 2: iOS WKWebView message handler
          else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.authHandler) {
            console.log('📱 Sending auth data to iOS WebKit handler');
            window.webkit.messageHandlers.authHandler.postMessage({
              type: 'IOS_AUTH_RESULT',
              success: true,
              ...authData
            });
          }
          // Method 3: Custom event for bridge
          else {
            console.log('🌐 Dispatching custom auth event');
            
            // Custom event
            const event = new CustomEvent('authComplete', {
              detail: { success: true, ...authData }
            });
            document.dispatchEvent(event);
            
            // Window message
            window.postMessage({
              type: 'IOS_AUTH_SUCCESS',
              ...authData
            }, '*');
            
            // Try localStorage as fallback
            localStorage.setItem('auth_result', JSON.stringify(authData));
            
            // Redirect back to app if possible
            setTimeout(() => {
              try {
                window.location.href = 'pilot-app://auth-complete';
              } catch (e) {
                console.log('Could not redirect to app scheme');
              }
            }, 2000);
          }
        }, 1500);
      </script>
    </body>
    </html>
  `;
}

// Helper function to create error page
function createErrorPage(errorMessage) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authentication Error</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          text-align: center; 
          padding: 50px 20px; 
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          min-height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .container {
          max-width: 400px;
          padding: 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .error { color: #ff4757; font-size: 3em; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="error">❌</div>
        <h1>Authentication Failed</h1>
        <p>Error: ${errorMessage}</p>
        <button onclick="window.close()">Close</button>
      </div>
      <script>
        console.error('❌ Authentication error:', '${errorMessage}');
        
        // Notify parent window/app of error
        if (window.opener) {
          window.opener.postMessage({
            type: 'GITHUB_AUTH_ERROR',
            error: '${errorMessage}'
          }, '*');
        } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.authHandler) {
          window.webkit.messageHandlers.authHandler.postMessage({
            type: 'IOS_AUTH_RESULT',
            success: false,
            error: '${errorMessage}'
          });
        }
      </script>
    </body>
    </html>
  `;
}

// GitHub Device Flow OAuth - No manual OAuth app setup required!
// This uses GitHub's Device Flow which works perfectly for iOS apps
app.post('/auth/device-flow/initiate', async (req, res) => {
  try {
    console.log('🚀 Initiating GitHub Device Flow...');
    
    // GitHub's public client ID for device flow (no secret needed!)
    const clientId = 'Iv1.b507a08c87ecfe98'; // GitHub CLI client ID - publicly available
    const scope = 'read:user user:email public_repo';
    
    // Initiate device flow with GitHub
    const response = await fetch('https://github.com/login/device/code', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Pilot-Server-iOS-App'
      },
      body: new URLSearchParams({
        client_id: clientId,
        scope: scope
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub device flow failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Store session data
    const sessionId = randomBytes(16).toString('hex');
    deviceFlowSessions.set(sessionId, {
      device_code: data.device_code,
      user_code: data.user_code,
      verification_uri: data.verification_uri,
      expires_in: data.expires_in,
      interval: data.interval,
      created_at: Date.now(),
      client_id: clientId
    });

    console.log('✅ Device flow initiated:', {
      sessionId,
      userCode: data.user_code,
      verificationUri: data.verification_uri
    });

    res.json({
      session_id: sessionId,
      user_code: data.user_code,
      verification_uri: data.verification_uri,
      verification_uri_complete: `${data.verification_uri}?user_code=${data.user_code}`,
      expires_in: data.expires_in,
      interval: data.interval
    });

  } catch (error) {
    console.error('Device flow initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate device flow' });
  }
});

// Poll for device flow completion
app.post('/auth/device-flow/poll', async (req, res) => {
  try {
    const { session_id } = req.body;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    const session = deviceFlowSessions.get(session_id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }

    // Check if session has expired
    const isExpired = (Date.now() - session.created_at) > (session.expires_in * 1000);
    if (isExpired) {
      deviceFlowSessions.delete(session_id);
      return res.status(410).json({ error: 'Session expired' });
    }

    // Poll GitHub for token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Pilot-Server-iOS-App'
      },
      body: new URLSearchParams({
        client_id: session.client_id,
        device_code: session.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
      })
    });

    const data = await response.json();

    if (data.access_token) {
      // Success! Clean up session
      deviceFlowSessions.delete(session_id);
      
      console.log('✅ Device flow completed successfully');
      
      res.json({
        status: 'complete',
        access_token: data.access_token,
        token_type: data.token_type,
        scope: data.scope
      });
    } else if (data.error === 'authorization_pending') {
      // User hasn't authorized yet
      res.json({ status: 'pending' });
    } else if (data.error === 'slow_down') {
      // Need to slow down polling
      res.json({ status: 'slow_down' });
    } else if (data.error === 'expired_token') {
      // Token expired
      deviceFlowSessions.delete(session_id);
      res.status(410).json({ error: 'Authorization expired' });
    } else if (data.error === 'access_denied') {
      // User denied access
      deviceFlowSessions.delete(session_id);
      res.status(403).json({ error: 'Access denied by user' });
    } else {
      // Other error
      console.error('Device flow poll error:', data);
      res.status(400).json({ error: data.error || 'Unknown error' });
    }

  } catch (error) {
    console.error('Device flow poll error:', error);
    res.status(500).json({ error: 'Polling failed' });
  }
});

// Legacy OAuth token exchange (for backward compatibility)
app.post('/auth/github/token', async (req, res) => {
  try {
    const { code, client_id, redirect_uri } = req.body;

    console.log('Token exchange request:', { code, client_id, redirect_uri });

    // Read client secret from environment variable
    const client_secret = process.env.VITE_GITHUB_CLIENT_SECRET || 'd3bad76c2097ce9bd288bb1e89c8853e85b3d19a';

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Pilot-Server-GitHub-App'
      },
      body: new URLSearchParams({
        client_id,
        client_secret,
        code,
        redirect_uri
      })
    });

    const data = await response.json();
    console.log('GitHub response:', data);

    if (data.access_token) {
      res.json({ access_token: data.access_token });
    } else {
      console.error('No access token in response:', data);
      res.status(400).json({ error: 'Failed to get access token', details: data });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    host: req.get('host'),
    time: new Date().toISOString(),
    device_sessions: deviceFlowSessions.size
  });
});

// Get server info for iOS app
app.get('/info', (req, res) => {
  res.json({
    name: 'Pilot Server OAuth Proxy',
    version: '2.0.0',
    features: ['device-flow', 'legacy-oauth'],
    endpoints: {
      device_flow_initiate: '/auth/device-flow/initiate',
      device_flow_poll: '/auth/device-flow/poll',
      legacy_token: '/auth/github/token',
      health: '/health'
    }
  });
});

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of deviceFlowSessions.entries()) {
    if (now - session.created_at > session.expires_in * 1000) {
      deviceFlowSessions.delete(sessionId);
      console.log(`🧹 Cleaned up expired session: ${sessionId}`);
    }
  }
}, 5 * 60 * 1000);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Pilot Server OAuth Proxy running on http://0.0.0.0:${PORT}`);
  console.log(`📱 iOS App Compatible - Device Flow Enabled`);
  console.log(`🔐 No manual GitHub OAuth app setup required!`);
});
