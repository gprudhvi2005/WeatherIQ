import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import * as authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  // Initialize auth state listener
  initialize: () => {
    if (!isSupabaseConfigured) {
      set({ loading: false });
      return () => {};
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ 
        session, 
        user: session?.user ?? null, 
        loading: false 
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ 
          session, 
          user: session?.user ?? null, 
          loading: false 
        });
      }
    );

    return () => subscription.unsubscribe();
  },

  // Sign up
  signUp: async (email, password) => {
    set({ error: null, loading: true });
    try {
      const data = await authService.signUp(email, password);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Sign in
  signIn: async (email, password) => {
    set({ error: null, loading: true });
    try {
      const data = await authService.signIn(email, password);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Sign out
  signOut: async () => {
    set({ error: null });
    try {
      await authService.signOut();
      set({ user: null, session: null });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Reset password
  resetPassword: async (email) => {
    set({ error: null });
    try {
      await authService.resetPassword(email);
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
