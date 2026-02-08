export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
}

export interface HabitWithStats extends Habit {
  consistencyScore: number;
}