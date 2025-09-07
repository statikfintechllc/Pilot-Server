import { useKV } from '@github/spark/hooks';
import { useState, useCallback, useEffect } from 'react';

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  bio?: string;
  company?: string;
  location?: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface GitHubModel {
  id: string;
  name: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google' | 'github';
  context_length: number;
  supports_vision: boolean;
  supports_function_calling: boolean;
}

// GitHub Models API provides access to various AI models
const GITHUB_MODELS: GitHubModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable model with vision and function calling',
    provider: 'openai',
    context_length: 128000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient model for most tasks',
    provider: 'openai',
    context_length: 128000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Advanced reasoning and analysis capabilities',
    provider: 'anthropic',
    context_length: 200000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast responses for everyday tasks',
    provider: 'anthropic',
    context_length: 200000,
    supports_vision: true,
    supports_function_calling: false
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Google\'s most capable multimodal model',
    provider: 'google',
    context_length: 1000000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and versatile multimodal model',
    provider: 'google',
    context_length: 1000000,
    supports_vision: true,
    supports_function_calling: true
  }
];

export function useAuth() {
  const [authState, setAuthState] = useKV<AuthState>('pilot-auth-state', {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isLoading: false,
    error: null
  });

  const [availableModels, setAvailableModels] = useKV<GitHubModel[]>('pilot-available-models', GITHUB_MODELS);

  // Check if we have a valid user from Spark runtime
  useEffect(() => {
    const checkSparkUser = async () => {
      try {
        if (typeof window !== 'undefined' && window.spark) {
          const sparkUser = await spark.user();
          if (sparkUser && sparkUser.login) {
            // Convert Spark user to our GitHubUser format
            const githubUser: GitHubUser = {
              id: sparkUser.id || 0,
              login: sparkUser.login,
              name: sparkUser.login, // Spark doesn't provide name, use login
              email: sparkUser.email || '',
              avatar_url: sparkUser.avatarUrl || '',
              bio: '',
              company: '',
              location: '',
              public_repos: 0,
              followers: 0,
              following: 0
            };

            setAuthState(prev => ({
              ...prev,
              isAuthenticated: true,
              user: githubUser,
              accessToken: 'spark-runtime-token', // Placeholder since Spark handles auth
              error: null
            }));
          }
        }
      } catch (error) {
        console.error('Error checking Spark user:', error);
        setAuthState(prev => ({
          ...prev,
          error: 'Failed to authenticate with GitHub'
        }));
      }
    };

    checkSparkUser();
  }, [setAuthState]);

  const signIn = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // For now, we'll use the Spark runtime user
      if (typeof window !== 'undefined' && window.spark) {
        const sparkUser = await spark.user();
        if (sparkUser && sparkUser.login) {
          const githubUser: GitHubUser = {
            id: sparkUser.id || 0,
            login: sparkUser.login,
            name: sparkUser.login,
            email: sparkUser.email || '',
            avatar_url: sparkUser.avatarUrl || '',
            bio: '',
            company: '',
            location: '',
            public_repos: 0,
            followers: 0,
            following: 0
          };

          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            user: githubUser,
            accessToken: 'spark-runtime-token',
            isLoading: false,
            error: null
          }));

          return true;
        }
      }

      throw new Error('GitHub authentication not available');
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }));
      return false;
    }
  }, [setAuthState]);

  const signOut = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      isLoading: false,
      error: null
    });
  }, [setAuthState]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, [setAuthState]);

  // Simulate fetching user repositories (would use real GitHub API with token)
  const getUserRepos = useCallback(async () => {
    if (!authState.isAuthenticated || !authState.user) {
      throw new Error('User not authenticated');
    }

    // Mock repositories data for now
    return [
      {
        id: 1,
        name: 'pilot-server',
        full_name: `${authState.user.login}/pilot-server`,
        description: 'AI Chat Interface with GitHub Integration',
        private: false,
        html_url: `https://github.com/${authState.user.login}/pilot-server`,
        language: 'TypeScript',
        stargazers_count: 0,
        forks_count: 0,
        updated_at: new Date().toISOString()
      }
    ];
  }, [authState.isAuthenticated, authState.user]);

  return {
    authState,
    availableModels,
    signIn,
    signOut,
    clearError,
    getUserRepos
  };
}