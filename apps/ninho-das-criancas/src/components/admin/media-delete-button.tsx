"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteMediaObjectAction } from "@/app/admin/media/actions";
import { Button } from "@/components/ui/button";

export function MediaDeleteButton({ path }: { path: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (!confirm("이 파일을 삭제할까요? 게시글에서 쓰는 URL은 깨질 수 있습니다.")) {
      return;
    }
    setError(null);
    setPending(true);
    try {
      const res = await deleteMediaObjectAction(path);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={onClick}
      >
        {pending ? "삭제 중…" : "삭제"}
      </Button>
      {error ? (
        <span className="max-w-[200px] text-right text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </div>
  );
}
