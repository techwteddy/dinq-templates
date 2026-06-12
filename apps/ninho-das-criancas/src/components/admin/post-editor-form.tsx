"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { uploadMediaAction } from "@/app/admin/media/actions";
import { savePostAction } from "@/app/admin/posts/actions";
import { ADMIN_POST_CATEGORIES } from "@/lib/constants/admin-post-categories";
import type { Post, PostStatus } from "@/lib/types/post";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "flex min-h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
  "outline-none ring-offset-background focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
);

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const offset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - offset);
  return local.toISOString().slice(0, 16);
}

type FormState = { error?: string; ok?: boolean };

const initialFormState: FormState = {};

export function PostEditorForm({ post }: { post: Post | null }) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [state, formAction] = useFormState(savePostAction, initialFormState);
  const handledOk = useRef(false);
  const [thumb, setThumb] = useState(post?.thumbnail_url ?? "");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbUploadError, setThumbUploadError] = useState<string | null>(null);
  const thumbFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok && !handledOk.current) {
      handledOk.current = true;
      router.refresh();
      router.push("/admin/posts");
    }
  }, [state.ok, router]);

  useEffect(() => {
    if (state.error) {
      handledOk.current = false;
    }
  }, [state.error]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      {state.error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="title" className="text-sm font-medium">
            제목 <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post?.title ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="slug" className="text-sm font-medium">
            슬러그 (비우면 제목 기준으로 자동 생성)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={post?.slug ?? ""}
            className={inputClass}
            placeholder="예: spring-garden-day"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            카테고리
          </label>
          <select
            id="category"
            name="category"
            defaultValue={post?.category ?? ""}
            className={inputClass}
          >
            <option value="">선택 안 함</option>
            {ADMIN_POST_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            상태
          </label>
          <select
            id="status"
            name="status"
            defaultValue={(post?.status ?? "draft") as PostStatus}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="published_at" className="text-sm font-medium">
            게시일 (published일 때 권장)
          </label>
          <input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(post?.published_at ?? null)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="summary" className="text-sm font-medium">
            요약
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            defaultValue={post?.summary ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="tags" className="text-sm font-medium">
            태그 (쉼표로 구분)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={post?.tags?.join(", ") ?? ""}
            className={inputClass}
            placeholder="활동, 봄"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="thumbnail_url" className="text-sm font-medium">
            대표 이미지 URL
          </label>
          <p className="text-xs text-muted-foreground">
            URL을 직접 넣거나, 미디어에서 업로드한 뒤「파일에서 채우기」로
            붙여 넣을 수 있습니다.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              id="thumbnail_url"
              name="thumbnail_url"
              type="url"
              value={thumb}
              onChange={(e) => setThumb(e.target.value)}
              className={cn(inputClass, "sm:min-w-0 sm:flex-1")}
              placeholder="https://..."
            />
            <input
              ref={thumbFileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setThumbUploadError(null);
                setUploadingThumb(true);
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await uploadMediaAction({}, fd);
                  if (res.error) setThumbUploadError(res.error);
                  else if (res.url) setThumb(res.url);
                } finally {
                  setUploadingThumb(false);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploadingThumb}
              onClick={() => thumbFileRef.current?.click()}
            >
              {uploadingThumb ? "업로드 중…" : "파일에서 채우기"}
            </Button>
          </div>
          {thumbUploadError ? (
            <p className="text-xs text-destructive">{thumbUploadError}</p>
          ) : null}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="images" className="text-sm font-medium">
            추가 이미지 URL (줄바꿈 또는 쉼표로 구분)
          </label>
          <textarea
            id="images"
            name="images"
            rows={3}
            defaultValue={post?.images?.join("\n") ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="content" className="text-sm font-medium">
            본문 (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            rows={18}
            defaultValue={post?.content ?? ""}
            className={cn(inputClass, "font-mono text-xs sm:text-sm")}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{isEdit ? "저장" : "작성"}</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/posts")}
        >
          목록으로
        </Button>
      </div>
    </form>
  );
}
