import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';

export const useSavingsGoals = () => {
  const { user } = useAuth();
  const { savingsGoalState, fetchGoals } = useStore(state => ({
    savingsGoalState: state.savingsGoalState,
    fetchGoals: state.savingsGoalState.fetchGoals,
  }));

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, fetchGoals]);

  return savingsGoalState;
}; 