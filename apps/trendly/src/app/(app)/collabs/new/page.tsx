import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChevronLeft, Film, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AddCollaborationForm } from "@/components/AddCollaborationForm";

export const dynamic = "force-dynamic";

export default async function NewCollaborationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch this user's own posts — these are the linkable proof-of-work
  // candidates. Most recent first, up to 24.
  const { data: myPostsRaw } = await supabase
    .from("posts")
    .select("id, image_url, media_type, caption, created_at, kind")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(24);

  type MyPost = {
    id: string;
    image_url: string;
    media_type: "image" | "video" | null;
    caption: string | null;
    created_at: string | null;
    kind: "regular" | "proof_of_work";
  };
  const myPosts = (myPostsRaw as MyPost[] | null) ?? [];

  return (
    <>
      <header className="sticky top-0 z-20 bg-black border-b border-[color:var(--color-border)]">
        <div className="h-12 px-3 flex items-center gap-2">
          <Link href="/collabs" aria-label="Back">
            <ChevronLeft size={26} />
          </Link>
          <h1 className="font-semibold flex items-center gap-1.5">
            <ShieldCheck size={18} className="text-[color:var(--color-primary)]" />
            Add Collaboration
          </h1>
        </div>
      </header>

      <div className="px-4 py-3 text-xs text-white/60 leading-snug border-b border-[color:var(--color-border)]">
        A collaboration stays <span className="text-white font-medium">pending</span>{" "}
        until your partner verifies it. Only after mutual approval does it
        appear on both profiles — tied to the actual work you link below.
      </div>

      <AddCollaborationForm
        posts={myPosts.map((p) => ({
          id: p.id,
          image_url: p.image_url,
          media_type: p.media_type,
          caption: p.caption,
          kind: p.kind,
        }))}
      />

      {myPosts.length === 0 && (
        <div className="px-6 py-10 text-center text-sm text-white/60">
          <Film size={28} className="mx-auto text-white/40 mb-2" />
          You don't have any posts yet. Link to at least one piece of work so
          your collaboration is evidence-based.
          <div className="mt-3">
            <Link
              href="/proof/new"
              className="inline-flex items-center h-9 px-4 rounded-md btn-primary text-xs font-semibold"
            >
              Post proof first
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
