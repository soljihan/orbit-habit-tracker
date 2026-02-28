import { Habit, HabitWithStats } from './types';

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function calculateConsistencyScore(habit: Habit): number {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  let completedCount = 0;
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateString = formatDate(checkDate);
    if (habit.completedDates.includes(dateString)) {
      completedCount++;
    }
  }

  return Math.round((completedCount / 30) * 100);
}

export function addStatsToHabit(habit: Habit): HabitWithStats {
  return {
    ...habit,
    consistencyScore: calculateConsistencyScore(habit),
  };
}

export function addDaysToDateString(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function getLatestDate(completedDates: string[]): string | null {
  if (completedDates.length === 0) return null;
  const sorted = [...completedDates].sort();
  return sorted[sorted.length - 1] ?? null;
}

export function calculateStreakFromDates(
  completedDates: string[],
  lastCompletedDate?: string | null
): number {
  if (completedDates.length === 0) return 0;
  const latest = lastCompletedDate ?? getLatestDate(completedDates);
  if (!latest) return 0;

  const dateSet = new Set(completedDates);
  let streak = 0;
  let cursor = latest;

  while (dateSet.has(cursor)) {
    streak += 1;
    cursor = addDaysToDateString(cursor, -1);
  }

  return streak;
}

export function getLast12Weeks(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  
  // 12 weeks = 84 days
  for (let i = 83; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  
  return dates;
}

export function getWeekdayLabel(index: number): string {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return labels[index];
}