import { getSupabase } from "@/lib/supabase/server";
import { computeTargets } from "@/lib/nutrition";
import { PROFILE_ID } from "@/db/queries/profile";
import { SETTINGS_ID, DEFAULT_SETTINGS } from "@/db/queries/settings";
import { rowToProfile, rowToSettings, type UserProfileRow, type UserSettingsRow } from "@/db/types";

export async function getTargetCalories(): Promise<number> {
  const db = getSupabase();
  const [{ data: profileRow }, { data: settingsRow }] = await Promise.all([
    db.from("user_profile").select("*").eq("id", PROFILE_ID).maybeSingle(),
    db.from("user_settings").select("*").eq("id", SETTINGS_ID).maybeSingle(),
  ]);

  if (!profileRow) return 2000;
  const profile = rowToProfile(profileRow as UserProfileRow);
  const settings = settingsRow
    ? rowToSettings(settingsRow as UserSettingsRow)
    : { id: SETTINGS_ID, ...DEFAULT_SETTINGS };
  return computeTargets(profile, settings).targetCalories;
}
