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

  async createDebtPlan(
    plan: Omit<DebtPlan, 'id' | 'user_id' | 'created_at' | 'is_active'>,
  ): Promise<{ data: DebtPlan | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    // Deactivate any other active plans for this user first
    await supabase
      .from('debt_plans')
      .update({ is_active: false })
      .eq('user_id', user.id);

    const { data, error } = await supabase
      .from('debt_plans')
      .insert({
        ...plan,
        extra_monthly_payment: plan.extra_monthly_payment ?? 0,
        user_id: user.id,
        is_active: true,
      })
      .select()
      .single();
    
    return { data, error: error?.message || null };
  },

  async updateDebtPlan(
    id: string,
    updates: Partial<
      Pick<
        DebtPlan,
        | 'name'
        | 'monthly_income'
        | 'budget_percentage'
        | 'payment_strategy'
        | 'extra_monthly_payment'
        | 'is_active'
      >
    >,
  ): Promise<{ data: DebtPlan | null; error: string | null }> {
    const { data, error } = await supabase
      .from('debt_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error: error?.message || null };
  },

  /** Create or update the single active debt plan preferences. */
  async saveActiveDebtPlan(params: {
    name: string;
    monthly_income: number;
    budget_percentage: number;
    payment_strategy: 'avalanche' | 'snowball';
    extra_monthly_payment: number;
  }): Promise<{ error: string | null }> {
    const current = await debtPlansApi.getCurrentDebtPlan();
    if (current.error) return { error: current.error };

    if (current.data) {
      const { error } = await debtPlansApi.updateDebtPlan(current.data.id, {
        name: params.name,
        monthly_income: params.monthly_income,
        budget_percentage: params.budget_percentage,
        payment_strategy: params.payment_strategy,
        extra_monthly_payment: params.extra_monthly_payment,
      });
      return { error };
    }

    const { error } = await debtPlansApi.createDebtPlan({
      name: params.name,
      monthly_income: params.monthly_income,
      budget_percentage: params.budget_percentage,
      payment_strategy: params.payment_strategy,
      extra_monthly_payment: params.extra_monthly_payment,
    });
    return { error };
  },
}; 