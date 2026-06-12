"use client";

import type { LeaderboardEntry } from "@/types";

export function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Friend Leaderboard</h2>
      <ul className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li key={entry.userId} className="flex items-center justify-between rounded-xl border border-zinc-100 px-3 py-2">
            <div>
              <p className="text-sm font-medium text-zinc-900">#{entry.rank} {entry.displayName}</p>
              <p className="text-xs text-zinc-500">@{entry.username}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900">{entry.streak} days</p>
              <p className="text-xs text-zinc-500">{entry.weeklyCompletions} done this week</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
