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
// This maps to the actual GitHub Models available in the platform
export const AVAILABLE_GITHUB_MODELS: GitHubModel[] = [
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable OpenAI model with vision and function calling',
    provider: 'openai',
    context_length: 128000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient OpenAI model for most tasks',
    provider: 'openai',
    context_length: 128000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Standard GPT-4 model',
    provider: 'openai',
    context_length: 8192,
    supports_vision: false,
    supports_function_calling: true
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective OpenAI model',
    provider: 'openai',
    context_length: 16385,
    supports_vision: false,
    supports_function_calling: true
  },
  // Anthropic Models
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    description: 'Latest Claude 3.5 Sonnet with advanced reasoning',
    provider: 'anthropic',
    context_length: 200000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Most powerful Claude model for complex tasks',
    provider: 'anthropic',
    context_length: 200000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: 'Balanced Claude model for most use cases',
    provider: 'anthropic',
    context_length: 200000,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: 'Fast and lightweight Claude model',
    provider: 'anthropic',
    context_length: 200000,
    supports_vision: true,
    supports_function_calling: false
  },
  // Meta Models
  {
    id: 'llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B',
    description: 'Meta\'s most capable open model',
    provider: 'github',
    context_length: 131072,
    supports_vision: false,
    supports_function_calling: true
  },
  {
    id: 'llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    description: 'High-performance open model',
    provider: 'github',
    context_length: 131072,
    supports_vision: false,
    supports_function_calling: true
  },
  {
    id: 'llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B',
    description: 'Fast and efficient open model',
    provider: 'github',
    context_length: 131072,
    supports_vision: false,
    supports_function_calling: true
  },
  // Google Models
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Google\'s most capable multimodal model',
    provider: 'google',
    context_length: 1048576,
    supports_vision: true,
    supports_function_calling: true
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and versatile multimodal model',
    provider: 'google',
    context_length: 1048576,
    supports_vision: true,
    supports_function_calling: true
  },
  // Microsoft Models
  {
    id: 'phi-3-medium-4k-instruct',
    name: 'Phi-3 Medium',
    description: 'Microsoft\'s efficient reasoning model',
    provider: 'github',
    context_length: 4096,
    supports_vision: false,
    supports_function_calling: false
  },
  {
    id: 'phi-3-mini-4k-instruct',
    name: 'Phi-3 Mini',
    description: 'Compact and fast Microsoft model',
    provider: 'github',
    context_length: 4096,
    supports_vision: false,
    supports_function_calling: false
  },
  // Cohere Models
  {
    id: 'command-r',
    name: 'Command R',
    description: 'Cohere\'s command-following model',
    provider: 'github',
    context_length: 131072,
    supports_vision: false,
    supports_function_calling: true
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    description: 'Enhanced Cohere model with better reasoning',
    provider: 'github',
    context_length: 131072,
    supports_vision: false,
    supports_function_calling: true
  },
  // Mistral Models
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    description: 'Mistral\'s most capable model',
    provider: 'github',
    context_length: 32768,
    supports_vision: false,
    supports_function_calling: true
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    description: 'Efficient Mistral model for most tasks',
    provider: 'github',
    context_length: 32768,
    supports_vision: false,
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

  const [availableModels, setAvailableModels] = useKV<GitHubModel[]>('pilot-available-models', []);

  // Fetch available models from GitHub Models API
  const fetchAvailableModels = useCallback(async () => {
    try {
      if (!authState.isAuthenticated) {
        // Only basic Spark models available without auth
        const basicModels = AVAILABLE_GITHUB_MODELS.filter(model => 
          ['gpt-4o', 'gpt-4o-mini'].includes(model.id)
        );
        setAvailableModels(basicModels);
        return;
      }

      // If authenticated, try to get user's available models
      // Note: This would normally be a GitHub API call, but we'll use Spark's capability
      if (typeof window !== 'undefined' && window.spark) {
        const sparkUser = await spark.user();
        
        if (sparkUser && sparkUser.isOwner) {
          // Owner has access to all models
          setAvailableModels(AVAILABLE_GITHUB_MODELS);
        } else {
          // Regular user has access to a subset
          const userModels = AVAILABLE_GITHUB_MODELS.filter(model => 
            model.provider === 'openai' || 
            model.provider === 'anthropic' ||
            ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet-20241022', 'gemini-1.5-flash'].includes(model.id)
          );
          setAvailableModels(userModels);
        }
      }
    } catch (error) {
      console.error('Error fetching available models:', error);
      // Fallback to basic models
      const fallbackModels = AVAILABLE_GITHUB_MODELS.filter(model => 
        ['gpt-4o', 'gpt-4o-mini'].includes(model.id)
      );
      setAvailableModels(fallbackModels);
    }
  }, [authState.isAuthenticated, setAvailableModels]);

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

            // Fetch available models after authentication
            await fetchAvailableModels();
          } else {
            // Not authenticated, set basic models
            await fetchAvailableModels();
          }
        }
      } catch (error) {
        console.error('Error checking Spark user:', error);
        setAuthState(prev => ({
          ...prev,
          error: 'Failed to authenticate with GitHub'
        }));
        // Set basic models on error
        await fetchAvailableModels();
      }
    };

    checkSparkUser();
  }, [setAuthState, fetchAvailableModels]);

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

          // Fetch available models after successful sign in
          await fetchAvailableModels();

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
  }, [setAuthState, fetchAvailableModels]);

  const signOut = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      isLoading: false,
      error: null
    });
    
    // Reset to basic models when signed out
    const basicModels = AVAILABLE_GITHUB_MODELS.filter(model => 
      ['gpt-4o', 'gpt-4o-mini'].includes(model.id)
    );
    setAvailableModels(basicModels);
  }, [setAuthState, setAvailableModels]);

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
    getUserRepos,
    fetchAvailableModels
  };
}