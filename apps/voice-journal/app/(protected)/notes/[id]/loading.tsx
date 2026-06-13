export default function NoteLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-5 w-52 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-10 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-44 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-14 animate-pulse rounded-md bg-muted" />
        <div className="h-[300px] w-full animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="flex gap-3">
        <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
