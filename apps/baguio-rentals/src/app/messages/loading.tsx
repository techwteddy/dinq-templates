import { Skeleton } from "@/components/layout/Skeleton";

export default function MessagesLoading() {
  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-stone/60 bg-warm-white">
      {/* Conversation list */}
      <div className="w-80 shrink-0 border-r border-stone/60">
        <div className="border-b border-stone/60 px-4 py-4">
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="divide-y divide-stone/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat area */}
      <div className="hidden flex-1 sm:block">
        <Skeleton className="m-auto mt-32 h-14 w-14 rounded-2xl" />
      </div>
    </div>
  );
}
