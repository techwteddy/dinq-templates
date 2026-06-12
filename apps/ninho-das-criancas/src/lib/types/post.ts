export type PostStatus = "draft" | "published" | "hidden";

export function isPostStatus(v: string): v is PostStatus {
  return v === "draft" || v === "published" || v === "hidden";
}

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  summary: string | null;
  category: string | null;
  tags: string[] | null;
  status: PostStatus;
  thumbnail_url: string | null;
  images: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
