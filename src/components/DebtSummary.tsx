import { useMemo } from 'react';
import type { Debt } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Landmark, PiggyBank, ReceiptText } from 'lucide-react';

interface DebtSummaryProps {
  debts: Debt[];
}

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default function DebtSummary({ debts }: DebtSummaryProps) {
  const summary = useMemo(() => {
    const totalBalance = debts.reduce((acc, debt) => acc + debt.balance, 0);
    const numberOfDebts = debts.length;

    const totalInterestRate = debts.reduce((acc, debt) => acc + (debt.interest_rate || 0), 0);
    const averageInterestRate = numberOfDebts > 0 ? totalInterestRate / numberOfDebts : 0;

    return {
      totalBalance,
      numberOfDebts,
      averageInterestRate,
    };
  }, [debts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<PiggyBank size={24} className="text-white" />}
        title="Total Debt Balance"
        value={formatCurrency(summary.totalBalance)}
        color="bg-red-500"
      />
      <StatCard
        icon={<Landmark size={24} className="text-white" />}
        title="Number of Debts"
        value={String(summary.numberOfDebts)}
        color="bg-blue-500"
      />
      <StatCard
        icon={<ReceiptText size={24} className="text-white" />}
        title="Average Interest Rate"
        value={formatPercent(summary.averageInterestRate)}
        color="bg-yellow-500"
      />
    </div>
  );
} 