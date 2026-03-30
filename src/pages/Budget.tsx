import { useState, useEffect, useMemo, useCallback } from 'react';
import { useBudget } from '../hooks/useBudget';
import { gamificationApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/Card';
import {
  DollarSign,
  Loader2,
  Save,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ShoppingBag,
  CreditCard,
  Sparkles,
} from 'lucide-react';

function getFormattedCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function Budget() {
  const [currentMonth] = useState(getFormattedCurrentMonth());
  const { budget, loading, error, saveBudget } = useBudget(currentMonth);
  const [saving, setSaving] = useState(false);

  const [income, setIncome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState('');
  const [variableExpenses, setVariableExpenses] = useState('');
  const [debtPayment, setDebtPayment] = useState('');
  const [leisure, setLeisure] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');

  useEffect(() => {
    if (budget) {
      setIncome(String(budget.income || ''));
      setFixedExpenses(String(budget.fixed_expenses || ''));
      setVariableExpenses(String(budget.variable_expenses || ''));
      setSavingsGoal(String(budget.savings_goal || ''));
      setDebtPayment(String(budget.debt_payment_allocation ?? ''));
      setLeisure(String(budget.leisure_allocation ?? ''));
    }
  }, [budget]);

  const totals = useMemo(() => {
    const inc = parseFloat(income) || 0;
    const fixed = parseFloat(fixedExpenses) || 0;
    const variable = parseFloat(variableExpenses) || 0;
    const debt = parseFloat(debtPayment) || 0;
    const leis = parseFloat(leisure) || 0;
    const savings = parseFloat(savingsGoal) || 0;
    const committed = fixed + variable + debt + leis + savings;
    const remaining = inc - committed;
    return { inc, fixed, variable, debt, leis, savings, committed, remaining };
  }, [income, fixedExpenses, variableExpenses, debtPayment, leisure, savingsGoal]);

  const apply502020 = useCallback(() => {
    const inc = parseFloat(income) || 0;
    if (inc <= 0) return;
    setFixedExpenses((inc * 0.5).toFixed(2));
    setVariableExpenses((inc * 0.15).toFixed(2));
    setLeisure((inc * 0.15).toFixed(2));
    setSavingsGoal((inc * 0.2).toFixed(2));
    setDebtPayment('0');
  }, [income]);

  const categories = [
    { label: 'Gastos Fijos', value: totals.fixed, color: 'bg-danger-500', textColor: 'text-danger-600' },
    { label: 'Gastos Variables', value: totals.variable, color: 'bg-warning-500', textColor: 'text-warning-600' },
    { label: 'Pago a Deudas', value: totals.debt, color: 'bg-accent-500', textColor: 'text-accent-600' },
    { label: 'Ocio / Deseos', value: totals.leis, color: 'bg-primary-400', textColor: 'text-primary-600' },
    { label: 'Meta de Ahorro', value: totals.savings, color: 'bg-success-500', textColor: 'text-success-600' },
    { label: 'Disponible', value: Math.max(0, totals.remaining), color: 'bg-primary-500', textColor: 'text-primary-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await saveBudget({
      month: currentMonth,
      income: totals.inc,
      fixed_expenses: totals.fixed,
      variable_expenses: totals.variable,
      savings_goal: totals.savings,
      discretionary_spend: totals.remaining,
      debt_payment_allocation: totals.debt,
      leisure_allocation: totals.leis,
    });
    if (saved) {
      void gamificationApi.logEvent('budget_saved', 55, { month: currentMonth });
    }
    setSaving(false);
  };

  const monthLabel = new Date(currentMonth + '-02').toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-xs font-medium text-surface-500">Ingresos</span>
          </div>
          <p className="text-xl font-bold text-surface-900 tabular-nums">{formatCurrency(totals.inc)}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-danger-600" />
            <span className="text-xs font-medium text-surface-500">Comprometido</span>
          </div>
          <p className="text-xl font-bold text-surface-900 tabular-nums">{formatCurrency(totals.committed)}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <PiggyBank className="w-4 h-4 text-success-600" />
            <span className="text-xs font-medium text-surface-500">Ahorro</span>
          </div>
          <p className="text-xl font-bold text-surface-900 tabular-nums">{formatCurrency(totals.savings)}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-medium text-surface-500">Disponible</span>
          </div>
          <p className={`text-xl font-bold tabular-nums ${totals.remaining < 0 ? 'text-danger-600' : 'text-surface-900'}`}>
            {formatCurrency(totals.remaining)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card title="Configurar Presupuesto" subtitle={monthLabel}>
            <div className="rounded-lg bg-primary-50 border border-primary-100 p-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <p className="text-xs text-primary-800 leading-relaxed">
                  <span className="font-semibold">Sugerencia 50/15/15/20:</span> aproximación de la regla 50/30/20
                  (necesidades / variable+ocio / ahorro). Ajusta según tu realidad.
                </p>
              </div>
              <button
                type="button"
                onClick={apply502020}
                disabled={!totals.inc}
                className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 disabled:opacity-50 cursor-pointer"
              >
                Aplicar sugerencia
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <BudgetInput label="Ingresos Mensuales" value={income} onChange={setIncome} />
              <BudgetInput label="Gastos Fijos" value={fixedExpenses} onChange={setFixedExpenses} hint="Renta, servicios, seguros, etc." />
              <BudgetInput label="Gastos Variables" value={variableExpenses} onChange={setVariableExpenses} hint="Comida, transporte, etc." />
              <BudgetInput
                label="Asignación mensual a deudas"
                value={debtPayment}
                onChange={setDebtPayment}
                icon={CreditCard}
                hint="Monto extra dedicado a capital de deudas (además de mínimos)."
              />
              <BudgetInput label="Ocio / gastos discrecionales" value={leisure} onChange={setLeisure} hint="Entretenimiento, salidas, suscripciones opcionales." />
              <BudgetInput label="Meta de Ahorro" value={savingsGoal} onChange={setSavingsGoal} />

              <button
                type="submit"
                disabled={saving}
                className="w-full h-11 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Presupuesto
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card title="Distribución">
            {totals.inc > 0 ? (
              <div className="space-y-4">
                <div className="flex h-6 rounded-full overflow-hidden bg-surface-100">
                  {categories.map((cat) => {
                    const pct = totals.inc > 0 ? (cat.value / totals.inc) * 100 : 0;
                    if (pct <= 0) return null;
                    return (
                      <div
                        key={cat.label}
                        className={`${cat.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                        title={`${cat.label}: ${pct.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {categories.map((cat) => {
                    const pct = totals.inc > 0 ? (cat.value / totals.inc) * 100 : 0;
                    return (
                      <div key={cat.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                          <span className="text-sm text-surface-700">{cat.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-surface-900 tabular-nums">
                            {formatCurrency(cat.value)}
                          </span>
                          <span className={`text-xs font-medium ${cat.textColor} tabular-nums w-12 text-right`}>
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-surface-500 text-center py-8">
                Ingresa tus ingresos para ver la distribución.
              </p>
            )}
          </Card>

          <div
            className={`rounded-xl border-2 p-5 text-center ${
              totals.remaining < 0 ? 'bg-danger-50 border-danger-200' : 'bg-success-50 border-success-200'
            }`}
          >
            <p className="text-sm font-medium text-surface-600">
              {totals.remaining < 0 ? 'Excediste tu presupuesto' : 'Dinero disponible'}
            </p>
            <p
              className={`mt-1 text-3xl font-bold tabular-nums ${
                totals.remaining < 0 ? 'text-danger-700' : 'text-success-700'
              }`}
            >
              {formatCurrency(totals.remaining)}
            </p>
            <p className="mt-1 text-xs text-surface-500">restante para el mes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetInput({
  label,
  value,
  onChange,
  hint,
  icon: Icon = DollarSign,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  icon?: typeof DollarSign;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-9 pr-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="0.00"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-surface-500">{hint}</p>}
    </div>
  );
}
