'use client';

import { useEffect, useState } from 'react';
import { Flame, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  longest_streak: number;
  completed_dates: string[];
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10);

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/habits');
      const json = await res.json();
      if (json.success) setHabits(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), emoji: '✅' }),
      });
      const json = await res.json();
      if (json.success) {
        setHabits((prev) => [json.data, ...prev]);
        setNewName('');
        toast.success('Habit created');
      }
    } catch {
      toast.error('Failed to create habit');
    }
  };

  const toggleToday = async (habit: Habit) => {
    const doneToday = habit.completed_dates?.includes(today);
    if (doneToday) {
      // Unchecking not implemented in API for simplicity; just alert
      toast.info('Already complete! Keep it up.');
      return;
    }
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id
          ? { ...h, completed_dates: [...h.completed_dates, today], streak: h.streak + 1 }
          : h
      )
    );
    try {
      const res = await fetch('/api/habits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: habit.id, completed_today: true }),
      });
      const json = await res.json();
      if (!json.success) throw new Error();
    } catch {
      toast.error('Sync failed');
      fetchHabits();
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          placeholder="New habit (e.g., Read 10 pages)"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button onClick={addHabit} className="rounded-lg bg-brand-600 text-white px-3 py-2 active:scale-95 transition">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No habits yet. Start small — one habit changes everything.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {habits.map((habit) => {
            const doneToday = habit.completed_dates?.includes(today);
            return (
              <button
                key={habit.id}
                onClick={() => toggleToday(habit)}
                className={`flex items-center gap-4 rounded-xl border px-4 py-4 text-left transition active:scale-[0.98] ${
                  doneToday
                    ? 'border-brand-200 bg-brand-50 shadow-sm'
                    : 'border-slate-100 bg-white shadow-sm'
                }`}
              >
                <div className={`text-2xl ${doneToday ? 'grayscale-0' : 'grayscale'}`}>{habit.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{habit.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Flame className={`h-3.5 w-3.5 ${habit.streak > 2 ? 'text-orange-500' : 'text-slate-300'}`} />
                    <span className="text-xs text-slate-500">
                      {habit.streak}-day streak{habit.streak === habit.longest_streak && habit.streak > 0 ? ' 🔥 Best!' : ''}
                    </span>
                  </div>
                </div>
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    doneToday ? 'bg-brand-500 border-brand-500' : 'border-slate-300'
                  }`}
                >
                  {doneToday && <span className="text-white text-xs">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
