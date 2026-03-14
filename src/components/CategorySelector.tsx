"use client";

import { useState } from 'react';

const UNCATEGORIZED = '';
const NEW_CATEGORY = '__new__';

interface CategorySelectorProps {
  categories: string[];
  value: string | null;
  onChange: (category: string | null) => void;
  onAddCategory?: (name: string) => void;
  onSaveRequest?: () => void;
  onCancelRequest?: () => void;
  className?: string;
  id?: string;
}

export function CategorySelector({
  categories,
  value,
  onChange,
  onAddCategory,
  onSaveRequest,
  onCancelRequest,
  className = '',
  id,
}: CategorySelectorProps) {
  const [showNewInput, setShowNewInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const selectValue = value ?? UNCATEGORIZED;
  const options = [...categories];
  if (value && !options.includes(value)) options.push(value);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === NEW_CATEGORY) {
      setShowNewInput(true);
      setNewCategoryName('');
      onChange(null);
    } else {
      setShowNewInput(false);
      onChange(v === UNCATEGORIZED ? null : v);
    }
  };

  const handleNewCategorySubmit = () => {
    const trimmed = newCategoryName.trim();
    if (trimmed) {
      onAddCategory?.(trimmed);
      onChange(trimmed);
      setNewCategoryName('');
      setShowNewInput(false);
    }
  };

  const handleNewCategoryBlur = () => {
    if (newCategoryName.trim()) {
      handleNewCategorySubmit();
    } else {
      setShowNewInput(false);
      onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <select
        id={id}
        value={showNewInput ? NEW_CATEGORY : selectValue}
        onChange={handleSelectChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !showNewInput) {
            e.preventDefault();
            onSaveRequest?.();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            if (showNewInput) {
              setShowNewInput(false);
              setNewCategoryName('');
              onChange(null);
            } else {
              onCancelRequest?.();
            }
          }
        }}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem',
          paddingRight: '2.5rem',
        }}
      >
        <option value={UNCATEGORIZED}>No Category</option>
        {options.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
        <option value={NEW_CATEGORY}>+ New Category</option>
      </select>
      {showNewInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onBlur={handleNewCategoryBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleNewCategorySubmit();
              } else if (e.key === 'Escape') {
                e.stopPropagation();
                setShowNewInput(false);
                setNewCategoryName('');
                onChange(null);
              }
            }}
            placeholder="Category name"
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={handleNewCategorySubmit}
            disabled={!newCategoryName.trim()}
            className="px-4 py-2 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 border border-purple-400/30 text-white text-sm font-medium disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
