"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { uploadMediaAction } from "@/app/admin/media/actions";
import { Button } from "@/components/ui/button";

const initial: { error?: string; url?: string } = {};

export function MediaUploadZone() {
  const [state, formAction] = useFormState(uploadMediaAction, initial);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.url) {
      setLastUrl(state.url);
      formRef.current?.reset();
    }
  }, [state.url]);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        이미지 업로드
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        JPEG / PNG / WebP / GIF, 최대 5MB. 공개 URL은 게시글「대표 이미지
        URL」에 붙여 넣을 수 있습니다.
      </p>
      <form ref={formRef} action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="max-w-full text-sm"
          required
        />
        <Button type="submit">업로드</Button>
      </form>
      {state.error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      {lastUrl ? (
        <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3 text-sm">
          <p className="font-medium text-foreground">마지막 업로드 URL</p>
          <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
            {lastUrl}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              void navigator.clipboard.writeText(lastUrl);
            }}
          >
            URL 복사
          </Button>
        </div>
      ) : null}
    </div>
  );
}
