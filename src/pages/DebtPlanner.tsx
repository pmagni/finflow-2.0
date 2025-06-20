import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useDebts } from '../hooks/useDebts';
import { useDebtStrategy } from '../hooks/useDebtStrategy';
import DebtForm from '../components/DebtForm';
import DebtList from '../components/DebtList';
import DebtSummary from '../components/DebtSummary';
import DebtStrategyForm from '../components/DebtStrategyForm';
import PaymentTimeline from '../components/PaymentTimeline';
import { PlusCircle } from 'lucide-react';

export default function DebtPlanner() {
  const { debts, loading: debtsLoading, error: debtsError } = useDebts();
  const { addDebt } = useStore(state => state.debtState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    calculate,
    result: strategyResult,
    loading: strategyLoading,
    error: strategyError
  } = useDebtStrategy();

  const handleAddDebt = async (debtData: any) => {
    await addDebt(debtData);
    setIsModalOpen(false);
  };

  const handleStrategySubmit = (extraPayment: number, strategy: 'snowball' | 'avalanche') => {
    calculate(debts, extraPayment, strategy);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Debt Planner</h1>
          <p className="text-gray-500">Manage your debts and create a plan to pay them off.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <PlusCircle size={20} />
          Add Debt
        </button>
      </div>

      {debtsLoading && <p>Loading debts...</p>}
      {debtsError && <p className="text-red-500">Error: {debtsError}</p>}
      
      {!debtsLoading && !debtsError && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DebtSummary debts={debts} />
            <DebtList debts={debts} />
          </div>
          <div className="lg:col-span-1">
            <DebtStrategyForm onSubmit={handleStrategySubmit} loading={strategyLoading} />
            {strategyError && <p className="text-red-500 mt-4">Error: {strategyError}</p>}
            {strategyResult && (
              <PaymentTimeline result={strategyResult} />
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <DebtForm
          onSubmit={handleAddDebt}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
