import { MOCK_POSTS } from "@/lib/data/mock-posts";
import { getSupabaseServer } from "@/lib/supabase/supabase-server-optional";
import type { Post } from "@/lib/types/post";

function sortByPublishedDesc(a: Post, b: Post) {
  const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
  const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
  return tb - ta;
}

function filterPublished(posts: Post[]) {
  return posts
    .filter((p) => p.status === "published")
    .sort(sortByPublishedDesc);
}

function filterByCategory(posts: Post[], category: string | null) {
  if (!category) return posts;
  return posts.filter((p) => p.category === category);
}

export async function listPublishedPosts(options?: {
  category?: string | null;
  limit?: number;
}): Promise<Post[]> {
  const { category = null, limit } = options ?? {};
  const supabase = getSupabaseServer();

  if (supabase) {
    let query = supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (category) {
      query = query.eq("category", category);
    }

    if (limit != null) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (!error && data != null) {
      return data as Post[];
    }
  }

  let list = filterPublished([...MOCK_POSTS]);
  list = filterByCategory(list, category);
  if (limit != null) list = list.slice(0, limit);
  return list;
}

export async function getLatestPublishedPosts(limit: number): Promise<Post[]> {
  return listPublishedPosts({ limit });
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<Post | null> {
  const supabase = getSupabaseServer();

  if (supabase) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error) {
      if (data) return data as Post;
      return null;
    }
  }

  const found = MOCK_POSTS.find(
    (p) => p.slug === slug && p.status === "published"
  );
  return found ?? null;
}

export async function listRelatedPosts(
  currentSlug: string,
  category: string | null,
  limit = 2
): Promise<Post[]> {
  const all = await listPublishedPosts({});
  const others = all.filter((p) => p.slug !== currentSlug);
  const sameCat = others.filter((p) => p.category && p.category === category);
  const pool = sameCat.length >= limit ? sameCat : others;
  return pool.slice(0, limit);
}
