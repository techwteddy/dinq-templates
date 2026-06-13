"use client";
import { useState, useTransition } from "react";
import { toggleFollow } from "@/app/actions";
import { cn } from "@/lib/utils";

export function FollowButton({
  targetId,
  initiallyFollowing,
  className,
}: {
  targetId: string;
  initiallyFollowing: boolean;
  className?: string;
}) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [pending, start] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        setFollowing((v) => !v);
        start(() => toggleFollow(targetId));
      }}
      className={cn(
        "h-8 px-4 rounded-md text-sm font-semibold",
        following
          ? "bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border)]"
          : "btn-primary text-white",
        className,
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
