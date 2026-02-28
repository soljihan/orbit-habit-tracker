"use client";

import { type HTMLAttributes, useRef, useState } from 'react';
import { HabitWithStats } from '@/lib/types';
import { storage } from '@/lib/storage';
import { getTodayString } from '@/lib/utils';
import { Heatmap } from './Heatmap';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface HabitItemProps {
  habit: HabitWithStats;
  onUpdate: () => void;
  onComplete?: (streakCount: number, habitName: string) => void;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
}

export function HabitItem({
  habit,
  onUpdate,
  onComplete,
  dragHandleProps,
}: HabitItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const ignoreBlurRef = useRef(false);
  const today = getTodayString();
  const isCompletedToday = habit.completedDates.includes(today);

  const handleToggle = () => {
    setIsAnimating(true);
    const result = storage.toggleHabitDate(habit.id, today);
    if (result?.didComplete) {
      onComplete?.(result.habit.streakCount, result.habit.name);
    }
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

  const startEditing = () => {
    setEditName(habit.name);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditName(habit.name);
    setIsEditing(false);
  };

  const saveEditing = () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      cancelEditing();
      return;
    }
    if (trimmed !== habit.name) {
      storage.updateHabitName(habit.id, trimmed);
      onUpdate();
    }
    setIsEditing(false);
  };

  return (
    <div className="group relative">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300">
        {/* Main habit row */}
        <div className="flex items-center gap-4">
          {/* Drag handle */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80 cursor-grab active:cursor-grabbing"
            aria-label="Reorder habit"
            {...dragHandleProps}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 4a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zM6 10a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zM6 16a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>

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
            <div className="flex flex-wrap items-center gap-3">
              {isEditing ? (
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  onBlur={() => {
                    if (ignoreBlurRef.current) {
                      ignoreBlurRef.current = false;
                      return;
                    }
                    saveEditing();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      saveEditing();
                    } else if (event.key === 'Escape') {
                      event.preventDefault();
                      ignoreBlurRef.current = true;
                      cancelEditing();
                    }
                  }}
                  autoFocus
                  className="text-lg font-medium text-white bg-white/5 border border-white/10 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              ) : (
                <button
                  type="button"
                  onClick={startEditing}
                  className="rounded-lg px-2 py-1 text-lg font-medium text-white transition-colors hover:bg-white/10 cursor-text"
                >
                  {habit.name}
                </button>
              )}
              <span className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-300">
                <svg
                  className="h-3.5 w-3.5 text-orange-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 2.5c0 2.3-1.3 3.5-2.4 4.6-1 1-1.9 1.9-1.9 3.4 0 1.7 1.2 3 3.1 3.1 1.6.1 3.2-1 3.8-2.5.4-1 .4-2.3-.2-3.8 2.3 1.6 3.6 4 3.6 6.6 0 4.7-3.8 8.6-8.6 8.6-4.3 0-7.8-3.1-8.4-7.2-.6-4.1 1.8-7 4.5-9.2 1.7-1.4 3.4-2.9 3.5-5.6z" />
                </svg>
                {habit.streakCount}
              </span>
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