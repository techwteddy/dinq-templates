import Link from "next/link";

import { PostEditorForm } from "@/components/admin/post-editor-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminNewPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          새 글 작성
        </h1>
        <Link
          href="/admin/posts"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          ← 목록
        </Link>
      </div>
      <PostEditorForm post={null} />
    </div>
  );
}
