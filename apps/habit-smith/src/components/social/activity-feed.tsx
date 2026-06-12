"use client";

import { formatDistanceToNow } from "date-fns";

import type { ActivityItem } from "@/types";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Recent Activity</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-zinc-100 px-3 py-2">
            <p className="text-sm text-zinc-800">{item.description}</p>
            <p className="mt-1 text-xs text-zinc-500">
              @{item.username} · {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
