import type { GamificationEvent } from '../types';

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Consecutive days (local) with at least one event, counting backward from today. */
export function computeActivityStreak(events: GamificationEvent[]): number {
  const days = new Set(events.map((e) => dayKey(new Date(e.created_at))));
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 366; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (days.has(dayKey(d))) streak++;
    else break;
  }
  return streak;
}

export function sumEventPoints(events: GamificationEvent[]): number {
  return events.reduce((s, e) => s + (e.points_earned || 0), 0);
}
