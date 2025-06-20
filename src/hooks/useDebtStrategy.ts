import { useState, useCallback } from 'react';
import type { Debt } from '../types';

type Strategy = 'snowball' | 'avalanche';

export interface AmortizationEntry {
  month: number;
  balance: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
}

export interface StrategyResult {
  timeline: AmortizationEntry[];
  totalInterestPaid: number;
  totalMonths: number;
  payoffDate: Date;
}

export const useDebtStrategy = () => {
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((debts: Debt[], extraPayment: number, strategy: Strategy) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Basic validation
    if (debts.length === 0) {
      setError("No debts to calculate.");
      setLoading(false);
      return;
    }

    // Clone debts to avoid mutating original data
    let remainingDebts = JSON.parse(JSON.stringify(debts));
    const totalMinimumPayment = remainingDebts.reduce((acc: number, debt: Debt) => acc + (debt.minimum_payment || 0), 0);
    let month = 0;
    let totalInterestPaid = 0;
    const timeline: AmortizationEntry[] = [];

    // The "payment pool" is the total minimum payments plus any extra payment
    let paymentPool = totalMinimumPayment + extraPayment;

    while (remainingDebts.length > 0) {
      month++;
      let monthInterest = 0;
      let monthPrincipal = 0;
      let monthTotalPayment = 0;

      // Sort debts based on the chosen strategy
      if (strategy === 'avalanche') {
        remainingDebts.sort((a: Debt, b: Debt) => (b.interest_rate || 0) - (a.interest_rate || 0));
      } else { // snowball
        remainingDebts.sort((a: Debt, b: Debt) => a.balance - b.balance);
      }
      
      let remainingPool = paymentPool;

      // Pay minimums first
      for (const debt of remainingDebts) {
        const interestForMonth = debt.balance * ((debt.interest_rate || 0) / 12);
        monthInterest += interestForMonth;
        
        const minPayment = Math.min(debt.balance + interestForMonth, debt.minimum_payment || 0);
        debt.balance -= (minPayment - interestForMonth);
        monthPrincipal += (minPayment - interestForMonth);
        monthTotalPayment += minPayment;
        remainingPool -= minPayment;
      }

      // Apply extra payment ("snowball" amount) to the target debt
      if (remainingPool > 0) {
        for (const debt of remainingDebts) {
            const interestForMonth = debt.balance * ((debt.interest_rate || 0) / 12); // Recalculate interest after min payments
            const payment = Math.min(debt.balance + interestForMonth, remainingPool);
            
            if (payment > 0) {
                debt.balance -= (payment - interestForMonth);
                monthPrincipal += (payment - interestForMonth);
                monthTotalPayment += payment;
                remainingPool -= payment;

                if(remainingPool <= 0) break;
            }
        }
      }

      totalInterestPaid += monthInterest;

      const currentTotalBalance = remainingDebts.reduce((acc: number, debt: Debt) => acc + debt.balance, 0);

      timeline.push({
        month,
        balance: currentTotalBalance,
        principalPaid: monthPrincipal,
        interestPaid: monthInterest,
        totalPayment: monthTotalPayment,
      });

      // Remove paid-off debts and add their minimum payments to the pool
      const paidOffDebts = remainingDebts.filter((d: Debt) => d.balance <= 0);
      for(const paidDebt of paidOffDebts) {
          paymentPool += paidDebt.minimum_payment || 0;
      }
      remainingDebts = remainingDebts.filter((d: Debt) => d.balance > 0);

      if (month > 500) { // Safety break
        setError("Calculation took too long. Please check your debt values.");
        break;
      }
    }
    
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + month);
    
    setResult({
      timeline,
      totalInterestPaid,
      totalMonths: month,
      payoffDate,
    });
    setLoading(false);

  }, []);

  return { calculate, result, loading, error };
}; 