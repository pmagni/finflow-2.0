import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useDebts } from '../hooks/useDebts';
import { useDebtStrategy } from '../hooks/useDebtStrategy';
import { useBudget } from '../hooks/useBudget';
import { debtPlansApi } from '../services/api';
import { computeDebtPayoff } from '../utils/debtStrategy';
import type { Debt } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import {
  Plus,
  CreditCard,
  Trash2,
  Pencil,
  Calculator,
  CalendarDays,
  DollarSign,
  Loader2,
  TrendingDown,
  Zap,
  Snowflake,
  Save,
} from 'lucide-react';

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function DebtPlanner() {
  const { debts, loading: debtsLoading, error: debtsError } = useDebts();
  const { addDebt, updateDebt, deleteDebt } = useStore((s) => s.debtState.actions);
  const { calculate, result, loading: strategyLoading, error: strategyError } = useDebtStrategy();
  const { budget } = useBudget(currentMonthKey());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [planMessage, setPlanMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);

  const [formName, setFormName] = useState('');
  const [formInstitution, setFormInstitution] = useState('');
  const [formTermMonths, setFormTermMonths] = useState('');
  const [formBalance, setFormBalance] = useState('');
  const [formRate, setFormRate] = useState('');
  const [formMinPayment, setFormMinPayment] = useState('');

  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('avalanche');
  const [extraPayment, setExtraPayment] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await debtPlansApi.getCurrentDebtPlan();
      if (cancelled || error || !data) return;
      setStrategy(data.payment_strategy);
      setExtraPayment(String(data.extra_monthly_payment ?? 0));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const minimumOnlyResult = useMemo(() => {
    if (!result || debts.length === 0) return null;
    const r = computeDebtPayoff(debts, 0, strategy);
    return r.ok ? r.result : null;
  }, [debts, result, strategy]);

  const openAddModal = () => {
    setEditingDebt(null);
    setFormName('');
    setFormInstitution('');
    setFormTermMonths('');
    setFormBalance('');
    setFormRate('');
    setFormMinPayment('');
    setIsModalOpen(true);
  };

  const openEditModal = (debt: Debt) => {
    setEditingDebt(debt);
    setFormName(debt.name);
    setFormInstitution(debt.institution ?? '');
    setFormTermMonths(debt.term_months != null ? String(debt.term_months) : '');
    setFormBalance(String(debt.balance));
    setFormRate(String((debt.interest_rate || 0) * 100));
    setFormMinPayment(String(debt.minimum_payment || ''));
    setIsModalOpen(true);
  };

  const handleSubmitDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = parseInt(formTermMonths, 10);
    const data: Omit<Debt, 'id' | 'user_id' | 'created_at'> = {
      name: formName,
      balance: parseFloat(formBalance) || 0,
      interest_rate: (parseFloat(formRate) || 0) / 100,
      minimum_payment: parseFloat(formMinPayment) || 0,
      institution: formInstitution.trim() || null,
      term_months: Number.isFinite(term) && term > 0 ? term : null,
    };

    if (editingDebt) {
      await updateDebt(editingDebt.id, data);
    } else {
      await addDebt(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDebt(id);
  };

  const handleCalculate = () => {
    if (debts.length > 0) {
      calculate(debts, parseFloat(extraPayment) || 0, strategy);
    }
  };

  const handleSavePlan = async () => {
    setPlanMessage(null);
    setSavingPlan(true);
    const { error } = await debtPlansApi.saveActiveDebtPlan({
      name: 'Plan principal',
      monthly_income: budget?.income ?? 0,
      budget_percentage: 20,
      payment_strategy: strategy,
      extra_monthly_payment: parseFloat(extraPayment) || 0,
    });
    setSavingPlan(false);
    if (error) setPlanMessage({ type: 'err', text: error });
    else setPlanMessage({ type: 'ok', text: 'Preferencias de plan guardadas.' });
  };

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const avgRate = debts.length > 0 ? debts.reduce((s, d) => s + (d.interest_rate || 0), 0) / debts.length : 0;
  const totalMinPayment = debts.reduce((s, d) => s + (d.minimum_payment || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
          <p className="text-sm font-medium text-surface-500">Deuda Total</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 tabular-nums">{formatCurrency(totalDebt)}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
          <p className="text-sm font-medium text-surface-500">Tasa Promedio</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 tabular-nums">{formatPercent(avgRate)}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
          <p className="text-sm font-medium text-surface-500">Pago Mínimo Mensual</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 tabular-nums">{formatCurrency(totalMinPayment)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Debts list */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Mis Deudas"
            subtitle={`${debts.length} deuda${debts.length !== 1 ? 's' : ''} registrada${debts.length !== 1 ? 's' : ''}`}
            action={
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            }
          >
            {debtsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
              </div>
            ) : debtsError ? (
              <p className="text-sm text-danger-600">Error: {debtsError}</p>
            ) : debts.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="Sin deudas registradas"
                description="Agrega tus deudas para crear un plan de pago personalizado."
                action={
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar primera deuda
                  </button>
                }
              />
            ) : (
              <div className="space-y-3">
                {debts.map((debt) => (
                  <div
                    key={debt.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-surface-200 hover:border-surface-300 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-danger-50 shrink-0">
                      <CreditCard className="w-5 h-5 text-danger-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900 truncate">{debt.name}</p>
                      <p className="text-xs text-surface-500">
                        {debt.institution ? `${debt.institution} · ` : ''}
                        {debt.term_months ? `${debt.term_months} meses · ` : ''}
                        Tasa: {formatPercent(debt.interest_rate)} · Pago min: {formatCurrency(debt.minimum_payment)}
                      </p>
                    </div>
                    <p className="text-base font-bold text-surface-900 tabular-nums shrink-0">
                      {formatCurrency(debt.balance)}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(debt)}
                        className="p-2 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors cursor-pointer"
                        aria-label="Editar deuda"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="p-2 rounded-lg text-surface-400 hover:bg-danger-50 hover:text-danger-600 transition-colors cursor-pointer"
                        aria-label="Eliminar deuda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Strategy calculator */}
        <div className="space-y-4">
          <Card title="Calculadora de Estrategia">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Estrategia</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStrategy('avalanche')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${
                      strategy === 'avalanche'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-surface-200 text-surface-600 hover:border-surface-300'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                    Avalancha
                  </button>
                  <button
                    onClick={() => setStrategy('snowball')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${
                      strategy === 'snowball'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-surface-200 text-surface-600 hover:border-surface-300'
                    }`}
                  >
                    <Snowflake className="w-5 h-5" />
                    Bola de Nieve
                  </button>
                </div>
                <p className="mt-2 text-xs text-surface-500">
                  {strategy === 'avalanche'
                    ? 'Prioriza la deuda con mayor tasa de interés. Ahorra más en intereses.'
                    : 'Prioriza la deuda con menor balance. Más motivador al ver resultados rápidos.'}
                </p>
              </div>

              <div>
                <label htmlFor="extra" className="block text-sm font-medium text-surface-700 mb-1.5">
                  Pago extra mensual
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                  <input
                    id="extra"
                    type="number"
                    min="0"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(e.target.value)}
                    className="w-full h-11 pl-9 pr-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={debts.length === 0 || strategyLoading}
                className="w-full h-11 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                {strategyLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Calculator className="w-4 h-4" />
                )}
                Calcular Plan
              </button>

              <button
                type="button"
                onClick={handleSavePlan}
                disabled={savingPlan}
                className="w-full h-11 rounded-lg border-2 border-primary-600 text-primary-700 text-sm font-semibold hover:bg-primary-50 disabled:opacity-50 cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                {savingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar preferencias del plan
              </button>
              {planMessage && (
                <p
                  className={`text-xs ${planMessage.type === 'ok' ? 'text-success-700' : 'text-danger-600'}`}
                >
                  {planMessage.text}
                </p>
              )}
            </div>

            {strategyError && (
              <p className="mt-3 text-sm text-danger-600">{strategyError}</p>
            )}
          </Card>

          {/* Results */}
          {result && (
            <Card title="Resultados">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface-50">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays className="w-4 h-4 text-primary-600" />
                      <span className="text-xs font-medium text-surface-500">Meses</span>
                    </div>
                    <p className="text-lg font-bold text-surface-900 tabular-nums">{result.totalMonths}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-50">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4 text-danger-600" />
                      <span className="text-xs font-medium text-surface-500">Intereses</span>
                    </div>
                    <p className="text-lg font-bold text-surface-900 tabular-nums">
                      {formatCurrency(result.totalInterestPaid)}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-success-50 border border-success-200">
                  <p className="text-xs font-medium text-success-700">Fecha estimada de libertad</p>
                  <p className="mt-0.5 text-base font-bold text-success-800">
                    {result.payoffDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Mini timeline */}
                {result.timeline.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-2">Progreso de balance</p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
                      {result.timeline
                        .filter((_, i) => i % Math.max(1, Math.floor(result.timeline.length / 12)) === 0 || i === result.timeline.length - 1)
                        .map((entry) => (
                          <div key={entry.month} className="flex items-center gap-2">
                            <span className="text-xs text-surface-500 w-12 shrink-0 tabular-nums">
                              Mes {entry.month}
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-surface-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary-500 transition-all"
                                style={{
                                  width: `${Math.max(2, ((totalDebt - entry.balance) / totalDebt) * 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-surface-600 w-20 text-right shrink-0 tabular-nums">
                              {formatCurrency(entry.balance)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {minimumOnlyResult && (
                  <div className="mt-4 p-4 rounded-lg border border-surface-200 bg-surface-50 space-y-3">
                    <p className="text-sm font-semibold text-surface-800">Comparación: solo pagos mínimos</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-surface-500">Escenario mínimos</p>
                        <p className="font-medium tabular-nums">
                          {minimumOnlyResult.totalMonths} meses · {formatCurrency(minimumOnlyResult.totalInterestPaid)}{' '}
                          intereses
                        </p>
                      </div>
                      <div>
                        <p className="text-surface-500">Tu plan actual</p>
                        <p className="font-medium tabular-nums">
                          {result.totalMonths} meses · {formatCurrency(result.totalInterestPaid)} intereses
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-success-700">
                      Ahorro estimado en intereses:{' '}
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(
                          Math.max(0, minimumOnlyResult.totalInterestPaid - result.totalInterestPaid),
                        )}
                      </span>
                      · Meses que podrías ganar:{' '}
                      <span className="font-semibold tabular-nums">
                        {Math.max(0, minimumOnlyResult.totalMonths - result.totalMonths)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDebt ? 'Editar Deuda' : 'Agregar Deuda'}
      >
        <form onSubmit={handleSubmitDebt} className="space-y-4">
          <div>
            <label htmlFor="debtName" className="block text-sm font-medium text-surface-700 mb-1.5">
              Nombre
            </label>
            <input
              id="debtName"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Ej: Tarjeta Visa"
            />
          </div>
          <div>
            <label htmlFor="debtInstitution" className="block text-sm font-medium text-surface-700 mb-1.5">
              Institución (opcional)
            </label>
            <input
              id="debtInstitution"
              type="text"
              value={formInstitution}
              onChange={(e) => setFormInstitution(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Banco o acreedor"
            />
          </div>
          <div>
            <label htmlFor="debtTerm" className="block text-sm font-medium text-surface-700 mb-1.5">
              Plazo restante (meses, opcional)
            </label>
            <input
              id="debtTerm"
              type="number"
              min={1}
              value={formTermMonths}
              onChange={(e) => setFormTermMonths(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Ej: 24"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="debtBalance" className="block text-sm font-medium text-surface-700 mb-1.5">
                Balance
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                <input
                  id="debtBalance"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formBalance}
                  onChange={(e) => setFormBalance(e.target.value)}
                  className="w-full h-11 pl-9 pr-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label htmlFor="debtRate" className="block text-sm font-medium text-surface-700 mb-1.5">
                Tasa de Interés (%)
              </label>
              <input
                id="debtRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formRate}
                onChange={(e) => setFormRate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="18.00"
              />
            </div>
          </div>
          <div>
            <label htmlFor="debtMinPayment" className="block text-sm font-medium text-surface-700 mb-1.5">
              Pago Mínimo Mensual
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              <input
                id="debtMinPayment"
                type="number"
                min="0"
                step="0.01"
                value={formMinPayment}
                onChange={(e) => setFormMinPayment(e.target.value)}
                className="w-full h-11 pl-9 pr-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="0.00"
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
              {editingDebt ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
