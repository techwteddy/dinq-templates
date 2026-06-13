import { Skeleton } from "@/components/Skeleton";

export default function ProfileLoading() {
  return (
    <>
      <div className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <Skeleton className="w-32 h-5" />
        <Skeleton rounded="full" className="w-7 h-7" />
      </div>
      <div className="px-4 py-4 flex items-center gap-6">
        <Skeleton rounded="full" className="w-[86px] h-[86px]" />
        <div className="flex-1 flex justify-around text-center gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-10 h-5" />
              <Skeleton className="w-12 h-3" />
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 flex flex-col gap-2">
        <Skeleton className="w-32 h-3.5" />
        <Skeleton className="w-3/4 h-3" />
      </div>
      <div className="px-4 mt-3">
        <Skeleton rounded="sm" className="w-full h-8" />
      </div>
      <div className="grid grid-cols-3 gap-0.5 mt-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} rounded="sm" className="aspect-square" />
        ))}
      </div>
    </>
  );
}
