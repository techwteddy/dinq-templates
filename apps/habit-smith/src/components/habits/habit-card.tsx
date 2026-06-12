"use client";

import type { Habit, HabitLog } from "@/types";

function getTodayLog(logs: HabitLog[], habitId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return logs.find((log) => log.habitId === habitId && log.date === today);
}

export function HabitCard({ habit, logs }: { habit: Habit; logs: HabitLog[] }) {
  const today = getTodayLog(logs, habit.id);
  const progress = today?.count ?? 0;
  const percentage = Math.min(100, Math.round((progress / habit.targetCount) * 100));

  return (
    <article className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{habit.title}</p>
          <p className="text-xs text-zinc-500">{habit.description}</p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs capitalize text-zinc-600">{habit.category}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full rounded-full bg-zinc-900" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        {progress}/{habit.targetCount} {habit.unit}
      </p>
    </article>
  );
}
