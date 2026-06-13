import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReelsFeed, type Reel } from "@/components/ReelsFeed";

export const dynamic = "force-dynamic";

export default async function ReelsPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verify the starting post exists.
  const { data: start } = await supabase
    .from("posts")
    .select("id")
    .eq("id", postId)
    .maybeSingle();
  if (!start) notFound();

  // Load a window of posts ordered newest-first.
  const { data: rows } = await supabase
    .from("posts")
    .select(
      `id, caption, image_url, media_type, created_at, user_id,
       profiles!posts_user_id_fkey(username, avatar_url),
       likes(user_id),
       comments(id)`,
    )
    .order("created_at", { ascending: false })
    .limit(60);

  const all: Reel[] =
    (rows ?? []).map((r) => {
      const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
      const likes = (r.likes ?? []) as { user_id: string }[];
      const liked = !!(user && likes.some((l) => l.user_id === user.id));
      return {
        id: r.id,
        user_id: r.user_id,
        caption: r.caption,
        image_url: r.image_url,
        media_type:
          (r as unknown as { media_type?: "image" | "video" | null }).media_type ?? "image",
        created_at: r.created_at,
        author_username: profile?.username ?? "user",
        author_avatar: profile?.avatar_url ?? null,
        liked,
        likes_count: likes.length,
        comments_count: (r.comments ?? []).length,
      };
    }) ?? [];

  // Reorder so the tapped post is first.
  const startIdx = all.findIndex((p) => p.id === postId);
  const reordered =
    startIdx > 0 ? [...all.slice(startIdx), ...all.slice(0, startIdx)] : all;

  if (reordered.length === 0) notFound();

  return <ReelsFeed reels={reordered} />;
}
