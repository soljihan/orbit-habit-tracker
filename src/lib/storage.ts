import { Habit } from './types';
import { calculateStreakFromDates, getLatestDate } from './utils';

const STORAGE_KEY = 'orbit-habits';

export const storage = {
  getHabits(): Habit[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    const habits: Habit[] = data ? JSON.parse(data) : [];

    return habits.map((habit) => {
      const lastCompletedDate =
        habit.lastCompletedDate ?? getLatestDate(habit.completedDates);
      const streakCount =
        typeof habit.streakCount === 'number'
          ? habit.streakCount
          : calculateStreakFromDates(habit.completedDates, lastCompletedDate);

      return {
        ...habit,
        lastCompletedDate: lastCompletedDate ?? null,
        streakCount,
      };
    });
  },

  saveHabits(habits: Habit[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  },

  addHabit(name: string): Habit {
    const habits = this.getHabits();
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      completedDates: [],
      streakCount: 0,
      lastCompletedDate: null,
    };
    habits.push(newHabit);
    this.saveHabits(habits);
    return newHabit;
  },

  deleteHabit(id: string): void {
    const habits = this.getHabits().filter(h => h.id !== id);
    this.saveHabits(habits);
  },

  updateHabitName(id: string, name: string): void {
    const habits = this.getHabits();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    habit.name = name;
    this.saveHabits(habits);
  },

  toggleHabitDate(
    id: string,
    date: string
  ): { habit: Habit; didComplete: boolean } | null {
    const habits = this.getHabits();
    const habit = habits.find(h => h.id === id);
    if (!habit) return null;

    const dateIndex = habit.completedDates.indexOf(date);
    const wasCompleted = dateIndex > -1;
    if (dateIndex > -1) {
      habit.completedDates.splice(dateIndex, 1);
    } else {
      habit.completedDates.push(date);
    }

    if (habit.completedDates.length === 0) {
      habit.lastCompletedDate = null;
      habit.streakCount = 0;
    } else {
      if (!wasCompleted) {
        if (!habit.lastCompletedDate || date > habit.lastCompletedDate) {
          habit.lastCompletedDate = date;
        }
      } else if (habit.lastCompletedDate === date) {
        habit.lastCompletedDate = getLatestDate(habit.completedDates);
      }

      habit.streakCount = calculateStreakFromDates(
        habit.completedDates,
        habit.lastCompletedDate
      );
    }

    this.saveHabits(habits);
    return { habit, didComplete: !wasCompleted };
  },
};