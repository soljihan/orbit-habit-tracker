import { type CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HabitWithStats } from '@/lib/types';
import { HabitItem } from '@/components/HabitItem';

interface SortableHabitItemProps {
  habit: HabitWithStats;
  onUpdate: () => void;
  onComplete?: (streakCount: number, habitName: string) => void;
}

export function SortableHabitItem({
  habit,
  onUpdate,
  onComplete,
}: SortableHabitItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: habit.id });

  const transformString = CSS.Transform.toString(transform);
  const style: CSSProperties = {
    transform: isDragging
      ? `${transformString ?? ''} rotate(2.5deg)`
      : transformString,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'drop-shadow-xl' : undefined}
    >
      <HabitItem
        habit={habit}
        onUpdate={onUpdate}
        onComplete={onComplete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
