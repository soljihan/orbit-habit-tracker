export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
  streakCount: number;
  lastCompletedDate: string | null;
}

export interface HabitWithStats extends Habit {
  consistencyScore: number;
}