import { useState } from 'react';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/formatters';
import type { SavingsGoal } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import {
  Plus,
  PiggyBank,
  Trash2,
  Pencil,
  DollarSign,
  Loader2,
  Target,
  ArrowUpCircle,
} from 'lucide-react';

export default function Savings() {
  const { goals, loading, error } = useSavingsGoals();
  const { addGoal, updateGoal, deleteGoal, addFunds } = useStore((s) => s.savingsGoalState.actions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [fundGoalId, setFundGoalId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formTarget, setFormTarget] = useState('');

  const openAddModal = () => {
    setEditingGoal(null);
    setFormName('');
    setFormTarget('');
    setIsModalOpen(true);
  };

  const openEditModal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setFormName(goal.name);
    setFormTarget(String(goal.target_amount));
    setIsModalOpen(true);
  };

  const handleSubmitGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formName,
      target_amount: parseFloat(formTarget) || 0,
    };
    if (editingGoal) {
      await updateGoal(editingGoal.id, data);
    } else {
      await addGoal(data);
    }
    setIsModalOpen(false);
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fundGoalId && parseFloat(fundAmount) > 0) {
      await addFunds(fundGoalId, parseFloat(fundAmount));
      setFundGoalId(null);
      setFundAmount('');
    }
  };

  const totalSaved = goals.reduce((s, g) => s + (g.current_amount || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-danger-50 border border-danger-200 p-3.5">
          <p className="text-sm text-danger-700">Error: {error}</p>
        </div>
      )}

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-surface-500">Progreso Total de Ahorro</p>
            <p className="mt-1 text-2xl font-bold text-surface-900 tabular-nums">
              {formatCurrency(totalSaved)} <span className="text-base font-normal text-surface-400">/ {formatCurrency(totalTarget)}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600 tabular-nums">{overallPct}%</p>
          </div>
        </div>
        <div className="mt-3 h-3 rounded-full bg-surface-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-success-500 transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Goals grid */}
      <Card
        title="Mis Metas"
        subtitle={`${goals.length} meta${goals.length !== 1 ? 's' : ''} de ahorro`}
        action={
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nueva Meta
          </button>
        }
      >
        {goals.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="Sin metas de ahorro"
            description="Crea tu primera meta para comenzar a construir tu futuro financiero."
            action={
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Crear primera meta
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const pct = goal.target_amount > 0
                ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
                : 0;
              return (
                <div
                  key={goal.id}
                  className="rounded-xl border border-surface-200 p-4 hover:border-surface-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-success-50">
                        <Target className="w-4.5 h-4.5 text-success-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{goal.name}</p>
                        <p className="text-xs text-surface-500">{pct}% completado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors cursor-pointer"
                        aria-label="Editar meta"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 rounded-lg text-surface-400 hover:bg-danger-50 hover:text-danger-600 transition-colors cursor-pointer"
                        aria-label="Eliminar meta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="h-2.5 rounded-full bg-surface-100 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-success-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-surface-900 tabular-nums">
                      {formatCurrency(goal.current_amount)}
                    </span>
                    <span className="text-xs text-surface-500 tabular-nums">
                      {formatCurrency(goal.target_amount)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setFundGoalId(goal.id);
                      setFundAmount('');
                    }}
                    className="w-full h-9 rounded-lg border border-success-300 text-success-700 text-xs font-medium hover:bg-success-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    Agregar Fondos
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add/Edit Goal Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Editar Meta' : 'Nueva Meta de Ahorro'}
      >
        <form onSubmit={handleSubmitGoal} className="space-y-4">
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium text-surface-700 mb-1.5">
              Nombre de la meta
            </label>
            <input
              id="goalName"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Ej: Fondo de emergencia"
            />
          </div>
          <div>
            <label htmlFor="goalTarget" className="block text-sm font-medium text-surface-700 mb-1.5">
              Monto objetivo
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              <input
                id="goalTarget"
                type="number"
                required
                min="1"
                step="0.01"
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                className="w-full h-11 pl-9 pr-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="5000.00"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-11 rounded-lg border border-surface-300 text-surface-700 text-sm font-medium hover:bg-surface-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors cursor-pointer"
            >
              {editingGoal ? 'Guardar' : 'Crear Meta'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        open={fundGoalId !== null}
        onClose={() => setFundGoalId(null)}
        title="Agregar Fondos"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleAddFunds} className="space-y-4">
          <div>
            <label htmlFor="fundAmount" className="block text-sm font-medium text-surface-700 mb-1.5">
              Monto a agregar
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              <input
                id="fundAmount"
                type="number"
                required
                min="0.01"
                step="0.01"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="w-full h-11 pl-9 pr-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="100.00"
                autoFocus
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFundGoalId(null)}
              className="flex-1 h-11 rounded-lg border border-surface-300 text-surface-700 text-sm font-medium hover:bg-surface-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-lg bg-success-600 text-white text-sm font-semibold hover:bg-success-700 transition-colors cursor-pointer"
            >
              Agregar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
