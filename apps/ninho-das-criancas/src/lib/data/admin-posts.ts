export { ADMIN_POST_CATEGORIES as POST_CATEGORIES } from "@/lib/constants/admin-post-categories";

import { getSupabaseServer } from "@/lib/supabase/supabase-server-optional";
import type { Post } from "@/lib/types/post";

export async function listAllPostsForAdmin(): Promise<Post[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data as Post[];
}

export async function getPostByIdForAdmin(id: string): Promise<Post | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Post;
}

