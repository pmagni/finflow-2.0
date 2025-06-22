import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';

export const useDebts = () => {
  const { user } = useAuth();
  const { debtState, actions } = useStore(state => ({
    debtState: state.debtState,
    actions: state.debtState.actions,
  }));

  useEffect(() => {
    if (user) {
      actions.fetchDebts();
    }
  }, [user, actions]);

  return debtState;
}; 