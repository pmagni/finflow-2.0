import React, { useEffect, useRef, useState } from 'react';
import type { SavingsGoal } from '../types';
import { formatCurrency } from '../utils/formatters';
import { animate } from 'animejs';
import { useStore } from '../store/useStore';
import { Edit, Trash2 } from 'lucide-react';
import SavingsGoalForm from './SavingsGoalForm';

export const SavingsGoalListItem: React.FC<{ goal: SavingsGoal }> = ({ goal }) => {
  const { addFunds, deleteGoal, updateGoal } = useStore(state => state.savingsGoalState);
  const [isEditing, setIsEditing] = useState(false);
  
  const progressPercentage = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate progress bar on initial render and when percentage changes
    if (progressBarRef.current) {
      animate(progressBarRef.current, {
        width: `${progressPercentage}%`,
        duration: 1200,
        easing: 'easeInOutQuart',
      });
    }
  }, [progressPercentage]);
  
  const handleAddFunds = () => {
    const amountStr = prompt('Enter amount to add:', '100');
    if (amountStr) {
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        addFunds(goal.id, amount);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the goal "${goal.name}"?`)) {
      deleteGoal(goal.id);
    }
  };
  
  if (isEditing) {
    return <SavingsGoalForm 
      onSubmit={(updatedGoal) => {
        updateGoal(goal.id, updatedGoal);
        setIsEditing(false);
      }} 
      onClose={() => setIsEditing(false)}
      goalToEdit={goal} 
    />;
  }

  return (
    <li className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{goal.name}</h3>
          <p className="text-sm text-green-400">
            Target: {formatCurrency(goal.target_amount)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            ref={progressBarRef}
            className="bg-green-500 h-4 rounded-full"
            style={{ width: '0%' }} // Start at 0% for animation
          ></div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-400 mt-1">
          <span>{formatCurrency(goal.current_amount)}</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
      </div>
      
      <div className="flex justify-end pt-2">
        <button
          onClick={handleAddFunds}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
        >
          Add Funds
        </button>
      </div>
    </li>
  );
}; 