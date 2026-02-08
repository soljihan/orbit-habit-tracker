"use client";

import { Habit } from '@/lib/types';
import { formatDate, getLast12Weeks, getWeekdayLabel } from '@/lib/utils';

interface HeatmapProps {
  habit: Habit;
}

export function Heatmap({ habit }: HeatmapProps) {
  const dates = getLast12Weeks();
  
  // Group dates by week
  const weeks: Date[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  const isCompleted = (date: Date) => {
    return habit.completedDates.includes(formatDate(date));
  };

  return (
    <div className="mt-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="flex gap-1">
        {/* Weekday labels */}
        <div className="flex flex-col gap-1 mr-2">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div
              key={day}
              className="h-3 flex items-center text-[10px] text-white/40"
            >
              {getWeekdayLabel(day)}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                const completed = isCompleted(date);
                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm transition-all duration-300 ${
                      completed
                        ? 'bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/50'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title={formatDate(date)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-3 text-xs text-white/50 flex items-center gap-4">
        <span>Last 12 weeks</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white/10" />
          <span>Missed</span>
          <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-purple-500 to-cyan-500" />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}