"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

import { getSupabaseServer } from "@/lib/supabase/supabase-server-optional";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 5 * 1024 * 1024;

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

export type UploadMediaState = { error?: string; url?: string };

export async function uploadMediaAction(
  _prev: UploadMediaState,
  formData: FormData
): Promise<UploadMediaState> {
  const auth = await requireSupabase();
  if (auth.error || !auth.supabase) return { error: auth.error ?? "인증 오류" };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "이미지 파일을 선택해 주세요." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "파일은 5MB 이하만 업로드할 수 있습니다." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "JPEG, PNG, WebP, GIF만 허용됩니다." };
  }

  const ext = EXT[file.type] ?? "bin";
  const path = `posts/${nanoid(14)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await auth.supabase.storage
    .from("media")
    .upload(path, buf, {
      contentType: file.type,
      upsert: false,
    });

  if (upErr) return { error: upErr.message };

  const { data } = auth.supabase.storage.from("media").getPublicUrl(path);
  revalidatePath("/admin/media");
  return { url: data.publicUrl };
}

export async function deleteMediaObjectAction(
  storagePath: string
): Promise<{ error?: string }> {
  const auth = await requireSupabase();
  if (auth.error || !auth.supabase) return { error: auth.error ?? "인증 오류" };

  if (!storagePath.startsWith("posts/") || storagePath.includes("..")) {
    return { error: "잘못된 경로입니다." };
  }

  const { error } = await auth.supabase.storage
    .from("media")
    .remove([storagePath]);

  if (error) return { error: error.message };

  revalidatePath("/admin/media");
  return {};
}
