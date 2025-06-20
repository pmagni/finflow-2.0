import { supabase } from '../supabase';

export const adminApi = {
  async getMetrics(): Promise<{ data: any; error: string | null }> {
    // This must be an edge function that verifies the user is an admin
    const { data, error } = await supabase.functions.invoke('get-admin-metrics');

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }
}; 