import Link from "next/link";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import { getStoryRingState } from "@/lib/stories";

export async function StoriesRail() {
  const user = await getCachedUser();
  const supabase = await createClient();

  // Two independent queries up front: (a) my own profile chip, (b) who I follow.
  const meProfilePromise = user
    ? supabase.from("profiles").select("username, avatar_url").eq("id", user.id).single()
    : Promise.resolve({ data: null });

  const followsPromise = user
    ? supabase.from("follows").select("following_id").eq("follower_id", user.id)
    : Promise.resolve({ data: [] as { following_id: string }[] });

  const [{ data: me }, { data: following }] = await Promise.all([
    meProfilePromise,
    followsPromise,
  ]);

  // Followers-only visibility: include self + accounts the current user follows.
  const visibleIds: string[] = user
    ? [user.id, ...(following ?? []).map((f) => f.following_id)]
    : [];

  const now = new Date().toISOString();
  const { data: stories } = user && visibleIds.length > 0
    ? await supabase
        .from("stories")
        .select("user_id, created_at, profiles!stories_user_id_fkey(username, avatar_url)")
        .in("user_id", visibleIds)
        .gt("expires_at", now)
        .order("created_at", { ascending: false })
    : { data: [] as null };

  // Deduplicate by user_id (first occurrence wins), with self first.
  const seen = new Set<string>();
  const all = (stories ?? []).filter((s) => {
    if (seen.has(s.user_id)) return false;
    seen.add(s.user_id);
    return true;
  });
  const mine = all.filter((s) => user && s.user_id === user.id);
  const others = all.filter((s) => !(user && s.user_id === user.id));
  const unique = [...mine, ...others];

  // Per-author viewed state for the ring color.
  const ringState = await getStoryRingState(
    supabase,
    unique.map((s) => s.user_id),
    user?.id,
  );

  return (
    <div className="border-b border-[color:var(--color-border)]">
      <div className="flex gap-3 px-3 py-3 overflow-x-auto no-scrollbar">
        <Link href="/stories/new" className="flex flex-col items-center gap-1 w-[68px]">
          <div className="relative">
            <Avatar username={me?.username ?? "me"} avatarUrl={me?.avatar_url ?? null} size={64} />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[color:var(--color-primary)] text-white text-lg leading-none flex items-center justify-center border-2 border-black">
              +
            </span>
          </div>
          <span className="text-[11px] text-white/80 truncate w-full text-center">Your Story</span>
        </Link>

        {unique.map((s) => {
          const p = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
          if (!p) return null;
          return (
            <Link
              key={s.user_id}
              href={`/stories/${s.user_id}`}
              className="story-chip"
            >
              <div className="relative">
                <Avatar
                  username={p.username}
                  avatarUrl={p.avatar_url}
                  size={64}
                  ring={ringState.get(s.user_id) ?? "story"}
                />
                {(ringState.get(s.user_id) ?? "story") === "story" && (
                  <span className="story-sparkle" aria-hidden>✨</span>
                )}
              </div>
              <span className="text-[11px] text-white/80 truncate w-full text-center">
                {p.username}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
