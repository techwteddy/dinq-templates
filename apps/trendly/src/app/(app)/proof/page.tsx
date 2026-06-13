import Link from "next/link";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Plus, Zap } from "lucide-react";
import { ProofFeed, type ProofItem } from "@/components/ProofFeed";

export const dynamic = "force-dynamic";

export default async function ProofPage() {
  const [user, supabase] = await Promise.all([getCachedUser(), createClient()]);

  // Query the proof_of_work_feed view for structured rows, then separately
  // enrich with liked/likes/comments counts from the posts tables.
  const { data: feedRows } = await supabase
    .from("proof_of_work_feed")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60);

  const postIds = (feedRows ?? []).map((r) => r.id as string);

  // likes / comments lookups in a single shot each
  let likeRows: { post_id: string; user_id: string }[] = [];
  let commentRows: { post_id: string }[] = [];
  if (postIds.length > 0) {
    const [{ data: lr }, { data: cr }] = await Promise.all([
      supabase.from("likes").select("post_id, user_id").in("post_id", postIds),
      supabase.from("comments").select("post_id").in("post_id", postIds),
    ]);
    likeRows = (lr ?? []) as { post_id: string; user_id: string }[];
    commentRows = (cr ?? []) as { post_id: string }[];
  }

  const likeCount = new Map<string, number>();
  const likedByMe = new Set<string>();
  for (const l of likeRows) {
    likeCount.set(l.post_id, (likeCount.get(l.post_id) ?? 0) + 1);
    if (user && l.user_id === user.id) likedByMe.add(l.post_id);
  }
  const commentCount = new Map<string, number>();
  for (const c of commentRows) {
    commentCount.set(c.post_id, (commentCount.get(c.post_id) ?? 0) + 1);
  }

  const items: ProofItem[] = (feedRows ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    user_id: r.user_id as string,
    caption: (r.caption as string | null) ?? null,
    image_url: r.image_url as string,
    media_type:
      (r.media_type as "image" | "video" | null) ?? "image",
    created_at: (r.created_at as string | null) ?? null,
    author_username: (r.author_username as string | null) ?? "user",
    author_avatar: (r.author_avatar as string | null) ?? null,
    liked: likedByMe.has(r.id as string),
    likes_count: likeCount.get(r.id as string) ?? 0,
    comments_count: commentCount.get(r.id as string) ?? 0,

    project_title: (r.project_title as string) ?? "",
    work_type: (r.work_type as string) ?? "other",
    stage:
      ((r.stage as "idea" | "in_progress" | "completed") ?? "in_progress"),
    tools: ((r.tools as string[] | null) ?? []) as string[],
    time_spent_hours:
      r.time_spent_hours != null ? Number(r.time_spent_hours) : null,
    started_at: (r.started_at as string | null) ?? null,
    intent: (r.intent as string | null) ?? null,
    skills: ((r.skills as string[] | null) ?? []) as string[],
    industry: (r.industry as string | null) ?? null,
    target_audience: (r.target_audience as string | null) ?? null,
    use_case: (r.use_case as string | null) ?? null,
    problem_solved: (r.problem_solved as string | null) ?? null,
    key_decisions: (r.key_decisions as string | null) ?? null,
    challenges: (r.challenges as string | null) ?? null,
    verified_collaborators: Number(r.verified_collaborators ?? 0),
  }));

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-5 bg-black">
        <div className="w-16 h-16 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center">
          <Zap size={32} className="text-[color:var(--color-primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Proof of Work</h1>
          <p className="text-sm text-white/60 mt-2 max-w-xs">
            Show your real execution — work in progress, behind the scenes, the
            stuff that proves you actually build.
          </p>
        </div>
        <Link
          href="/proof/new"
          className="h-10 px-4 inline-flex items-center gap-2 rounded-md btn-primary font-semibold text-sm"
        >
          <Plus size={18} /> Post your first Proof
        </Link>
      </div>
    );
  }

  return <ProofFeed items={items} />;
}
