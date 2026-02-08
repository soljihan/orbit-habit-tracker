"use client";

import { useState } from 'react';
import { HabitWithStats } from '@/lib/types';
import { storage } from '@/lib/storage';
import { getTodayString } from '@/lib/utils';
import { Heatmap } from './Heatmap';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface HabitItemProps {
  habit: HabitWithStats;
  onUpdate: () => void;
}

export function HabitItem({ habit, onUpdate }: HabitItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const today = getTodayString();
  const isCompletedToday = habit.completedDates.includes(today);

  const handleToggle = () => {
    setIsAnimating(true);
    storage.toggleHabitDate(habit.id, today);
    setTimeout(() => {
      setIsAnimating(false);
      onUpdate();
    }, 300);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    storage.deleteHabit(habit.id);
    setShowDeleteModal(false);
    onUpdate();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="group relative">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300">
        {/* Main habit row */}
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`relative w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
              isCompletedToday
                ? 'bg-gradient-to-br from-purple-500 to-cyan-500 border-transparent shadow-lg shadow-purple-500/50'
                : 'border-white/30 hover:border-white/50 bg-white/5'
            } ${isAnimating ? 'scale-110' : 'scale-100'}`}
          >
            {isCompletedToday && (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Habit name and score */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-white">{habit.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  habit.consistencyScore >= 80
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : habit.consistencyScore >= 50
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {habit.consistencyScore}%
              </span>
            </div>
            <p className="text-sm text-white/50 mt-1">
              {habit.completedDates.length} days completed
            </p>
          </div>

          {/* Expand/Delete buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
            >
              <svg
                className={`w-5 h-5 text-white/70 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200"
              title="Delete habit"
            >
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expandable heatmap */}
        {isExpanded && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Heatmap habit={habit} />
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        habitName={habit.name}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}