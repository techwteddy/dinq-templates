"use client";

import type { HabitLog } from "@/types";

export function HabitStats({ logs }: { logs: HabitLog[] }) {
  const completed = logs.filter((log) => log.completed).length;
  const completionRate = logs.length ? Math.round((completed / logs.length) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-2 text-xs text-zinc-600">
      <div className="rounded-lg bg-zinc-100 p-2">
        <p className="font-semibold text-zinc-900">{logs.length}</p>
        <p>Logs</p>
      </div>
      <div className="rounded-lg bg-zinc-100 p-2">
        <p className="font-semibold text-zinc-900">{completed}</p>
        <p>Completed</p>
      </div>
      <div className="rounded-lg bg-zinc-100 p-2">
        <p className="font-semibold text-zinc-900">{completionRate}%</p>
        <p>Rate</p>
      </div>
    </div>
  );
}
