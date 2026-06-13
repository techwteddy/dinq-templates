import { Skeleton } from "@/components/layout/Skeleton";

export default function ListingsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters sidebar */}
        <div className="hidden w-64 shrink-0 lg:block">
          <Skeleton className="h-8 w-32" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Listing grid */}
        <div className="flex-1">
          <Skeleton className="h-8 w-48" />
          <div className="mt-6 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-stone/60 bg-warm-white">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
