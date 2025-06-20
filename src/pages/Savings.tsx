import { useState } from 'react';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { useStore } from '../store/useStore';
import { PlusCircle } from 'lucide-react';
import SavingsGoalList from '../components/SavingsGoalList';
import SavingsGoalForm from '../components/SavingsGoalForm';

export default function Savings() {
  const { goals, loading, error } = useSavingsGoals();
  const { addGoal } = useStore(state => state.savingsGoalState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddGoal = async (goalData: any) => {
    await addGoal(goalData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <p className="text-gray-500">Set and track your financial goals.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <PlusCircle size={20} />
          Set New Goal
        </button>
      </div>

      {loading && <p>Loading goals...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <SavingsGoalList goals={goals} />
      )}

      {isModalOpen && (
        <SavingsGoalForm
          onSubmit={handleAddGoal}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
} 