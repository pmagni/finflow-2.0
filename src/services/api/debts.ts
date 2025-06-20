import { supabase } from '../supabase';
import type { Debt } from '../../types';

export const debtsApi = {
  async getDebts(): Promise<{ data: Debt[] | null; error: string | null }> {
    const { data, error } = await supabase.from('debts').select('*');
    return { data, error: error?.message || null };
  },

  async createDebt(debt: Omit<Debt, 'id' | 'user_id' | 'created_at'>): Promise<{ data: Debt | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('debts')
      .insert({ ...debt, user_id: user.id })
      .select()
      .single();
    
    return { data, error: error?.message || null };
  },

  async updateDebt(id: string, updates: Partial<Debt>): Promise<{ data: Debt | null; error: string | null }> {
    const { data, error } = await supabase
      .from('debts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error: error?.message || null };
  },

  async deleteDebt(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase.from('debts').delete().eq('id', id);
    return { error: error?.message || null };
  }
}; 