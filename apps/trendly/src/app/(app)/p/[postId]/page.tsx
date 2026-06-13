import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { PostCard, type FeedPost } from "@/components/PostCard";
import { getUsersWithActiveStories } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const [user, supabase] = await Promise.all([getCachedUser(), createClient()]);

  const { data: row } = await supabase
    .from("posts")
    .select(
      `id, caption, image_url, media_type, created_at, user_id, archived_at,
       profiles!posts_user_id_fkey(username, avatar_url),
       likes(user_id),
       comments(id)`,
    )
    .eq("id", postId)
    .maybeSingle();

  if (!row) notFound();

  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const likes = (row.likes ?? []) as { user_id: string }[];
  const liked = !!(user && likes.some((l) => l.user_id === user.id));

  // Story ring: only if the author has an active story visible to this viewer.
  // Run the follow check + active-story lookup in parallel.
  let authorHasStory = false;
  if (user && row.user_id) {
    const isSelf = user.id === row.user_id;
    const [followRes, ring] = await Promise.all([
      isSelf
        ? Promise.resolve({ data: { follower_id: user.id } as { follower_id: string } | null })
        : supabase
            .from("follows")
            .select("follower_id")
            .eq("follower_id", user.id)
            .eq("following_id", row.user_id)
            .maybeSingle(),
      getUsersWithActiveStories(supabase, [row.user_id]),
    ]);
    const visible = isSelf || !!followRes.data;
    if (visible) authorHasStory = ring.has(row.user_id);
  }

  const post: FeedPost = {
    id: row.id,
    caption: row.caption,
    image_url: row.image_url,
    media_type:
      (row as unknown as { media_type?: "image" | "video" | null }).media_type ?? "image",
    created_at: row.created_at,
    author_id: row.user_id,
    author_username: profile?.username ?? "user",
    author_avatar: profile?.avatar_url ?? null,
    author_has_story: authorHasStory,
    liked,
    saved: false,
    likes_count: likes.length,
    comments_count: (row.comments ?? []).length,
    archived: !!(row as unknown as { archived_at?: string | null }).archived_at,
    top_liker: null,
  };

  return (
    <>
      <header className="h-12 px-3 flex items-center gap-3 border-b border-[color:var(--color-border)] sticky top-0 bg-black z-10">
        <Link href="/search" aria-label="Back">
          <ChevronLeft size={26} />
        </Link>
        <span className="font-semibold">Post</span>
      </header>
      <PostCard post={post} currentUserId={user?.id ?? null} />
    </>
  );
}
