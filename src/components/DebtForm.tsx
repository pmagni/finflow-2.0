import { useState, useEffect } from 'react';
import type { Debt } from '../types';

interface DebtFormProps {
  debtToEdit?: Debt;
  onSubmit: (debt: Omit<Debt, 'id' | 'user_id' | 'created_at'>) => void;
  onClose: () => void;
}

export default function DebtForm({ debtToEdit, onSubmit, onClose }: DebtFormProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');

  useEffect(() => {
    if (debtToEdit) {
      setName(debtToEdit.name);
      setBalance(String(debtToEdit.balance));
      setInterestRate(String(debtToEdit.interest_rate || ''));
      setMinimumPayment(String(debtToEdit.minimum_payment || ''));
    }
  }, [debtToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      balance: parseFloat(balance),
      interest_rate: parseFloat(interestRate) / 100, // Convert percentage to decimal
      minimum_payment: parseFloat(minimumPayment),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{debtToEdit ? 'Edit Debt' : 'Add New Debt'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Debt Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700">Current Balance ($)</label>
            <input
              type="number"
              id="balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="minimumPayment" className="block text-sm font-medium text-gray-700">Minimum Monthly Payment ($)</label>
            <input
              type="number"
              id="minimumPayment"
              value={minimumPayment}
              onChange={(e) => setMinimumPayment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {debtToEdit ? 'Save Changes' : 'Add Debt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
