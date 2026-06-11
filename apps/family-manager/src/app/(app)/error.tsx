"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <div className="p-8 rounded-2xl bg-card border-2 border-card-border shadow-sm max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-sm text-muted">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl bg-lavender text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
