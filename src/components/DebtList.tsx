import type { Debt } from '../types';
import DebtListItem from './DebtListItem';

interface DebtListProps {
  debts: Debt[];
}

export default function DebtList({ debts }: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-medium">No Debts Found</h3>
        <p className="text-gray-500 mt-2">Get started by adding your first debt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {debts.map((debt) => (
        <DebtListItem key={debt.id} debt={debt} />
      ))}
    </div>
  );
} 