import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '@/lib/auth/vscode-auth';

export function GitHubCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing GitHub authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setMessage('Completing authentication...');
        
        // Handle the OAuth callback
        const session = await authProvider.handleCallback();
        
        if (session) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Redirect to app after short delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          throw new Error('No session returned from authentication');
        }
      } catch (error) {
        console.error('GitHub OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

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
