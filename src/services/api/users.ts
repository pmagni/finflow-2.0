import { supabase } from '../supabase';
import type { UserPreferences } from '../../types';

export const usersApi = {
  async getMyProfile(): Promise<{ data: any; error: string | null }> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: userError?.message || 'User not found' };
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  },

  async updateMyProfile(preferences: Partial<UserPreferences>): Promise<{ data: any; error: string | null }> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: userError?.message || 'User not found' };
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }
}; 