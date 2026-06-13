import { cn } from "@/lib/utils";

/**
 * Tiny shimmer skeleton box. Compose into shapes that match the real
 * content to make perceived load time feel near-instant.
 */
export function Skeleton({
  className,
  rounded = "md",
  ...rest
}: {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
} & React.HTMLAttributes<HTMLDivElement>) {
  const radius = {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  }[rounded];
  return <div className={cn("skeleton", radius, className)} {...rest} />;
}

/** Card-shaped placeholder matching a feed PostCard. */
export function PostCardSkeleton() {
  return (
    <div className="border-b border-[color:var(--color-border)] pb-3">
      <div className="flex items-center gap-3 px-3 py-2">
        <Skeleton rounded="full" className="w-9 h-9" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-16 h-2.5" />
        </div>
      </div>
      <Skeleton rounded="sm" className="aspect-square w-full" />
      <div className="flex items-center gap-4 px-3 pt-2">
        <Skeleton rounded="full" className="w-7 h-7" />
        <Skeleton rounded="full" className="w-7 h-7" />
        <Skeleton rounded="full" className="w-7 h-7" />
      </div>
      <div className="px-3 pt-2 flex flex-col gap-2">
        <Skeleton className="w-20 h-3.5" />
        <Skeleton className="w-3/4 h-3" />
      </div>
    </div>
  );
}

/** Circle row — used by the stories rail loader. */
export function StoriesRailSkeleton() {
  return (
    <div className="border-b border-[color:var(--color-border)]">
      <div className="flex gap-3 px-3 py-3 overflow-x-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 w-[68px]">
            <Skeleton rounded="full" className="w-16 h-16" />
            <Skeleton className="w-12 h-2.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
