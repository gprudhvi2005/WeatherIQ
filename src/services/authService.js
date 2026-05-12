import { supabase, requireSupabase } from '../lib/supabaseClient';

/**
 * Sign up a new user
 */
export async function signUp(email, password) {
  const sb = requireSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in an existing user
 */
export async function signIn(email, password) {
  const sb = requireSupabase();
  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const sb = requireSupabase();
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  const sb = requireSupabase();
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

/**
 * Get current session
 */
export async function getSession() {
  const sb = requireSupabase();
  const { data, error } = await sb.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Get current user
 */
export async function getUser() {
  const sb = requireSupabase();
  const { data, error } = await sb.auth.getUser();
  if (error) throw error;
  return data.user;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}
