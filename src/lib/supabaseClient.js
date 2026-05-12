import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not set (development mode)
const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-ref.supabase.co';

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = isConfigured;

/**
 * Helper to check if Supabase is available before making calls
 */
export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }
  return supabase;
}
