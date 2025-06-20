import { useStore } from '../store/useStore';

export const useGamification = () => {
  const { 
    achievements, 
    score, 
    loading, 
    error, 
    fetchGamificationData 
  } = useStore(state => state.gamificationState);

  return {
    achievements,
    score,
    loading,
    error,
    fetchGamificationData,
  };
}; 