import { useStore } from '../store/useStore';

export const useGamification = () => {
  const {
    achievements,
    score,
    events,
    pointsTotal,
    activityStreak,
    loading,
    error,
    fetchGamificationData,
  } = useStore((state) => state.gamificationState);

  return {
    achievements,
    score,
    events,
    pointsTotal,
    activityStreak,
    loading,
    error,
    fetchGamificationData,
  };
}; 