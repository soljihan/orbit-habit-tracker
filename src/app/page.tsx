"use client";

import { useState, useEffect, useRef } from 'react';
import {
  type DragEndEvent,
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { storage } from '@/lib/storage';
import { addStatsToHabit } from '@/lib/utils';
import { HabitWithStats } from '@/lib/types';
import { SortableHabitItem } from '@/components/SortableHabitItem';
import { AddHabitModal } from '@/components/AddHabitModal';
import { StreakToast } from '@/components/StreakToast';

export default function Home() {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [streakToast, setStreakToast] = useState<{
    streakCount: number;
    habitName: string;
    message: string;
  } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  useEffect(() => {
    // Load habits from localStorage on mount
    const loadInitialHabits = () => {
      const loadedHabits = storage.getHabits().map(addStatsToHabit);
      setHabits(loadedHabits);
      setIsLoaded(true);
    };
    loadInitialHabits();
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const loadHabits = () => {
    const loadedHabits = storage.getHabits().map(addStatsToHabit);
    setHabits(loadedHabits);
  };

  const handleAddHabit = (name: string) => {
    storage.addHabit(name);
    loadHabits();
  };

  const showStreakToast = (streakCount: number, habitName: string) => {
    setStreakToast({ streakCount, habitName, message: "You're on fire!" });

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setStreakToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const oldIndex = habits.findIndex(habit => habit.id === activeId);
    const newIndex = habits.findIndex(habit => habit.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(habits, oldIndex, newIndex);
    setHabits(reordered);
    storage.saveHabits(reordered.map(({ consistencyScore, ...habit }) => habit));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {streakToast && (
        <StreakToast
          streakCount={streakToast.streakCount}
          habitName={streakToast.habitName}
          message={streakToast.message}
        />
      )}
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient" />
      
      {/* Glassmorphism orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Orbit
            </span>
          </h1>
          <p className="text-white/60 text-lg">
            Build consistency, one day at a time
          </p>
        </div>

        {/* Add habit button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
            Add New Habit
          </button>
        </div>

        {/* Habits list */}
        {habits.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white/40"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No habits yet
            </h3>
            <p className="text-white/50 mb-6">
              Start building your consistency by adding your first habit
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={habits.map(habit => habit.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {habits.map((habit) => (
                  <SortableHabitItem
                    key={habit.id}
                    habit={habit}
                    onUpdate={loadHabits}
                    onComplete={showStreakToast}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Stats footer */}
        {habits.length > 0 && (
          <div className="mt-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {habits.length}
                </div>
                <div className="text-sm text-white/50">Active Habits</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {habits.reduce((sum, h) => sum + h.completedDates.length, 0)}
                </div>
                <div className="text-sm text-white/50">Total Completions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.round(
                    habits.reduce((sum, h) => sum + h.consistencyScore, 0) /
                      habits.length
                  )}%
                </div>
                <div className="text-sm text-white/50">Avg. Consistency</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add habit modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddHabit}
      />
    </div>
  );
}