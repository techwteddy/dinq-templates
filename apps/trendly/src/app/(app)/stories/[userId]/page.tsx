import { notFound, redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { StoryViewer } from "@/components/StoryViewer";

export const dynamic = "force-dynamic";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getCachedUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  // Followers-only: you can view stories from yourself or people you follow.
  if (user.id !== userId) {
    const { data: f } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user.id)
      .eq("following_id", userId)
      .maybeSingle();
    if (!f) notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) notFound();

  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: true });

  if (!stories || stories.length === 0) notFound();

  // Pull every like for these stories in one round trip, then fold into a
  // map of { storyId: { liked: boolean, count: number } }.
  const storyIds = stories.map((s: { id: string }) => s.id);
  const { data: likeRows } = await supabase
    .from("story_likes")
    .select("story_id, user_id")
    .in("story_id", storyIds);
  const likes: Record<string, { liked: boolean; count: number }> = {};
  for (const id of storyIds) likes[id] = { liked: false, count: 0 };
  for (const r of (likeRows ?? []) as { story_id: string; user_id: string }[]) {
    const e = likes[r.story_id];
    if (!e) continue;
    e.count += 1;
    if (r.user_id === user.id) e.liked = true;
  }

  return (
    <StoryViewer
      author={{
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
      }}
      stories={stories}
      currentUserId={user.id}
      initialLikes={likes}
    />
  );
}
