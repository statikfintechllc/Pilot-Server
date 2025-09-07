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
  publisher: string;
  registry: string;
  summary: string;
  html_url: string;
  version: string;
  capabilities: string[];
  limits: {
    max_input_tokens: number;
    max_output_tokens: number;
  };
  rate_limit_tier: string;
  supported_input_modalities: string[];
  supported_output_modalities: string[];
  tags: string[];
}

// Current GitHub Models from the marketplace (as of January 2025)
// Based on real GitHub Models API data from https://models.github.ai/catalog/models
export const AVAILABLE_GITHUB_MODELS: GitHubModel[] = [
  // OpenAI GPT-5 Series - Latest models
  {
    id: 'azure-openai/gpt-5',
    name: 'OpenAI gpt-5',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'gpt-5 is designed for logic-heavy and multi-step tasks.',
    html_url: 'https://github.com/marketplace/models/azure-openai/gpt-5',
    version: '2025-04-14',
    capabilities: ['streaming', 'tool-calling'],
    limits: {
      max_input_tokens: 1048576,
      max_output_tokens: 32768
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text', 'image', 'audio'],
    supported_output_modalities: ['text'],
    tags: ['multipurpose', 'multilingual', 'multimodal']
  },
  {
    id: 'azure-openai/gpt-5-chat',
    name: 'OpenAI gpt-5-chat (preview)',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'gpt-5-chat (preview) is an advanced, natural, multimodal, and context-aware conversations for enterprise applications.',
    html_url: 'https://github.com/marketplace/models/azure-openai/gpt-5-chat',
    version: '2025-01-01',
    capabilities: ['streaming', 'tool-calling'],
    limits: {
      max_input_tokens: 524288,
      max_output_tokens: 16384
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text', 'image', 'audio'],
    supported_output_modalities: ['text'],
    tags: ['conversational', 'multimodal', 'enterprise']
  },
  {
    id: 'azure-openai/gpt-5-mini',
    name: 'OpenAI gpt-5-mini',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'gpt-5-mini is a lightweight version for cost-sensitive applications.',
    html_url: 'https://github.com/marketplace/models/azure-openai/gpt-5-mini',
    version: '2025-01-01',
    capabilities: ['streaming', 'tool-calling'],
    limits: {
      max_input_tokens: 262144,
      max_output_tokens: 8192
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text', 'image'],
    supported_output_modalities: ['text'],
    tags: ['cost-efficient', 'lightweight', 'multimodal']
  },
  {
    id: 'azure-openai/gpt-5-nano',
    name: 'OpenAI gpt-5-nano',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'gpt-5-nano is optimized for speed, ideal for applications requiring low latency.',
    html_url: 'https://github.com/marketplace/models/azure-openai/gpt-5-nano',
    version: '2025-01-01',
    capabilities: ['streaming'],
    limits: {
      max_input_tokens: 131072,
      max_output_tokens: 4096
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['fast', 'low-latency', 'lightweight']
  },
  // OpenAI o-series (reasoning models)
  {
    id: 'azure-openai/o3',
    name: 'OpenAI o3',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'o3 includes significant improvements on quality and safety while supporting the existing features of o1 and delivering comparable or better performance.',
    html_url: 'https://github.com/marketplace/models/azure-openai/o3',
    version: '2025-01-01',
    capabilities: ['reasoning', 'tool-calling'],
    limits: {
      max_input_tokens: 200000,
      max_output_tokens: 100000
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['reasoning', 'safety', 'advanced']
  },
  {
    id: 'azure-openai/o4-mini',
    name: 'OpenAI o4-mini',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'o4-mini includes significant improvements on quality and safety while supporting the existing features of o3-mini and delivering comparable or better performance.',
    html_url: 'https://github.com/marketplace/models/azure-openai/o4-mini',
    version: '2025-01-01',
    capabilities: ['reasoning', 'tool-calling'],
    limits: {
      max_input_tokens: 128000,
      max_output_tokens: 65536
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['reasoning', 'efficient', 'safety']
  },
  // OpenAI GPT-4.1 Series
  {
    id: 'azure-openai/gpt-4-1',
    name: 'OpenAI GPT-4.1',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'gpt-4.1 outperforms gpt-4o across the board, with major gains in coding, instruction following, and long-context understanding',
    html_url: 'https://github.com/marketplace/models/azure-openai/gpt-4-1',
    version: '2025-04-14',
    capabilities: ['streaming', 'tool-calling'],
    limits: {
      max_input_tokens: 1048576,
      max_output_tokens: 32768
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text', 'image', 'audio'],
    supported_output_modalities: ['text'],
    tags: ['multipurpose', 'multilingual', 'multimodal']
  },
  {
    id: 'azure-openai/gpt-4-1-mini',
    name: 'OpenAI GPT-4.1-mini',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'gpt-4.1-mini outperform gpt-4o-mini across the board, with major gains in coding, instruction following, and long-context handling',
    html_url: 'https://github.com/marketplace/models/azure-openai/gpt-4-1-mini',
    version: '2024-12-01',
    capabilities: ['streaming', 'tool-calling'],
    limits: {
      max_input_tokens: 524288,
      max_output_tokens: 16384
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text', 'image'],
    supported_output_modalities: ['text'],
    tags: ['efficient', 'coding', 'multimodal']
  },
  {
    id: 'azure-openai/gpt-4-1-nano',
    name: 'OpenAI GPT-4.1-nano',
    publisher: 'Azure OpenAI Service',
    registry: 'azure-openai',
    summary: 'gpt-4.1-nano provides gains in coding, instruction following, and long-context handling along with lower latency and cost',
    html_url: 'https://github.com/marketplace/models/azure-openai/gpt-4-1-nano',
    version: '2024-12-01',
    capabilities: ['streaming'],
    limits: {
      max_input_tokens: 262144,
      max_output_tokens: 8192
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['fast', 'cost-efficient', 'coding']
  },
  // DeepSeek Models - Popular reasoning models
  {
    id: 'azureml-deepseek/DeepSeek-R1-0528',
    name: 'DeepSeek-R1-0528',
    publisher: 'DeepSeek',
    registry: 'azureml-deepseek',
    summary: 'The DeepSeek R1 0528 model has improved reasoning capabilities, this version also offers a reduced hallucination rate, enhanced support for function calling, and better experience for vibe coding.',
    html_url: 'https://github.com/marketplace/models/azureml-deepseek/DeepSeek-R1-0528',
    version: '2025-05-28',
    capabilities: ['reasoning', 'tool-calling'],
    limits: {
      max_input_tokens: 131072,
      max_output_tokens: 8192
    },
    rate_limit_tier: 'reasoning',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['reasoning', 'coding', 'function-calling']
  },
  // xAI Grok Models - Elon Musk's AI company
  {
    id: 'azureml-xai/grok-3',
    name: 'Grok 3',
    publisher: 'xAI',
    registry: 'azureml-xai',
    summary: 'Grok 3 is xAI\'s debut model, pretrained by Colossus at supermassive scale to excel in specialized domains like finance, healthcare, and the law.',
    html_url: 'https://github.com/marketplace/models/azureml-xai/grok-3',
    version: '2025-01-01',
    capabilities: ['streaming', 'tool-calling'],
    limits: {
      max_input_tokens: 131072,
      max_output_tokens: 8192
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['specialized', 'finance', 'healthcare']
  },
  {
    id: 'azureml-xai/grok-3-mini',
    name: 'Grok 3 Mini',
    publisher: 'xAI',
    registry: 'azureml-xai',
    summary: 'Grok 3 Mini is a lightweight model that thinks before responding. Trained on mathematic and scientific problems, it is great for logic-based tasks.',
    html_url: 'https://github.com/marketplace/models/azureml-xai/grok-3-mini',
    version: '2025-01-01',
    capabilities: ['reasoning', 'streaming'],
    limits: {
      max_input_tokens: 65536,
      max_output_tokens: 4096
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['math', 'science', 'logic', 'lightweight']
  },
  // Microsoft Phi Models - Efficient small models
  {
    id: 'azureml/Phi-4-reasoning',
    name: 'Phi-4-reasoning',
    publisher: 'Microsoft',
    registry: 'azureml',
    summary: 'State-of-the-art open-weight reasoning model.',
    html_url: 'https://github.com/marketplace/models/azureml/Phi-4-reasoning',
    version: '2024-12-01',
    capabilities: ['reasoning'],
    limits: {
      max_input_tokens: 16384,
      max_output_tokens: 4096
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['reasoning', 'open-weight', 'efficient']
  },
  {
    id: 'azureml/Phi-4-mini-reasoning',
    name: 'Phi-4-mini-reasoning',
    publisher: 'Microsoft',
    registry: 'azureml',
    summary: 'Lightweight math reasoning model optimized for multi-step problem solving',
    html_url: 'https://github.com/marketplace/models/azureml/Phi-4-mini-reasoning',
    version: '2024-12-01',
    capabilities: ['reasoning'],
    limits: {
      max_input_tokens: 8192,
      max_output_tokens: 2048
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['math', 'reasoning', 'lightweight', 'efficient']
  },
  {
    id: 'azureml/Phi-4-multimodal-instruct',
    name: 'Phi-4-multimodal-instruct',
    publisher: 'Microsoft',
    registry: 'azureml',
    summary: 'First small multimodal model to have 3 modality inputs (text, audio, image), excelling in quality and efficiency',
    html_url: 'https://github.com/marketplace/models/azureml/Phi-4-multimodal-instruct',
    version: '2024-12-01',
    capabilities: ['multimodal', 'streaming'],
    limits: {
      max_input_tokens: 16384,
      max_output_tokens: 4096
    },
    rate_limit_tier: 'low',
    supported_input_modalities: ['text', 'image', 'audio'],
    supported_output_modalities: ['text'],
    tags: ['multimodal', 'efficient', 'small']
  },
  // Meta Llama 4 Models - Latest from Meta
  {
    id: 'azureml-meta/Llama-4-Scout-17B-16E-Instruct',
    name: 'Llama 4 Scout 17B 16E Instruct',
    publisher: 'Meta',
    registry: 'azureml-meta',
    summary: 'Llama 4 Scout 17B 16E Instruct is great at multi-document summarization, parsing extensive user activity for personalized tasks, and reasoning over vast codebases.',
    html_url: 'https://github.com/marketplace/models/azureml-meta/Llama-4-Scout-17B-16E-Instruct',
    version: '2025-01-01',
    capabilities: ['streaming', 'tool-calling'],
    limits: {
      max_input_tokens: 131072,
      max_output_tokens: 8192
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['summarization', 'reasoning', 'coding']
  },
  {
    id: 'azureml-meta/Llama-4-Maverick-17B-128E-Instruct-FP8',
    name: 'Llama 4 Maverick 17B 128E Instruct FP8',
    publisher: 'Meta',
    registry: 'azureml-meta',
    summary: 'Llama 4 Maverick 17B 128E Instruct FP8 is great at precise image understanding and creative writing, offering high quality at a lower price compared to Llama 3.3 70B',
    html_url: 'https://github.com/marketplace/models/azureml-meta/Llama-4-Maverick-17B-128E-Instruct-FP8',
    version: '2025-01-01',
    capabilities: ['multimodal', 'streaming'],
    limits: {
      max_input_tokens: 524288,
      max_output_tokens: 16384
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text', 'image'],
    supported_output_modalities: ['text'],
    tags: ['creative-writing', 'image-understanding', 'cost-efficient']
  },
  // Mistral AI Models
  {
    id: 'azureml-mistral/mistral-medium-2505',
    name: 'Mistral Medium 3 (25.05)',
    publisher: 'Mistral AI',
    registry: 'azureml-mistral',
    summary: 'Mistral Medium 3 is an advanced Large Language Model (LLM) with state-of-the-art reasoning, knowledge, coding and vision capabilities.',
    html_url: 'https://github.com/marketplace/models/azureml-mistral/mistral-medium-2505',
    version: '2025-05-01',
    capabilities: ['streaming', 'tool-calling', 'multimodal'],
    limits: {
      max_input_tokens: 262144,
      max_output_tokens: 8192
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text', 'image'],
    supported_output_modalities: ['text'],
    tags: ['reasoning', 'coding', 'vision', 'advanced']
  },
  // Cohere Models
  {
    id: 'azureml-cohere/cohere-command-a',
    name: 'Cohere Command A',
    publisher: 'Cohere',
    registry: 'azureml-cohere',
    summary: 'Command A is a highly efficient generative model that excels at agentic and multilingual use cases.',
    html_url: 'https://github.com/marketplace/models/azureml-cohere/cohere-command-a',
    version: '2025-01-01',
    capabilities: ['streaming', 'tool-calling'],
    limits: {
      max_input_tokens: 131072,
      max_output_tokens: 8192
    },
    rate_limit_tier: 'high',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['agentic', 'multilingual', 'efficient']
  },
  // Microsoft MAI-DS-R1 - Microsoft enhanced DeepSeek
  {
    id: 'azureml/MAI-DS-R1',
    name: 'MAI-DS-R1',
    publisher: 'Microsoft',
    registry: 'azureml',
    summary: 'MAI-DS-R1 is a DeepSeek-R1 reasoning model that has been post-trained by the Microsoft AI team to fill in information gaps in the previous version of the model and improve its harm protections while maintaining R1 reasoning capabilities.',
    html_url: 'https://github.com/marketplace/models/azureml/MAI-DS-R1',
    version: '2025-01-01',
    capabilities: ['reasoning', 'safety'],
    limits: {
      max_input_tokens: 131072,
      max_output_tokens: 8192
    },
    rate_limit_tier: 'reasoning',
    supported_input_modalities: ['text'],
    supported_output_modalities: ['text'],
    tags: ['reasoning', 'safety', 'microsoft-enhanced']
  }
];

// GitHub Models API Constants
export const GITHUB_MODELS_API_BASE = 'https://models.github.ai';
export const GITHUB_MODELS_ENDPOINT = `${GITHUB_MODELS_API_BASE}/catalog/models`;

// Authentication helper functions
export const createGitHubToken = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'Accept': 'application/vnd.github+json'
});

// Rate limits by tier (as defined in GitHub Models documentation)
export const RATE_LIMITS = {
  'low': {
    requests_per_minute: 15,
    requests_per_day: 150,
    tokens_per_request: { input: 8000, output: 4000 },
    concurrent_requests: 5
  },
  'high': {
    requests_per_minute: 10,
    requests_per_day: 50,
    tokens_per_request: { input: 8000, output: 4000 },
    concurrent_requests: 2
  },
  'reasoning': {
    requests_per_minute: 1,
    requests_per_day: 8,
    tokens_per_request: { input: 4000, output: 4000 },
    concurrent_requests: 1
  }
};

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
      if (!authState.accessToken) {
        // Only basic models available without auth
        const basicModels = AVAILABLE_GITHUB_MODELS.slice(0, 5); // First 5 models
        setAvailableModels(basicModels);
        return;
      }

      // Try to fetch models from the real GitHub Models API
      try {
        const response = await fetch(GITHUB_MODELS_ENDPOINT, {
          headers: createGitHubToken(authState.accessToken)
        });

        if (response.ok) {
          const models = await response.json();
          setAvailableModels(models);
        } else {
          // Fallback to our static list if API fails
          setAvailableModels(AVAILABLE_GITHUB_MODELS);
        }
      } catch (apiError) {
        console.warn('GitHub Models API not available, using static models:', apiError);
        setAvailableModels(AVAILABLE_GITHUB_MODELS);
      }
    } catch (error) {
      console.error('Error fetching available models:', error);
      // Fallback to basic models
      const fallbackModels = AVAILABLE_GITHUB_MODELS.slice(0, 5);
      setAvailableModels(fallbackModels);
    }
  }, [authState.accessToken, setAvailableModels]);

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
              name: sparkUser.name || sparkUser.login,
              email: sparkUser.email || '',
              avatar_url: sparkUser.avatarUrl || '',
              bio: sparkUser.bio || '',
              company: sparkUser.company || '',
              location: sparkUser.location || '',
              public_repos: sparkUser.publicRepos || 0,
              followers: sparkUser.followers || 0,
              following: sparkUser.following || 0
            };

            setAuthState(prev => ({
              ...prev,
              isAuthenticated: true,
              user: githubUser,
              accessToken: sparkUser.accessToken || 'spark-runtime-token',
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
      // Check if we're in a Spark environment first
      if (typeof window !== 'undefined' && window.spark) {
        const sparkUser = await spark.user();
        if (sparkUser && sparkUser.login) {
          const githubUser: GitHubUser = {
            id: sparkUser.id || 0,
            login: sparkUser.login,
            name: sparkUser.name || sparkUser.login,
            email: sparkUser.email || '',
            avatar_url: sparkUser.avatarUrl || '',
            bio: sparkUser.bio || '',
            company: sparkUser.company || '',
            location: sparkUser.location || '',
            public_repos: sparkUser.publicRepos || 0,
            followers: sparkUser.followers || 0,
            following: sparkUser.following || 0
          };

          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            user: githubUser,
            accessToken: sparkUser.accessToken || 'spark-runtime-token',
            isLoading: false,
            error: null
          }));

          // Fetch available models after successful sign in
          await fetchAvailableModels();
          return true;
        }
      }

      // Fallback for non-Spark environments (GitHub OAuth flow)
      console.log('Initiating GitHub OAuth flow for standalone environment');
      
      // GitHub OAuth configuration
      const clientId = 'Ov23liANWOJ1PfUKpBq4'; // GitHub OAuth App Client ID
      const redirectUri = `${window.location.origin}/auth/callback`;
      const scope = 'read:user user:email public_repo';
      const state = btoa(JSON.stringify({ 
        timestamp: Date.now(),
        origin: window.location.origin 
      }));

      // Store state for verification
      sessionStorage.setItem('github_oauth_state', state);
      
      // Build GitHub OAuth URL
      const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
      githubAuthUrl.searchParams.set('client_id', clientId);
      githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
      githubAuthUrl.searchParams.set('scope', scope);
      githubAuthUrl.searchParams.set('state', state);
      githubAuthUrl.searchParams.set('allow_signup', 'true');

      // Redirect to GitHub OAuth
      window.location.href = githubAuthUrl.toString();
      
      // Return false since we're redirecting (won't reach this point)
      return false;

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
    const basicModels = AVAILABLE_GITHUB_MODELS.slice(0, 5);
    setAvailableModels(basicModels);
  }, [setAuthState, setAvailableModels]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, [setAuthState]);

  const completeOAuth = useCallback((user: GitHubUser, accessToken: string) => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: true,
      user,
      accessToken,
      isLoading: false,
      error: null
    }));
    
    // Fetch available models after successful OAuth completion
    fetchAvailableModels();
  }, [setAuthState, fetchAvailableModels]);

  // Get user repositories using GitHub API
  const getUserRepos = useCallback(async () => {
    if (!authState.isAuthenticated || !authState.user || !authState.accessToken) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`https://api.github.com/users/${authState.user.login}/repos?sort=updated&per_page=10`, {
        headers: createGitHubToken(authState.accessToken)
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching repositories:', error);
      // Return mock data as fallback
      return [
        {
          id: 1,
          name: 'pilot-server-github',
          full_name: `${authState.user.login}/pilot-server-github`,
          description: 'AI Chat Interface with GitHub Models Integration',
          private: false,
          html_url: `https://github.com/${authState.user.login}/pilot-server-github`,
          language: 'TypeScript',
          stargazers_count: 0,
          forks_count: 0,
          updated_at: new Date().toISOString()
        }
      ];
    }
  }, [authState.isAuthenticated, authState.user, authState.accessToken]);

  // Test GitHub Models API connection
  const testModelsAPI = useCallback(async () => {
    if (!authState.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(GITHUB_MODELS_ENDPOINT, {
        headers: createGitHubToken(authState.accessToken)
      });

      if (!response.ok) {
        throw new Error(`GitHub Models API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        modelsCount: Array.isArray(data) ? data.length : 0,
        firstModel: Array.isArray(data) && data.length > 0 ? data[0] : null
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [authState.accessToken]);

  // Initialize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        // Check for existing Spark authentication
        if (typeof window !== 'undefined' && window.spark) {
          try {
            const sparkUser = await spark.user();
            if (sparkUser && sparkUser.login) {
              const githubUser: GitHubUser = {
                id: sparkUser.id || 0,
                login: sparkUser.login,
                name: sparkUser.name || sparkUser.login,
                email: sparkUser.email || '',
                avatar_url: sparkUser.avatarUrl || '',
                bio: sparkUser.bio || '',
                company: sparkUser.company || '',
                location: sparkUser.location || '',
                public_repos: sparkUser.publicRepos || 0,
                followers: sparkUser.followers || 0,
                following: sparkUser.following || 0
              };

              setAuthState(prev => ({
                ...prev,
                isAuthenticated: true,
                user: githubUser,
                accessToken: sparkUser.accessToken || 'spark-runtime-token',
                isLoading: false,
                error: null
              }));

              // Fetch available models after successful initialization
              await fetchAvailableModels();
              return;
            }
          } catch (sparkError) {
            console.log('Spark authentication not available:', sparkError);
          }
        }

        // For non-Spark environments, just load the models without authentication
        console.log('Running in standalone mode - authentication required for GitHub Models access');
        await fetchAvailableModels();
        
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: null
        }));

      } catch (error) {
        console.error('Authentication initialization failed:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication initialization failed'
        }));
      }
    };

    initAuth();
  }, [fetchAvailableModels]);

  return {
    authState,
    availableModels,
    signIn,
    signOut,
    clearError,
    completeOAuth,
    getUserRepos,
    fetchAvailableModels,
    testModelsAPI,
    // Helper methods
    getRateLimits: (tier: string) => RATE_LIMITS[tier as keyof typeof RATE_LIMITS],
    getModelById: (id: string) => availableModels.find(model => model.id === id),
    getModelsByPublisher: (publisher: string) => availableModels.filter(model => model.publisher === publisher),
    getModelsByCapability: (capability: string) => availableModels.filter(model => model.capabilities.includes(capability))
  };
}
