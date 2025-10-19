import { createClient } from '@supabase/supabase-js';

// Default to empty strings - app will work in localStorage-only mode without configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client even with empty credentials - it won't make requests but won't error
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
  }
);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && 
           supabaseUrl !== 'https://placeholder.supabase.co' && 
           supabaseAnonKey !== 'placeholder-key');
};

// Log mode for developers
if (typeof window !== 'undefined') {
  if (isSupabaseConfigured()) {
    console.log('🚀 Pilot Server: Running with Supabase backend');
  } else {
    console.log('💾 Pilot Server: Running in localStorage mode (no Supabase configuration found)');
    console.log('📖 To enable database features, see docs/SUPABASE_SETUP.md');
  }
}

// Database types for TypeScript
export interface ChatMessage {
  id: string;
  user_id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  github_id: number;
  username: string;
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentEmbedding {
  id: string;
  user_id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  created_at: string;
}
