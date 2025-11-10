/**
 * Configuration loader for browser environment
 * Reads from window.__ENV__ set by public/env.js
 */

interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  OPENAI_API_KEY: string;
  GITHUB_CLIENT_ID: string;
}

// Safe access to environment variables
function getEnv(): Partial<EnvConfig> {
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__;
  }
  return {};
}

// Export config with safe defaults
export const config = {
  supabase: {
    url: getEnv().SUPABASE_URL || '',
    anonKey: getEnv().SUPABASE_ANON_KEY || '',
    enabled: !!(getEnv().SUPABASE_URL && getEnv().SUPABASE_ANON_KEY)
  },
  openai: {
    apiKey: getEnv().OPENAI_API_KEY || '',
    enabled: !!getEnv().OPENAI_API_KEY
  },
  github: {
    clientId: getEnv().GITHUB_CLIENT_ID || '',
    enabled: !!getEnv().GITHUB_CLIENT_ID
  },
  // Determine app mode
  mode: getEnv().SUPABASE_URL ? 'supabase' : 'localStorage'
} as const;

export type AppConfig = typeof config;
