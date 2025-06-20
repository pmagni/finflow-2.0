import { supabase } from '../supabase';
import type { Achievement, FinancialHealthScore } from '../../types';

export const gamificationApi = {
  /**
   * Fetches all achievements for the current user.
   */
  async getAchievements(): Promise<{ data: Achievement[] | null; error: string | null }> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('achieved_at', { ascending: false });

    return { data, error: error?.message || null };
  },

  /**
   * Fetches the latest financial health score for the current user.
   */
  async getFinancialHealthScore(): Promise<{ data: FinancialHealthScore | null; error: string | null }> {
    const { data, error } = await supabase
      .from('financial_health_scores')
      .select('*')
      .order('calculated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error: error?.message || null };
  }
}; 