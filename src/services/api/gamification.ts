import { supabase } from '../supabase';
import type { Achievement, FinancialHealthScore, GamificationEvent } from '../../types';

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
  },

  async listRecentEvents(limit = 200): Promise<{ data: GamificationEvent[] | null; error: string | null }> {
    const { data, error } = await supabase
      .from('gamification_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error: error?.message || null };
  },

  async logEvent(
    event_type: string,
    points_earned: number,
    metadata?: Record<string, unknown> | null,
  ): Promise<{ error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'User not authenticated' };

    const { error } = await supabase.from('gamification_events').insert({
      user_id: user.id,
      event_type,
      points_earned,
      metadata: metadata ?? null,
    });

    return { error: error?.message || null };
  },
}; 