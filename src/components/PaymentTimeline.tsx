import type { StrategyResult, AmortizationEntry } from '../hooks/useDebtStrategy';
import { formatCurrency } from '../utils/formatters';

interface PaymentTimelineProps {
  result: StrategyResult;
}

const ResultCard = ({ title, value, subtext }: { title: string, value: string, subtext?: string }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
    {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
  </div>
);

export default function PaymentTimeline({ result }: PaymentTimelineProps) {
  const { timeline, totalInterestPaid, totalMonths, payoffDate } = result;

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-bold">Your Payoff Plan</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ResultCard
          title="Payoff Date"
          value={payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          subtext={`in ${totalMonths} months`}
        />
        <ResultCard
          title="Total Interest"
          value={formatCurrency(totalInterestPaid)}
          subtext="you will pay"
        />
        <ResultCard
          title="Total Payments"
          value={formatCurrency(timeline.reduce((acc: number, t: AmortizationEntry) => acc + t.totalPayment, 0))}
          subtext="over the life of the loan"
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-bold mb-4">Amortization Schedule</h4>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-2">Month</th>
                <th className="p-2">Total Payment</th>
                <th className="p-2">Principal Paid</th>
                <th className="p-2">Interest Paid</th>
                <th className="p-2">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((entry: AmortizationEntry) => (
                <tr key={entry.month} className="border-b hover:bg-gray-50">
                  <td className="p-2">{entry.month}</td>
                  <td className="p-2">{formatCurrency(entry.totalPayment)}</td>
                  <td className="p-2 text-green-600">{formatCurrency(entry.principalPaid)}</td>
                  <td className="p-2 text-red-600">{formatCurrency(entry.interestPaid)}</td>
                  <td className="p-2 font-medium">{formatCurrency(entry.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 