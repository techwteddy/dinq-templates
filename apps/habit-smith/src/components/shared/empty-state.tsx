"use client";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid h-full place-items-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center">
      <div>
        <p className="text-sm font-semibold text-zinc-800">{title}</p>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}
