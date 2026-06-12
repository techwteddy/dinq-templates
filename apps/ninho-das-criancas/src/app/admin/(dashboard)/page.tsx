import Link from "next/link";

import { listAllPostsForAdmin } from "@/lib/data/admin-posts";
import { getSupabaseServer } from "@/lib/supabase/supabase-server-optional";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = getSupabaseServer();
  let email: string | null = null;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  }

  const allPosts = await listAllPostsForAdmin();
  const publishedCount = allPosts.filter((p) => p.status === "published").length;
  const draftCount = allPosts.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          대시보드
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          로그인 세션: {email ?? "(알 수 없음)"}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Published
          </p>
          <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
            {publishedCount}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Draft
          </p>
          <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
            {draftCount}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            빠른 작업
          </p>
          <Link
            href="/admin/posts"
            className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            게시글 관리로 →
          </Link>
        </div>
      </section>
    </div>
  );
}
