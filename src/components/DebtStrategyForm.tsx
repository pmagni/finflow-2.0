import { useState } from 'react';

type Strategy = 'snowball' | 'avalanche';

interface DebtStrategyFormProps {
  onSubmit: (extraPayment: number, strategy: Strategy) => void;
  loading: boolean;
}

export default function DebtStrategyForm({ onSubmit, loading }: DebtStrategyFormProps) {
  const [extraPayment, setExtraPayment] = useState('');
  const [strategy, setStrategy] = useState<Strategy>('avalanche');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(parseFloat(extraPayment) || 0, strategy);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Create a Payment Plan</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="extraPayment" className="block text-sm font-medium text-gray-700">
            Extra Monthly Payment ($)
          </label>
          <input
            type="number"
            id="extraPayment"
            value={extraPayment}
            onChange={(e) => setExtraPayment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-gray-500">
            The amount you can pay in addition to your minimum payments.
          </p>
        </div>
        
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            Payment Strategy
          </legend>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`p-4 border rounded-lg cursor-pointer text-center ${strategy === 'avalanche' ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}
            >
              <input
                type="radio"
                name="strategy"
                value="avalanche"
                checked={strategy === 'avalanche'}
                onChange={() => setStrategy('avalanche')}
                className="sr-only"
              />
              <span className="font-bold">Avalanche</span>
              <p className="text-xs text-gray-500 mt-1">Pay off highest interest rate first. Saves more money.</p>
            </label>
            <label
              className={`p-4 border rounded-lg cursor-pointer text-center ${strategy === 'snowball' ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}
            >
              <input
                type="radio"
                name="strategy"
                value="snowball"
                checked={strategy === 'snowball'}
                onChange={() => setStrategy('snowball')}
                className="sr-only"
              />
              <span className="font-bold">Snowball</span>
              <p className="text-xs text-gray-500 mt-1">Pay off smallest balance first. Quicker wins.</p>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:bg-indigo-300"
        >
          {loading ? 'Calculating...' : 'Generate Plan'}
        </button>
      </form>
    </div>
  );
} 