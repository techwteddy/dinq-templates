import { Skeleton } from "@/components/Skeleton";

export default function MessagesLoading() {
  return (
    <>
      <div className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <Skeleton rounded="full" className="w-7 h-7" />
        <Skeleton className="w-24 h-5" />
        <Skeleton rounded="full" className="w-7 h-7" />
      </div>
      <div className="px-3 pt-3 pb-2">
        <Skeleton rounded="lg" className="w-full h-9" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton rounded="full" className="w-14 h-14" />
            <div className="flex-1 flex flex-col gap-1.5">
              <Skeleton className="w-32 h-3.5" />
              <Skeleton className="w-48 h-3" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
