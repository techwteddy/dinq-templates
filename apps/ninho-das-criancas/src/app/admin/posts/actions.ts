"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

import { getSupabaseServer } from "@/lib/supabase/supabase-server-optional";
import { isPostStatus, type PostStatus } from "@/lib/types/post";

async function requireSupabase() {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return { error: "Supabase가 설정되지 않았습니다.", supabase: null as null };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "로그인이 필요합니다.", supabase: null as null };
  }
  return { error: null as null, supabase };
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseImages(raw: string): string[] | null {
  const arr = raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : null;
}

function normalizeSlug(raw: string, title: string): string {
  const base = (raw.trim() || title.trim()).replace(/\s+/g, "-").slice(0, 120);
  if (!base) return `post-${nanoid(10)}`;
  return base.replace(/[/\\?#]+/g, "").replace(/^-+|-+$/g, "") || `post-${nanoid(10)}`;
}

function parsePublishedAt(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

type SavePostState = { error?: string; ok?: boolean };

export async function savePostAction(
  _prev: SavePostState,
  formData: FormData
): Promise<SavePostState> {
  const auth = await requireSupabase();
  if (auth.error || !auth.supabase) return { error: auth.error ?? "인증 오류" };

  const id = formData.get("id")?.toString().trim() || "";
  const title = formData.get("title")?.toString().trim() ?? "";
  if (!title) return { error: "제목을 입력해 주세요." };

  const slugInput = formData.get("slug")?.toString() ?? "";
  const slug = normalizeSlug(slugInput, title);

  const summary = formData.get("summary")?.toString().trim() || null;
  const content = formData.get("content")?.toString() || null;
  const category = formData.get("category")?.toString().trim() || null;
  const tags = parseTags(formData.get("tags")?.toString() ?? "");
  const statusRaw = formData.get("status")?.toString() ?? "draft";
  if (!isPostStatus(statusRaw)) return { error: "상태 값이 올바르지 않습니다." };
  const status: PostStatus = statusRaw;

  const published_at = parsePublishedAt(
    formData.get("published_at")?.toString() ?? ""
  );
  const thumbnail_url =
    formData.get("thumbnail_url")?.toString().trim() || null;
  const images = parseImages(formData.get("images")?.toString() ?? "");

  const row = {
    title,
    slug,
    summary,
    content,
    category,
    tags: tags.length ? tags : null,
    status,
    thumbnail_url,
    images,
    published_at,
  };

  if (id) {
    const { error } = await auth.supabase
      .from("posts")
      .update(row)
      .eq("id", id);
    if (error) {
      if (error.code === "23505") return { error: "이미 사용 중인 슬러그입니다." };
      return { error: error.message };
    }
  } else {
    const { error } = await auth.supabase.from("posts").insert(row);
    if (error) {
      if (error.code === "23505") return { error: "이미 사용 중인 슬러그입니다." };
      return { error: error.message };
    }
  }

  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/admin/posts");
  return { ok: true };
}

export async function deletePostAction(id: string): Promise<{ error?: string }> {
  const auth = await requireSupabase();
  if (auth.error || !auth.supabase) return { error: auth.error ?? "인증 오류" };

  const { error } = await auth.supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/admin/posts");
  return {};
}

export async function updatePostStatusAction(
  id: string,
  status: string
): Promise<{ error?: string }> {
  const auth = await requireSupabase();
  if (auth.error || !auth.supabase) return { error: auth.error ?? "인증 오류" };
  if (!isPostStatus(status)) return { error: "상태 값이 올바르지 않습니다." };

  const { error } = await auth.supabase
    .from("posts")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/admin/posts");
  return {};
}
