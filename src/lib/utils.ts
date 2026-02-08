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