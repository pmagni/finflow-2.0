import React, { useEffect, useRef } from 'react';
import { useGamification } from '../hooks/useGamification';
import Card from '../components/Card';
import type { Achievement } from '../types';
import { animate } from 'animejs';

const AchievementIcon: React.FC<{ name: string }> = ({ name }) => {
  // Simple icon mapping for demonstration
  const iconMap: { [key: string]: string } = {
    'First Debt Paid Off': '🏆',
    'Savings Goal Reached': '🎯',
    'Consistent Budgeting': '📅',
    'Emergency Fund Created': '🛡️',
  };
  return <span className="text-4xl mr-4">{iconMap[name] || '🎖️'}</span>;
};

const AchievementItem: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
  <li className="flex items-center bg-gray-800 p-4 rounded-lg">
    <AchievementIcon name={achievement.title} />
    <div>
      <h3 className="font-bold text-white">{achievement.title}</h3>
      <p className="text-gray-400">{achievement.description}</p>
      <p className="text-xs text-gray-500 mt-1">
        Achieved on: {new Date(achievement.achieved_at).toLocaleDateString()}
      </p>
    </div>
  </li>
);

const FinancialHealthScore: React.FC<{ score: number | null }> = ({ score }) => {
  const scoreRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (score !== null && scoreRef.current) {
      const scoreAnimation = { value: 0 };
      animate(scoreAnimation, {
        value: score,
        round: 1,
        duration: 1500,
        easing: 'easeOutCubic',
        update: () => {
          if (scoreRef.current) {
            scoreRef.current.textContent = String(scoreAnimation.value);
          }
        },
      });
    }
  }, [score]);

  return (
    <Card className="text-center">
      <h2 className="text-2xl font-bold mb-2 text-white">Financial Health Score</h2>
      {score !== null ? (
        <p ref={scoreRef} className="text-5xl font-extrabold text-green-400">{score}</p>
      ) : (
        <p className="text-gray-400">No score calculated yet.</p>
      )}
      <p className="text-sm text-gray-500 mt-2">
        This score reflects your overall financial well-being, based on your budget, savings, and debt.
      </p>
    </Card>
  );
};

export const Profile: React.FC = () => {
  const { achievements, score, loading, error, fetchGamificationData } = useGamification();

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading your profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-4">Your Profile & Achievements</h1>

      <FinancialHealthScore score={score?.score ?? null} />

      <Card>
        <h2 className="text-2xl font-bold mb-4 text-white">Achievements</h2>
        {achievements.length > 0 ? (
          <ul className="space-y-4">
            {achievements.map((ach) => (
              <AchievementItem key={ach.id} achievement={ach} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No achievements unlocked yet. Keep up the great work!</p>
        )}
      </Card>
    </div>
  );
}; 