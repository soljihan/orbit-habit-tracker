import React from 'react';

interface StreakToastProps {
  streakCount: number;
  habitName: string;
  message: string;
}

export function StreakToast({
  streakCount,
  habitName,
  message,
}: StreakToastProps) {
  return (
    <div className="streak-toast fixed top-6 right-6 z-50">
      <div className="flex items-center gap-3 rounded-xl border border-orange-400/60 bg-black/70 px-4 py-3 text-white shadow-[0_0_16px_rgba(255,140,0,0.55)]">
        <span className="text-xl">🔥</span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-orange-200">
            {streakCount} Day Streak!
          </span>
          <span className="text-sm text-white/80">
            {habitName} • {message}
          </span>
        </div>
      </div>
    </div>
  );
}
