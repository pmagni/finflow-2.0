import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useDebts } from '../hooks/useDebts';
import { useDebtStrategy } from '../hooks/useDebtStrategy';
import DebtForm from '../components/DebtForm';
import DebtList from '../components/DebtList';
import DebtSummary from '../components/DebtSummary';
import DebtStrategyForm from '../components/DebtStrategyForm';
import PaymentTimeline from '../components/PaymentTimeline';
import Card from '../components/Card';
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Planificador de Deudas</h1>
          <p>Gestiona tus deudas y crea un plan para pagarlas.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Agregar Deuda
        </button>
      </div>

      {debtsLoading && <p>Cargando deudas...</p>}
      {debtsError && <p style={{ color: '#ef4444' }}>Error: {debtsError}</p>}
      
      {!debtsLoading && !debtsError && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="debt-panel">
            <DebtSummary debts={debts} />
            <div style={{ marginTop: '2rem' }}>
              <DebtList debts={debts} />
            </div>
          </div>
          <div>
            <Card>
              <DebtStrategyForm onSubmit={handleStrategySubmit} loading={strategyLoading} />
              {strategyError && <p style={{ color: '#ef4444', marginTop: '1rem' }}>Error: {strategyError}</p>}
              {strategyResult && (
                <PaymentTimeline result={strategyResult} />
              )}
            </Card>
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