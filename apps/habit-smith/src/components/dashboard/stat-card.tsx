"use client";

import type { ReactNode } from "react";

export function StatCard({ title, value, detail, icon }: { title: string; value: string | number; detail?: string; icon?: ReactNode }) {
  return (
    <article className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{value}</p>
          {detail ? <p className="mt-1 text-xs text-zinc-500">{detail}</p> : null}
        </div>
        {icon ? <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">{icon}</div> : null}
      </div>
    </article>
  );
}
