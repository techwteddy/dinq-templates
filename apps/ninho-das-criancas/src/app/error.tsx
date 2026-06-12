"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        오류가 발생했습니다
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        다시 시도
      </button>
    </div>
  );
}
