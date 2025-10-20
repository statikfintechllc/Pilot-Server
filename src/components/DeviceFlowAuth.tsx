import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Copy, CheckCircle } from 'lucide-react';

interface DeviceFlowData {
  session_id: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  expires_in: number;
  interval: number;
}

interface DeviceFlowAuthProps {
  serverUrl?: string;
  onSuccess: (accessToken: string, user: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function DeviceFlowAuth({ 
  serverUrl = 'http://localhost:3001', 
  onSuccess, 
  onError, 
  onCancel 
}: DeviceFlowAuthProps) {
  const [step, setStep] = useState<'initiate' | 'waiting' | 'polling' | 'success' | 'error'>('initiate');
  const [deviceData, setDeviceData] = useState<DeviceFlowData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  // Initialize device flow
  const initiateFlow = async () => {
    try {
      setStep('initiate');
      setError('');

      const response = await fetch(`${serverUrl}/auth/device-flow/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to initiate authentication');
      }

      const data: DeviceFlowData = await response.json();
      setDeviceData(data);
      setTimeLeft(data.expires_in);
      setStep('waiting');

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setError('Code expired. Please try again.');
            setStep('error');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setStep('error');
      onError(errorMessage);
    }
  };

  // Start polling for token
  const startPolling = async () => {
    if (!deviceData) return;

    setStep('polling');

    const poll = async (): Promise<void> => {
      try {
        const response = await fetch(`${serverUrl}/auth/device-flow/poll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: deviceData.session_id })
        });

        const result = await response.json();

        if (result.status === 'complete') {
          // Get user data
          const userResponse = await fetch('https://api.github.com/user', {
            headers: {
              'Authorization': `token ${result.access_token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });

          const userData = await userResponse.json();
          setStep('success');
          onSuccess(result.access_token, userData);

        } else if (result.status === 'pending') {
          // Continue polling
          setTimeout(poll, deviceData.interval * 1000);

        } else if (result.status === 'slow_down') {
          // Slow down polling
          setTimeout(poll, (deviceData.interval + 5) * 1000);

        } else {
          throw new Error(result.error || 'Authorization failed');
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Polling failed';
        setError(errorMessage);
        setStep('error');
        onError(errorMessage);
      }
    };

    // Start polling immediately
    poll();
  };

  // Copy code to clipboard
  const copyCode = async () => {
    if (!deviceData) return;
    
    try {
      await navigator.clipboard.writeText(deviceData.user_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = deviceData.user_code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Open GitHub in new window/tab
  const openGitHub = () => {
    if (!deviceData) return;
    window.open(deviceData.verification_uri_complete, '_blank');
    startPolling();
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-start flow on mount
  useEffect(() => {
    initiateFlow();
  }, []);

  if (step === 'initiate') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Connecting to GitHub</CardTitle>
          <CardDescription>Setting up secure authentication...</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (step === 'waiting' && deviceData) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Authorize Pilot Server</CardTitle>
          <CardDescription>
            Copy this code and authorize in GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Code Display */}
          <div className="text-center">
            <div className="bg-muted p-4 rounded-lg font-mono text-2xl font-bold text-primary tracking-widest">
              {deviceData.user_code}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className="mt-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          {/* Timer */}
          <div className="text-center text-sm text-muted-foreground">
            Code expires in: <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={openGitHub} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open GitHub
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>1. Click "Open GitHub" to open the authorization page</p>
            <p>2. Enter the code above when prompted</p>
            <p>3. Click "Authorize" to complete setup</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'polling') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Waiting for Authorization</CardTitle>
          <CardDescription>Complete the authorization in GitHub</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            Checking for authorization...
          </p>
          <div className="text-xs text-muted-foreground">
            Time remaining: <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
          <Button variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Authorization Successful!</CardTitle>
          <CardDescription>You are now connected to GitHub</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Redirecting to your dashboard...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'error') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600">Authorization Failed</CardTitle>
          <CardDescription>Something went wrong</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-red-600">{error}</p>
          <div className="flex gap-2">
            <Button onClick={initiateFlow} className="flex-1">
              Try Again
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
