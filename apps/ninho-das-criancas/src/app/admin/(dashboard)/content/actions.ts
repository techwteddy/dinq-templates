"use server";

import { revalidatePath } from "next/cache";

import {
  DONATE_FIELD_TO_DB_KEY,
  type DonateContentField,
} from "@/lib/constants/donate-page-content-keys";
import { getSupabaseServer } from "@/lib/supabase/supabase-server-optional";

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

type SaveDonateContentState = { error?: string; ok?: boolean };

export async function saveDonateSiteContentAction(
  _prev: SaveDonateContentState,
  formData: FormData
): Promise<SaveDonateContentState> {
  const auth = await requireSupabase();
  if (auth.error || !auth.supabase) return { error: auth.error ?? "인증 오류" };

  const rows: { key: string; value: string }[] = [];

  for (const field of Object.keys(DONATE_FIELD_TO_DB_KEY) as DonateContentField[]) {
    const dbKey = DONATE_FIELD_TO_DB_KEY[field];
    const raw = formData.get(field)?.toString() ?? "";
    const value = field === "externalUrl" ? raw.trim() : raw;
    rows.push({ key: dbKey, value });
  }

  const { error } = await auth.supabase.from("site_content").upsert(rows, {
    onConflict: "key",
  });

  if (error) return { error: error.message };

  revalidatePath("/donate");
  revalidatePath("/admin/content");
  return { ok: true };
}
