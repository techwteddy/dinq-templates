import { notFound } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { ReelsFeed, type Reel } from "@/components/ReelsFeed";

export const dynamic = "force-dynamic";

export default async function ReelsIndexPage() {
  const [user, supabase] = await Promise.all([getCachedUser(), createClient()]);

  const { data: rows } = await supabase
    .from("posts")
    .select(
      `id, caption, image_url, media_type, created_at, user_id,
       profiles!posts_user_id_fkey(username, avatar_url),
       likes(user_id),
       comments(id)`,
    )
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .limit(60);

  const reels: Reel[] =
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

  if (reels.length === 0) notFound();

  return <ReelsFeed reels={reels} />;
}
