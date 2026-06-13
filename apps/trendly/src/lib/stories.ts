import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type DB = SupabaseClient<Database>;

/**
 * Returns the subset of the given user IDs that currently have at least one
 * non-expired story. Used to decide whether to render the story ring around
 * a profile avatar.
 */
export async function getUsersWithActiveStories(
  supabase: DB,
  userIds: string[],
): Promise<Set<string>> {
  const ids = Array.from(new Set(userIds)).filter(Boolean);
  if (ids.length === 0) return new Set();
  const { data } = await supabase
    .from("stories")
    .select("user_id")
    .in("user_id", ids)
    .gt("expires_at", new Date().toISOString());
  return new Set((data ?? []).map((r: { user_id: string }) => r.user_id));
}

/**
 * Convenience for a single user.
 */
export async function userHasActiveStory(
  supabase: DB,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("stories")
    .select("id")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .limit(1);
  return !!(data && data.length > 0);
}

/**
 * Given a viewer and an author, decide whether the viewer can see the author's
 * story. Matches the server rule in /stories/[userId]/page.tsx: the author can
 * always see their own, and any follower can see the author's story.
 */
export async function canViewStory(
  supabase: DB,
  viewerId: string | null | undefined,
  authorId: string,
): Promise<boolean> {
  if (!viewerId) return false;
  if (viewerId === authorId) return true;
  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", viewerId)
    .eq("following_id", authorId)
    .maybeSingle();
  return !!data;
}

/**
 * Per author with active stories, return whether the given viewer has seen
 * EVERY one of those stories (true → grey "viewed" ring; false → colored
 * "story" ring; missing key → no ring at all).
 */
export async function getStoryRingState(
  supabase: DB,
  authorIds: string[],
  viewerId: string | null | undefined,
): Promise<Map<string, "story" | "viewed">> {
  const ring = new Map<string, "story" | "viewed">();
  const ids = Array.from(new Set(authorIds)).filter(Boolean);
  if (ids.length === 0) return ring;
  const nowIso = new Date().toISOString();
  const { data: stories } = await supabase
    .from("stories")
    .select("id, user_id")
    .in("user_id", ids)
    .gt("expires_at", nowIso);
  type Row = { id: string; user_id: string };
  const rows = (stories ?? []) as Row[];
  if (rows.length === 0) return ring;
  const storiesByAuthor = new Map<string, Set<string>>();
  for (const r of rows) {
    if (!storiesByAuthor.has(r.user_id)) storiesByAuthor.set(r.user_id, new Set());
    storiesByAuthor.get(r.user_id)!.add(r.id);
  }
  if (!viewerId) {
    for (const a of storiesByAuthor.keys()) ring.set(a, "story");
    return ring;
  }
  const allStoryIds = rows.map((r) => r.id);
  const { data: views } = await supabase
    .from("story_views")
    .select("story_id")
    .eq("viewer_id", viewerId)
    .in("story_id", allStoryIds);
  const viewed = new Set((views ?? []).map((v: { story_id: string }) => v.story_id));
  for (const [author, storyIds] of storiesByAuthor) {
    if (author === viewerId) {
      ring.set(author, "story");
      continue;
    }
    let allSeen = true;
    for (const sid of storyIds) {
      if (!viewed.has(sid)) { allSeen = false; break; }
    }
    ring.set(author, allSeen ? "viewed" : "story");
  }
  return ring;
}
