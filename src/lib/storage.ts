import { Habit } from './types';

const STORAGE_KEY = 'orbit-habits';

export const storage = {
  getHabits(): Habit[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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
    };
    habits.push(newHabit);
    this.saveHabits(habits);
    return newHabit;
  },

  deleteHabit(id: string): void {
    const habits = this.getHabits().filter(h => h.id !== id);
    this.saveHabits(habits);
  },

  toggleHabitDate(id: string, date: string): void {
    const habits = this.getHabits();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const dateIndex = habit.completedDates.indexOf(date);
    if (dateIndex > -1) {
      habit.completedDates.splice(dateIndex, 1);
    } else {
      habit.completedDates.push(date);
    }
    this.saveHabits(habits);
  },
};