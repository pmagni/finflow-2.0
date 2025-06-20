import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';

export const useDebts = () => {
  const { user } = useAuth();
  const { debtState, fetchDebts } = useStore(state => ({
    debtState: state.debtState,
    fetchDebts: state.debtState.fetchDebts,
  }));

  useEffect(() => {
    if (user) {
      fetchDebts();
    }
  }, [user, fetchDebts]);

  return debtState;
}; 