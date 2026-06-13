'use client';
// src/components/nutrition/FrequentMeals.tsx
// Shows frequent meal combinations as one-tap suggestions.

import { useState, useEffect } from 'react';
import type { Habit } from '@/types/nutrition';
import { MEAL_TYPE_ICONS } from '@/types/nutrition';

interface FrequentMealsProps {
  date: string;
  onApplied: () => void;
}

export function FrequentMeals({ date, onApplied }: FrequentMealsProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/habits')
      .then((r) => r.json())
      .then((d) => setHabits(d.habits ?? []));
  }, []);

  if (habits.length === 0) return null;

  async function applyHabit(habitId: string) {
    setApplying(habitId);
    try {
      await fetch(`/api/habits/${habitId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      onApplied();
    } finally {
      setApplying(null);
    }
  }

  return (
    <div className="frequent">
      <p className="frequent__title">Tus comidas frecuentes</p>
      <div className="frequent__list">
        {habits.map((h) => (
          <button
            key={h.id}
            className="habit-chip"
            onClick={() => applyHabit(h.id)}
            disabled={applying === h.id}
          >
            <span className="habit-chip__icon">{MEAL_TYPE_ICONS[h.meal_type]}</span>
            <span className="habit-chip__label">{h.label}</span>
            {applying === h.id ? (
              <span className="habit-chip__spinner" />
            ) : (
              <span className="habit-chip__add">+</span>
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        .frequent { display: flex; flex-direction: column; gap: 0.5rem; }
        .frequent__title {
          font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--muted, #64748b); margin: 0;
        }
        .frequent__list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .habit-chip {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border: 1.5px solid var(--border, #e2e8f0);
          border-radius: 2rem;
          background: var(--surface, #fff);
          font-size: 0.8rem; cursor: pointer; transition: all 0.15s;
          white-space: nowrap;
        }
        .habit-chip:hover { border-color: var(--accent, #6366f1); background: color-mix(in srgb, var(--accent,#6366f1) 6%, transparent); }
        .habit-chip:disabled { opacity: 0.6; }
        .habit-chip__icon { font-size: 1rem; }
        .habit-chip__label { font-weight: 500; }
        .habit-chip__add {
          width: 1.25rem; height: 1.25rem; border-radius: 50%;
          background: var(--accent, #6366f1); color: #fff;
          font-size: 1rem; line-height: 1.25rem; text-align: center;
        }
        .habit-chip__spinner {
          width: 1rem; height: 1rem; border-radius: 50%;
          border: 2px solid var(--accent, #6366f1); border-top-color: transparent;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
