import { supabase } from '../supabase';
import type { SavingsGoal } from '../../types';

export const savingsGoalsApi = {
  async getSavingsGoals(): Promise<{ data: SavingsGoal[] | null; error: string | null }> {
    const { data, error } = await supabase.from('savings_goals').select('*');
    return { data, error: error?.message || null };
  },

  async createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'current_amount'>): Promise<{ data: SavingsGoal | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('savings_goals')
      .insert({ ...goal, user_id: user.id })
      .select()
      .single();
    
    return { data, error: error?.message || null };
  },

  async updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): Promise<{ data: SavingsGoal | null; error: string | null }> {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error: error?.message || null };
  },

  async deleteSavingsGoal(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    return { error: error?.message || null };
  }
}; 