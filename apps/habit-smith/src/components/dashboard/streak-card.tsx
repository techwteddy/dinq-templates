"use client";

export function StreakCard({ title, current, longest }: { title: string; current: number; longest: number }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-white shadow-xl">
      <p className="text-sm text-zinc-300">{title}</p>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold">{current} days</p>
          <p className="text-xs text-zinc-400">Current streak</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{longest}</p>
          <p className="text-xs text-zinc-400">Longest</p>
        </div>
      </div>
    </article>
  );
}
