import { supabase } from '../supabase';

export const aiApi = {
  async getAdvise(userContext: object): Promise<{ data: any; error: string | null }> {
    const { data, error } = await supabase.functions.invoke('get-financial-advise', {
      body: { userContext },
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }
}; 