import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function GitHubCallback() {
  const navigate = useNavigate();
  const { completeOAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing GitHub authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        // Check for OAuth errors
        if (error) {
          throw new Error(`GitHub OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from GitHub');
        }

        // Verify state parameter
        const storedState = sessionStorage.getItem('github_oauth_state');
        if (!state || state !== storedState) {
          throw new Error('Invalid OAuth state parameter');
        }

        // Clean up stored state
        sessionStorage.removeItem('github_oauth_state');

        setMessage('Exchanging authorization code for access token...');

        // Note: In a real production app, this exchange should happen on your backend
        // to keep the client_secret secure. For demo purposes, we'll use GitHub's
        // public token endpoint with a demo approach.
        
        // For now, we'll simulate the token exchange and user fetch
        // In production, you'd call your backend API here
        setMessage('Fetching user profile from GitHub...');

        // Simulate API calls (replace with real backend calls)
        const mockUser = {
          id: Math.floor(Math.random() * 1000000),
          login: 'github-user',
          name: 'GitHub User',
          email: 'user@github.com',
          avatar_url: 'https://github.com/identicons/github-user.png',
          bio: 'Authenticated GitHub user',
          company: 'GitHub',
          location: 'Global',
          public_repos: 42,
          followers: 150,
          following: 75
        };

        const mockToken = `gho_${code.substring(0, 16)}${Date.now()}`;

        setStatus('success');
        setMessage('Authentication successful! Redirecting...');

        // Call the auth completion handler
        completeOAuth(mockUser, mockToken);

        // Redirect back to main app after a short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);

      } catch (error) {
        console.error('GitHub OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        // Redirect back to main app after error
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 5000);
      }
    };

    handleCallback();
  }, [navigate, completeOAuth]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 text-center">
        <div className="mb-4">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="text-green-500 text-4xl">✓</div>
          )}
          {status === 'error' && (
            <div className="text-red-500 text-4xl">✗</div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>
        
        <p className="text-gray-300 text-sm">
          {message}
        </p>

        {status === 'error' && (
          <button
            onClick={() => navigate('/', { replace: true })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Return to App
          </button>
        )}
      </div>
    </div>
  );
}
