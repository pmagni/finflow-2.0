import { useState } from 'react';
import type { Debt } from '../types';
import { useStore } from '../store/useStore';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Edit, Trash2 } from 'lucide-react';
// import DebtForm from './DebtForm'; // We will use this later for editing

interface DebtListItemProps {
  debt: Debt;
}

export default function DebtListItem({ debt }: DebtListItemProps) {
  const { deleteDebt, updateDebt } = useStore(state => state.debtState);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${debt.name}"?`)) {
      deleteDebt(debt.id);
    }
  };

  const handleUpdate = async (updatedData: Partial<Debt>) => {
    await updateDebt(debt.id, updatedData);
    setIsEditing(false);
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{debt.name}</h3>
          <div className="text-sm text-gray-500 mt-2 space-y-1">
            <p>Balance: <span className="font-medium text-gray-700">{formatCurrency(debt.balance)}</span></p>
            <p>Interest Rate: <span className="font-medium text-gray-700">{formatPercent(debt.interest_rate)}</span></p>
            <p>Minimum Payment: <span className="font-medium text-gray-700">{formatCurrency(debt.minimum_payment)}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
            aria-label="Edit debt"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
            aria-label="Delete debt"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {/*
      {isEditing && (
        <DebtForm
          debtToEdit={debt}
          onSubmit={handleUpdate}
          onClose={() => setIsEditing(false)}
        />
      )}
      */}
    </div>
  );
} 