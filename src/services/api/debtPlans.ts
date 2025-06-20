import { supabase } from '../supabase';
import type { DebtPlan } from '../../types';

export const debtPlansApi = {
  async getCurrentDebtPlan(): Promise<{ data: DebtPlan | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('debt_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle(); // Use maybeSingle to return null instead of error if no plan is found

    return { data, error: error?.message || null };
  },

  async createDebtPlan(plan: Omit<DebtPlan, 'id' | 'user_id' | 'created_at' | 'is_active'>): Promise<{ data: DebtPlan | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    // Deactivate any other active plans for this user first
    await supabase
      .from('debt_plans')
      .update({ is_active: false })
      .eq('user_id', user.id);

    const { data, error } = await supabase
      .from('debt_plans')
      .insert({ ...plan, user_id: user.id, is_active: true })
      .select()
      .single();
    
    return { data, error: error?.message || null };
  }
}; 