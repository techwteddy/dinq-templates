import { Skeleton } from "@/components/layout/Skeleton";

export default function ListingDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
      <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-6 h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}
