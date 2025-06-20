import { useState, useEffect } from 'react';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency } from '../utils/formatters';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
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
      // Reset form if no budget for the month
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
      // Discretionary spend is calculated, not set by user
      discretionary_spend: (parseFloat(income) || 0) - ((parseFloat(fixedExpenses) || 0) + (parseFloat(variableExpenses) || 0) + (parseFloat(savingsGoal) || 0)),
    };
    saveBudget(budgetData);
  };

  const totalExpenses = (parseFloat(fixedExpenses) || 0) + (parseFloat(variableExpenses) || 0);
  const remaining = (parseFloat(income) || 0) - totalExpenses - (parseFloat(savingsGoal) || 0);

  const chartData = {
    labels: ['Fixed Expenses', 'Variable Expenses', 'Savings Goal', 'Remaining'],
    datasets: [{
      data: [
        parseFloat(fixedExpenses) || 0,
        parseFloat(variableExpenses) || 0,
        parseFloat(savingsGoal) || 0,
        Math.max(0, remaining) // Don't show negative values in chart
      ],
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
      hoverBackgroundColor: ['#DC2626', '#D97706', '#059669', '#2563EB'],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    }]
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monthly Budget</h1>
          <p className="text-gray-500">Manage your budget for {new Date(currentMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}.</p>
        </div>
      </div>

      {loading && <p>Loading budget...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <BudgetInput label="Monthly Income" value={income} onChange={setIncome} />
              <BudgetInput label="Fixed Expenses" value={fixedExpenses} onChange={setFixedExpenses} />
              <BudgetInput label="Variable Expenses" value={variableExpenses} onChange={setVariableExpenses} />
              <BudgetInput label="Savings Goal" value={savingsGoal} onChange={setSavingsGoal} />
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-center">Budget Breakdown</h3>
              <div className="w-full max-w-xs mx-auto">
                <Doughnut data={chartData} />
              </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-bold">Discretionary Spend</h3>
                <p className={`text-4xl font-bold mt-2 ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {formatCurrency(remaining)}
                </p>
                <p className="text-sm text-gray-500 mt-1">left for the month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const BudgetInput = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
        <span className="text-gray-500 sm:text-sm">$</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 pl-7 pr-2 focus:border-indigo-500 focus:ring-indigo-500"
        placeholder="0.00"
      />
    </div>
  </div>
);
