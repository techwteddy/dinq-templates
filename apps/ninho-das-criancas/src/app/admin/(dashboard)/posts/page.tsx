import Link from "next/link";

import { PostDeleteButton } from "@/components/admin/post-delete-button";
import { PostStatusSelect } from "@/components/admin/post-status-select";
import { buttonVariants } from "@/components/ui/button";
import { listAllPostsForAdmin } from "@/lib/data/admin-posts";
import type { PostStatus } from "@/lib/types/post";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("ko", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function statusLabel(s: PostStatus) {
  if (s === "draft") return "Draft";
  if (s === "published") return "Published";
  return "Hidden";
}

export default async function AdminPostsPage() {
  const posts = await listAllPostsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            게시글 관리
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Supabase SQL 마이그레이션{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              20260419120000_posts_authenticated_crud.sql
            </code>{" "}
            적용 후 로그인 사용자만 CRUD 됩니다.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className={cn(buttonVariants({ size: "sm" }), "w-fit shadow-sm")}
        >
          새 글 작성
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
          아직 글이 없습니다. 「새 글 작성」으로 추가하거나, SQL 시드를
          확인하세요.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/70 bg-card shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">제목</th>
                <th className="px-4 py-3">카테고리</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">수정</th>
                <th className="px-4 py-3 text-right">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/20">
                  <td className="max-w-[280px] px-4 py-3">
                    <p className="truncate font-medium text-foreground">
                      {post.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      /{post.slug}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {post.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        {statusLabel(post.status)}
                      </span>
                      <PostStatusSelect postId={post.id} current={post.status} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatDate(post.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" })
                        )}
                      >
                        수정
                      </Link>
                      <PostDeleteButton postId={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
