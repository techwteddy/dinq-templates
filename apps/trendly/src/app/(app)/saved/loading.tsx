import { Skeleton } from "@/components/Skeleton";

export default function SavedLoading() {
  return (
    <>
      <header className="sticky top-0 z-20 bg-black border-b border-[color:var(--color-border)]">
        <div className="h-12 px-3 flex items-center gap-2">
          <Skeleton rounded="full" className="w-7 h-7" />
          <Skeleton className="w-24 h-5" />
        </div>
      </header>
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} rounded="sm" className="aspect-square" />
        ))}
      </div>
    </>
  );
}
