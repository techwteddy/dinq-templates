"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deletePostAction } from "@/app/admin/posts/actions";
import { Button } from "@/components/ui/button";

export function PostDeleteButton({
  postId,
  title,
}: {
  postId: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`「${title}」글을 삭제할까요?`)) return;
    setLoading(true);
    try {
      const res = await deletePostAction(postId);
      if (res.error) {
        alert(res.error);
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={loading}
      onClick={handleDelete}
    >
      {loading ? "삭제 중…" : "삭제"}
    </Button>
  );
}
