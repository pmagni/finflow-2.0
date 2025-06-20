import { useState, useEffect, useCallback } from 'react';
import { budgetsApi } from '../services/api';
import type { Budget } from '../types';
import { useAuth } from '../context/AuthContext';

export const useBudget = (month: string) => {
  const { user } = useAuth();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await budgetsApi.getBudget(month);
    if (apiError) {
      setError(apiError);
    } else {
      setBudget(data);
    }
    setLoading(false);
  }, [month, user]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const saveBudget = async (budgetData: Omit<Budget, 'id' | 'user_id' | 'created_at'>) => {
    setLoading(true);
    const { data, error: apiError } = await budgetsApi.upsertBudget(budgetData);
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return null;
    } else {
      setBudget(data);
      setLoading(false);
      setError(null);
      return data;
    }
  };

  return { budget, loading, error, saveBudget, refetch: fetchBudget };
}; 