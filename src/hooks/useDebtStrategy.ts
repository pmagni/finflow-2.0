import { useState, useCallback } from 'react';
import type { Debt } from '../types';
import {
  computeDebtPayoff,
  type PayoffStrategy,
  type AmortizationEntry,
  type StrategyResult,
} from '../utils/debtStrategy';

export type { AmortizationEntry, StrategyResult, PayoffStrategy };

export const useDebtStrategy = () => {
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((debts: Debt[], extraPayment: number, strategy: PayoffStrategy) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const out = computeDebtPayoff(debts, extraPayment, strategy);
    if (!out.ok) {
      setError(out.error);
      setLoading(false);
      return;
    }

    setResult(out.result);
    setLoading(false);
  }, []);

  return { calculate, result, loading, error };
};
