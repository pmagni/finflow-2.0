import { supabase } from '../supabase';
import type { Budget } from '../../types';

export const budgetsApi = {
  /**
   * Fetches the budget for a specific month for the current user.
   * @param month - The month in 'YYYY-MM' format.
   */
  async getBudget(month: string): Promise<{ data: Budget | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', month)
      .maybeSingle(); // Returns null if no budget is found, instead of an error

    return { data, error: error?.message || null };
  },

  /**
   * Creates or updates a budget for the current user.
   * @param budgetData - The budget data to save.
   */
  async upsertBudget(budgetData: Omit<Budget, 'id' | 'user_id' | 'created_at'>): Promise<{ data: Budget | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('budgets')
      .upsert({ ...budgetData, user_id: user.id })
      .select()
      .single();
    
    return { data, error: error?.message || null };
  }
}; 