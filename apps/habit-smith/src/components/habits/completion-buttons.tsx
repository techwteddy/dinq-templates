"use client";

export function CompletionButtons({
  onComplete,
  onSkip,
}: {
  onComplete: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onComplete}
        className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white"
      >
        Mark Complete
      </button>
      <button
        type="button"
        onClick={onSkip}
        className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700"
      >
        Skip Today
      </button>
    </div>
  );
}
