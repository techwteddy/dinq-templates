import Link from "next/link";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Clapperboard, Search } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { StoriesRail } from "@/components/StoriesRail";
import { PostCard, type FeedPost } from "@/components/PostCard";
import { HeaderBadges } from "@/components/HeaderBadges";
import { Avatar } from "@/components/Avatar";
import { EmptyArt } from "@/components/EmptyArt";
import { getStoryRingState } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const [user, supabase] = await Promise.all([getCachedUser(), createClient()]);

  // Kick off posts and follows in parallel — they don't depend on each other.
  // (follows is only meaningful when a user is signed in.)
  const postsPromise = supabase
    .from("posts")
    .select(
      `id, caption, image_url, media_type, audio_url, created_at, user_id, archived_at,
       profiles!posts_user_id_fkey(username, avatar_url),
       likes(user_id),
       comments(id)`,
    )
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .limit(30);

  const followsPromise = user
    ? supabase.from("follows").select("following_id").eq("follower_id", user.id)
    : Promise.resolve({ data: [] as { following_id: string }[] });

  const [{ data: rows }, { data: followRows }] = await Promise.all([
    postsPromise,
    followsPromise,
  ]);

  // Figure out which post authors have an active story and whether the
  // viewer has watched all of them (grey ring) vs has unviewed (colored).
  const authorIds = Array.from(new Set((rows ?? []).map((r) => r.user_id))).filter(Boolean);
  let ringState = new Map<string, "story" | "viewed">();
  if (user && authorIds.length > 0) {
    const followingSet = new Set(
      (followRows ?? []).map((f: { following_id: string }) => f.following_id),
    );
    const visibleAuthors = authorIds.filter(
      (id) => id === user.id || followingSet.has(id),
    );
    if (visibleAuthors.length > 0) {
      ringState = await getStoryRingState(supabase, visibleAuthors, user.id);
    }
  }

  // For brand-new users with empty feeds, surface 5 suggested people to
  // follow (popular accounts they don't already follow).
  let suggestions: { id: string; username: string; full_name: string | null; avatar_url: string | null }[] = [];
  if (user && (rows ?? []).length === 0) {
    const { data: pop } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url")
      .neq("id", user.id)
      .limit(20);
    const followingSet = new Set(
      (followRows ?? []).map((f: { following_id: string }) => f.following_id),
    );
    suggestions = ((pop ?? []) as typeof suggestions)
      .filter((u) => !followingSet.has(u.id))
      .slice(0, 5);
  }

  const posts: FeedPost[] =
    rows?.map((r) => {
      const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
      const likes = (r.likes ?? []) as { user_id: string }[];
      const liked = !!(user && likes.some((l) => l.user_id === user.id));
      return {
        id: r.id,
        caption: r.caption,
        image_url: r.image_url,
        media_type: (r as unknown as { media_type?: "image" | "video" | null }).media_type ?? "image",
        audio_url: (r as unknown as { audio_url?: string | null }).audio_url ?? null,
        created_at: r.created_at,
        author_id: r.user_id,
        author_username: profile?.username ?? "user",
        author_avatar: profile?.avatar_url ?? null,
        author_has_story: ringState.has(r.user_id),
        author_story_viewed: ringState.get(r.user_id) === "viewed",
        liked,
        saved: false,
        likes_count: likes.length,
        comments_count: (r.comments ?? []).length,
        archived: !!(r as unknown as { archived_at?: string | null }).archived_at,
        top_liker: null,
      };
    }) ?? [];

  return (
    <>
      <TopBar
        logo
        left={
          <div className="flex items-center gap-4">
            <Link href="/reels" aria-label="Reels" className="flex items-center">
              <Clapperboard size={26} />
            </Link>
            <Link href="/search" aria-label="Search" className="flex items-center">
              <Search size={24} />
            </Link>
          </div>
        }
        right={<HeaderBadges />}
      />

      <StoriesRail />

      <div className="flex-1">
        {posts.length === 0 ? (
          <div className="py-8 px-6 flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-3">
              <EmptyArt size={120} />
              <h3 className="text-lg font-semibold">Your feed is quiet</h3>
              <p className="text-sm text-white/60 max-w-xs">
                Share something trending to get the party started.
              </p>
              <Link
                href="/new"
                className="mt-1 px-5 h-10 flex items-center rounded-md btn-primary font-semibold text-sm"
              >
                Share your first post
              </Link>
            </div>

            {suggestions.length > 0 && (
              <section className="mt-3">
                <h4 className="text-xs font-bold text-white/80 uppercase tracking-wide mb-2 px-1">
                  People to follow
                </h4>
                <div className="flex flex-col gap-1">
                  {suggestions.map((u) => (
                    <Link
                      key={u.id}
                      href={`/u/${u.username}`}
                      className="flex items-center gap-3 py-2 px-1 rounded-md hover:bg-white/5"
                    >
                      <Avatar username={u.username} avatarUrl={u.avatar_url} size={44} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{u.full_name ?? u.username}</div>
                        <div className="text-xs text-white/55 truncate">@{u.username}</div>
                      </div>
                      <span className="text-xs font-semibold text-[color:var(--color-primary)]">View</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} currentUserId={user?.id ?? null} />)
        )}
      </div>
    </>
  );
}
