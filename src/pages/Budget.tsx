import { useState, useEffect } from 'react';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency } from '../utils/formatters';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Card from '../components/Card';
import 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

function getFormattedCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function Budget() {
  const [currentMonth] = useState(getFormattedCurrentMonth());
  const { budget, loading, error, saveBudget } = useBudget(currentMonth);

  const [income, setIncome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState('');
  const [variableExpenses, setVariableExpenses] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');

  useEffect(() => {
    if (budget) {
      setIncome(String(budget.income || ''));
      setFixedExpenses(String(budget.fixed_expenses || ''));
      setVariableExpenses(String(budget.variable_expenses || ''));
      setSavingsGoal(String(budget.savings_goal || ''));
    } else {
      setIncome('');
      setFixedExpenses('');
      setVariableExpenses('');
      setSavingsGoal('');
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetData = {
      month: currentMonth,
      income: parseFloat(income) || 0,
      fixed_expenses: parseFloat(fixedExpenses) || 0,
      variable_expenses: parseFloat(variableExpenses) || 0,
      savings_goal: parseFloat(savingsGoal) || 0,
      discretionary_spend: (parseFloat(income) || 0) - ((parseFloat(fixedExpenses) || 0) + (parseFloat(variableExpenses) || 0) + (parseFloat(savingsGoal) || 0)),
    };
    saveBudget(budgetData);
  };

  const totalExpenses = (parseFloat(fixedExpenses) || 0) + (parseFloat(variableExpenses) || 0);
  const remaining = (parseFloat(income) || 0) - totalExpenses - (parseFloat(savingsGoal) || 0);

  const chartData = {
    labels: ['Gastos Fijos', 'Gastos Variables', 'Meta de Ahorro', 'Restante'],
    datasets: [{
      data: [
        parseFloat(fixedExpenses) || 0,
        parseFloat(variableExpenses) || 0,
        parseFloat(savingsGoal) || 0,
        Math.max(0, remaining)
      ],
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
      hoverBackgroundColor: ['#DC2626', '#D97706', '#059669', '#2563EB'],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    }]
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Presupuesto Mensual</h1>
          <p>Gestiona tu presupuesto para {new Date(currentMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}.</p>
        </div>
      </div>

      {loading && <p>Cargando presupuesto...</p>}
      {error && <p style={{ color: '#ef4444' }}>Error: {error}</p>}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <Card title="Configurar Presupuesto">
            <form onSubmit={handleSubmit} className="some-component">
              <BudgetInput label="Ingresos Mensuales" value={income} onChange={setIncome} />
              <BudgetInput label="Gastos Fijos" value={fixedExpenses} onChange={setFixedExpenses} />
              <BudgetInput label="Gastos Variables" value={variableExpenses} onChange={setVariableExpenses} />
              <BudgetInput label="Meta de Ahorro" value={savingsGoal} onChange={setSavingsGoal} />
              <div style={{ paddingTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Guardar Presupuesto
                </button>
              </div>
            </form>
          </Card>

          <div className="flex flex-col gap-4">
            <Card title="Distribución del Presupuesto">
              <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                <Doughnut data={chartData} />
              </div>
            </Card>
            
            <Card title="Dinero Disponible">
              <div className="text-center">
                <p style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  margin: '0.5rem 0',
                  color: remaining < 0 ? '#ef4444' : '#10b981'
                }}>
                  {formatCurrency(remaining)}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                  restante para el mes
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

const BudgetInput = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <div style={{ position: 'relative' }}>
      <span style={{ 
        position: 'absolute', 
        left: '0.75rem', 
        top: '50%', 
        transform: 'translateY(-50%)',
        color: '#6b7280',
        pointerEvents: 'none'
      }}>$</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
        style={{ paddingLeft: '2rem' }}
        placeholder="0.00"
      />
    </div>
  </div>
);