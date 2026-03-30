import { supabase } from '../supabase';

export const budgetSnapshotsApi = {
  async createFromBudget(
    monthYear: string,
    snapshotData: Record<string, unknown>,
    totals: { total_income: number; total_expenses: number; total_savings: number },
  ): Promise<{ error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'User not authenticated' };

    const { error } = await supabase.from('budget_snapshots').insert({
      user_id: user.id,
      month_year: monthYear,
      snapshot_data: snapshotData,
      total_income: totals.total_income,
      total_expenses: totals.total_expenses,
      total_savings: totals.total_savings,
    });

    return { error: error?.message || null };
  },
};
