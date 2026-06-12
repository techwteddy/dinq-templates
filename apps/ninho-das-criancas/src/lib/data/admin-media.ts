import { getSupabaseServer } from "@/lib/supabase/supabase-server-optional";

export type MediaListItem = {
  path: string;
  name: string;
  publicUrl: string;
  updatedAt: string | null;
};

export async function listMediaPostsForAdmin(): Promise<MediaListItem[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.storage.from("media").list("posts", {
    limit: 100,
    sortBy: { column: "updated_at", order: "desc" },
  });

  if (error || !data) return [];

  return data
    .filter((f) => f.id != null && /\.(jpe?g|png|webp|gif)$/i.test(f.name))
    .map((f) => {
      const path = `posts/${f.name}`;
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      return {
        path,
        name: f.name,
        publicUrl: pub.publicUrl,
        updatedAt: f.updated_at ?? null,
      };
    });
}
