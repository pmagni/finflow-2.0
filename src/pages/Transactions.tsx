import { useEffect, useState } from 'react';
import { transactionsApi } from '../services/api';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/Card';
import { Loader2, Plus, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function Transactions() {
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await transactionsApi.getTransactions();
    if (err) setError(err);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { data, error: err } = await transactionsApi.createTransaction({
      category: category.trim() || 'General',
      amount: parseFloat(amount) || 0,
      description: description.trim() || undefined,
      transaction_date: date,
      type,
    });
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    if (data) setRows((prev) => [data, ...prev]);
    setAmount('');
    setDescription('');
    setCategory('');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-surface-900">Transacciones manuales</h2>
        <p className="mt-1 text-sm text-surface-500">
          Registra ingresos o gastos puntuales. Útil si aún no sincronizas cuentas bancarias.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-danger-50 border border-danger-200 p-3.5 text-sm text-danger-700">
          {error}
        </div>
      )}

      <Card title="Nueva transacción">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-surface-600 mb-1">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 h-10 rounded-lg border text-sm font-medium cursor-pointer ${
                  type === 'expense'
                    ? 'border-danger-500 bg-danger-50 text-danger-800'
                    : 'border-surface-200 text-surface-600'
                }`}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 h-10 rounded-lg border text-sm font-medium cursor-pointer ${
                  type === 'income'
                    ? 'border-success-500 bg-success-50 text-success-800'
                    : 'border-surface-200 text-surface-600'
                }`}
              >
                Ingreso
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Categoría</label>
            <input
              className="w-full h-10 px-3 rounded-lg border border-surface-300 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Comida, servicios…"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Monto</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              className="w-full h-10 px-3 rounded-lg border border-surface-300 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Fecha</label>
            <input
              type="date"
              required
              className="w-full h-10 px-3 rounded-lg border border-surface-300 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-surface-600 mb-1">Nota</label>
            <input
              className="w-full h-10 px-3 rounded-lg border border-surface-300 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-primary-600 text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Guardar
            </button>
          </div>
        </form>
      </Card>

      <Card title="Historial">
        {rows.length === 0 ? (
          <p className="text-sm text-surface-500">Sin movimientos registrados.</p>
        ) : (
          <ul className="divide-y divide-surface-100">
            {rows.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
                    t.type === 'income' ? 'bg-success-50' : 'bg-danger-50'
                  }`}
                >
                  {t.type === 'income' ? (
                    <ArrowUpCircle className="w-4.5 h-4.5 text-success-600" />
                  ) : (
                    <ArrowDownCircle className="w-4.5 h-4.5 text-danger-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900">{t.category}</p>
                  <p className="text-xs text-surface-500 truncate">{t.description || t.transaction_date}</p>
                </div>
                <p
                  className={`text-sm font-bold tabular-nums shrink-0 ${
                    t.type === 'income' ? 'text-success-700' : 'text-danger-700'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
