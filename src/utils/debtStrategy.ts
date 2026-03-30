import type { Debt } from '../types';

export type PayoffStrategy = 'snowball' | 'avalanche';

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

export function computeDebtPayoff(
  debts: Debt[],
  extraPayment: number,
  strategy: PayoffStrategy,
): { ok: true; result: StrategyResult } | { ok: false; error: string } {
  if (debts.length === 0) {
    return { ok: false, error: 'No hay deudas para calcular.' };
  }

  let remainingDebts: Debt[] = JSON.parse(JSON.stringify(debts)) as Debt[];
  let month = 0;
  let totalInterestPaid = 0;
  const timeline: AmortizationEntry[] = [];

  const totalMinimumPayment = remainingDebts.reduce(
    (acc, debt) => acc + (debt.minimum_payment || 0),
    0,
  );
  let paymentPool = totalMinimumPayment + extraPayment;

  while (remainingDebts.length > 0) {
    month++;
    let monthInterest = 0;
    let monthPrincipal = 0;
    let monthTotalPayment = 0;

    if (strategy === 'avalanche') {
      remainingDebts.sort((a, b) => (b.interest_rate || 0) - (a.interest_rate || 0));
    } else {
      remainingDebts.sort((a, b) => a.balance - b.balance);
    }

    let remainingPool = paymentPool;

    for (const debt of remainingDebts) {
      const interestForMonth = debt.balance * ((debt.interest_rate || 0) / 12);
      monthInterest += interestForMonth;

      const minPayment = Math.min(debt.balance + interestForMonth, debt.minimum_payment || 0);
      debt.balance -= minPayment - interestForMonth;
      monthPrincipal += minPayment - interestForMonth;
      monthTotalPayment += minPayment;
      remainingPool -= minPayment;
    }

    if (remainingPool > 0) {
      for (const debt of remainingDebts) {
        const interestForMonth = debt.balance * ((debt.interest_rate || 0) / 12);
        const payment = Math.min(debt.balance + interestForMonth, remainingPool);

        if (payment > 0) {
          debt.balance -= payment - interestForMonth;
          monthPrincipal += payment - interestForMonth;
          monthTotalPayment += payment;
          remainingPool -= payment;

          if (remainingPool <= 0) break;
        }
      }
    }

    totalInterestPaid += monthInterest;

    const currentTotalBalance = remainingDebts.reduce((acc, debt) => acc + debt.balance, 0);

    timeline.push({
      month,
      balance: currentTotalBalance,
      principalPaid: monthPrincipal,
      interestPaid: monthInterest,
      totalPayment: monthTotalPayment,
    });

    const paidOffDebts = remainingDebts.filter((d) => d.balance <= 0);
    for (const paidDebt of paidOffDebts) {
      paymentPool += paidDebt.minimum_payment || 0;
    }
    remainingDebts = remainingDebts.filter((d) => d.balance > 0);

    if (month > 500) {
      return { ok: false, error: 'El cálculo excedió el límite de meses. Revisa montos y tasas.' };
    }
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);

  return {
    ok: true,
    result: {
      timeline,
      totalInterestPaid,
      totalMonths: month,
      payoffDate,
    },
  };
}
