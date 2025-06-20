import type { SavingsGoal } from '../types';
import SavingsGoalListItem from './SavingsGoalListItem';

interface SavingsGoalListProps {
  goals: SavingsGoal[];
}

export default function SavingsGoalList({ goals }: SavingsGoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-medium">No Savings Goals Yet</h3>
        <p className="text-gray-500 mt-2">Ready to save? Set your first goal to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <SavingsGoalListItem key={goal.id} goal={goal} />
      ))}
    </div>
  );
} 