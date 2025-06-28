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
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Metas de Ahorro</h1>
          <p>Establece y rastrea tus objetivos financieros.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Nueva Meta
        </button>
      </div>

      {loading && <p>Cargando metas...</p>}
      {error && <p style={{ color: '#ef4444' }}>Error: {error}</p>}

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