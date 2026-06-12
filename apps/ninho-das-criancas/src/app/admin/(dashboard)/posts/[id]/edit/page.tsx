import Link from "next/link";
import { notFound } from "next/navigation";

import { PostEditorForm } from "@/components/admin/post-editor-form";
import { buttonVariants } from "@/components/ui/button";
import { getPostByIdForAdmin } from "@/lib/data/admin-posts";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPostByIdForAdmin(params.id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          글 수정
        </h1>
        <Link
          href="/admin/posts"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          ← 목록
        </Link>
      </div>
      <PostEditorForm post={post} />
    </div>
  );
}
