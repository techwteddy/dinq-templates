import Link from "next/link";
import Image from "next/image";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import { timeAgo } from "@/lib/utils";
import { FollowButton } from "@/components/FollowButton";

export const dynamic = "force-dynamic";

export default async function LikesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = tab === "following" ? "following" : "you";
  const [user, supabase] = await Promise.all([getCachedUser(), createClient()]);

  // Notifications + follows fan out in parallel — both keyed only on user.id.
  const [{ data: notifs }, { data: followingRows }] = await Promise.all([
    supabase
      .from("notifications")
      .select(
        "id, type, content, created_at, post_id, actor_id, profiles!notifications_actor_id_fkey(username, avatar_url), posts!notifications_post_id_fkey(image_url, media_type)",
      )
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user!.id),
  ]);
  const followedIds = (followingRows ?? []).map((r) => r.following_id);

  // Kick off the read-side queries while we mark notifications as read in
  // parallel — the mark-as-read write is fire-and-forget for the page.
  const markReadPromise = supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user!.id)
    .eq("is_read", false);

  const { data: followedLikes } = followedIds.length
    ? await supabase
        .from("likes")
        .select(
          "id, created_at, user_id, profiles!likes_user_id_fkey(username, avatar_url), posts!likes_post_id_fkey(id, image_url, media_type, profiles!posts_user_id_fkey(username))",
        )
        .in("user_id", followedIds)
        .order("created_at", { ascending: false })
        .limit(40)
    : { data: [] };

  await markReadPromise;

  // Whether I follow a given actor (for Follow button)
  const meFollowingSet = new Set(followedIds);

  return (
    <>
      <header className="h-12 flex items-center">
        <Link
          href="/likes?tab=following"
          className={`flex-1 text-center py-3 text-base ${
            active === "following" ? "font-semibold border-b-2 border-white" : "text-white/60"
          }`}
        >
          Following
        </Link>
        <Link
          href="/likes?tab=you"
          className={`flex-1 text-center py-3 text-base ${
            active === "you" ? "font-semibold border-b-2 border-white" : "text-white/60"
          }`}
        >
          You
        </Link>
      </header>

      {active === "you" ? (
        <div className="flex-1 overflow-y-auto">
          {(() => {
            // Group consecutive same-type, same-post notifications so we render
            // "Sarah and 4 others liked your post." instead of 5 separate rows.
            type N = (typeof notifs)[number] & {
              profiles?: unknown;
              posts?: unknown;
              type?: string;
              actor_id?: string;
              post_id?: string | null;
              content?: string | null;
            };
            const list = (notifs ?? []) as N[];
            type Group = {
              key: string;
              type: string;
              postId: string | null;
              firstActor: { username: string; avatar_url: string | null } | null;
              firstActorId: string;
              othersCount: number;
              latestAt: string | null;
              post: { image_url?: string; media_type?: string | null } | null;
              content?: string | null;
            };
            const groups: Group[] = [];
            for (const n of list) {
              const actor = (Array.isArray(n.profiles) ? n.profiles[0] : n.profiles) as
                | { username: string; avatar_url: string | null }
                | null;
              const post = (Array.isArray(n.posts) ? n.posts[0] : n.posts) as
                | { image_url?: string; media_type?: string | null }
                | null;
              if (!actor) continue;
              const last = groups[groups.length - 1];
              const groupable = n.type === "like" || n.type === "follow";
              if (
                last &&
                groupable &&
                last.type === n.type &&
                last.postId === (n.post_id ?? null)
              ) {
                last.othersCount += 1;
                continue;
              }
              groups.push({
                key: n.id as string,
                type: n.type ?? "",
                postId: (n.post_id ?? null) as string | null,
                firstActor: actor,
                firstActorId: n.actor_id as string,
                othersCount: 0,
                latestAt: (n.created_at ?? null) as string | null,
                post,
                content: n.content ?? null,
              });
            }
            if (groups.length === 0) {
              return (
                <div className="text-center text-white/50 py-10 text-sm">No activity yet.</div>
              );
            }
            return groups.map((g) => {
              const actor = g.firstActor;
              if (!actor) return null;
              const verb =
                g.type === "like"
                  ? "liked your photo."
                  : g.type === "follow"
                  ? "started following you."
                  : g.type === "story_like"
                  ? "liked your story."
                  : g.type === "story_react"
                  ? `reacted ${g.content ?? ""} to your story.`
                  : g.type === "comment"
                  ? `commented: ${g.content ?? ""}`
                  : "";
              return (
                <div key={g.key} className="flex items-center gap-3 px-3 py-2">
                  <Avatar username={actor.username} avatarUrl={actor.avatar_url} size={40} />
                  <div className="flex-1 text-sm">
                    <Link href={`/u/${actor.username}`} className="font-semibold">
                      {actor.username}
                    </Link>{" "}
                    {g.othersCount > 0 ? (
                      <span>
                        and {g.othersCount} {g.othersCount === 1 ? "other" : "others"} {verb}
                      </span>
                    ) : (
                      <span>{verb}</span>
                    )}{" "}
                    <span className="text-white/50">{timeAgo(g.latestAt)}</span>
                  </div>
                  {g.post?.image_url ? (
                    <div className="relative w-10 h-10 overflow-hidden bg-neutral-900">
                      {g.post.media_type === "video" ? (
                        <video
                          src={g.post.image_url}
                          muted
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <Image src={g.post.image_url} alt="" fill sizes="40px" className="object-cover" unoptimized />
                      )}
                    </div>
                  ) : g.type === "follow" && !meFollowingSet.has(g.firstActorId) ? (
                    <FollowButton targetId={g.firstActorId} initiallyFollowing={false} />
                  ) : null}
                </div>
              );
            });
          })()}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {(followedLikes ?? []).map((l) => {
            const actor = Array.isArray(l.profiles) ? l.profiles[0] : l.profiles;
            const post = Array.isArray(l.posts) ? l.posts[0] : l.posts;
            if (!actor || !post) return null;
            const postAuthor =
              post.profiles && (Array.isArray(post.profiles) ? post.profiles[0] : post.profiles);
            return (
              <div key={l.id} className="flex items-center gap-3 px-3 py-2">
                <Avatar username={actor.username} avatarUrl={actor.avatar_url} size={40} />
                <div className="flex-1 text-sm">
                  <Link href={`/u/${actor.username}`} className="font-semibold">
                    {actor.username}
                  </Link>{" "}
                  liked <span className="font-semibold">{postAuthor?.username}</span>
                  &apos;s photo. <span className="text-white/50">{timeAgo(l.created_at)}</span>
                </div>
                <div className="relative w-10 h-10 overflow-hidden bg-neutral-900">
                  {(post as unknown as { media_type?: string | null }).media_type === "video" ? (
                    <video
                      src={post.image_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image src={post.image_url} alt="" fill sizes="40px" className="object-cover" unoptimized />
                  )}
                </div>
              </div>
            );
          })}
          {(followedLikes ?? []).length === 0 && (
            <div className="text-center text-white/50 py-10 text-sm">Follow people to see their activity.</div>
          )}
        </div>
      )}
    </>
  );
}
