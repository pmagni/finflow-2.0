import { supabase } from '../supabase';
import type { Transaction } from '../../types';

export const transactionsApi = {
  async getTransactions(): Promise<{ data: Transaction[] | null; error: string | null }> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
      
    return { data, error: error?.message || null };
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<{ data: Transaction | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })
      .select()
      .single();
    
    return { data, error: error?.message || null };
  }
}; 