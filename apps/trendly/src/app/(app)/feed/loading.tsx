import { StoriesRailSkeleton, PostCardSkeleton } from "@/components/Skeleton";
import { Skeleton } from "@/components/Skeleton";

export default function FeedLoading() {
  return (
    <>
      <div className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <Skeleton className="w-24 h-5" />
        <div className="flex gap-3">
          <Skeleton rounded="full" className="w-7 h-7" />
          <Skeleton rounded="full" className="w-7 h-7" />
        </div>
      </div>
      <StoriesRailSkeleton />
      <div className="flex-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
