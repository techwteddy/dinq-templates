"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updatePostStatusAction } from "@/app/admin/posts/actions";
import type { PostStatus } from "@/lib/types/post";
import { cn } from "@/lib/utils";

const statuses: { value: PostStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "hidden", label: "Hidden" },
];

export function PostStatusSelect({
  postId,
  current,
}: {
  postId: string;
  current: PostStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="게시 상태 변경"
      defaultValue={current}
      disabled={pending}
      className={cn(
        "max-w-[140px] rounded-md border border-input bg-background px-2 py-1.5 text-xs font-medium",
        "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      )}
      onChange={(e) => {
        const status = e.target.value as PostStatus;
        startTransition(async () => {
          const res = await updatePostStatusAction(postId, status);
          if (res.error) {
            alert(res.error);
            e.target.value = current;
            return;
          }
          router.refresh();
        });
      }}
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
