import { Skeleton } from "@/components/layout/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="rounded-2xl border border-stone/60 bg-warm-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Skeleton className="h-24 w-24 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-9 w-48" />
            <div className="flex gap-3">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
