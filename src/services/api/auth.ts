import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

export const authApi = {
  async login(email: string, password: string): Promise<{ token: string | null; user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { token: null, user: null, error: error.message };
    }
    
    return { token: data.session?.access_token || null, user: data.user, error: null };
  },

  async register(name: string, email: string, password: string): Promise<{ token: string | null; user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return { token: null, user: null, error: error.message };
    }

    return { token: data.session?.access_token || null, user: data.user, error: null };
  },

  async getUser(): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { user: null, error: error.message };
    }
    
    return { user: data.user, error: null };
  },

  async signOut(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  }
}; 