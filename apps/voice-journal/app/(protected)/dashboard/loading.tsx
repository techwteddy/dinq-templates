export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-5 w-64 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl p-4 ring-1 ring-foreground/10"
          >
            <div className="space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
