/**
 * Queries CRUD para `user_settings`.
 *
 * Al igual que user_profile, es un registro único.
 */

import { supabase } from "@/db/supabase";
import {
  UserSettings,
  UserSettingsRow,
  settingsToRow,
  rowToSettings,
} from "@/db/types";

/** ID fijo de la única configuración de la app. */
export const SETTINGS_ID = "00000000-0000-0000-0000-000000000002";

/** Valores por defecto aplicados en el primer uso. */
export const DEFAULT_SETTINGS: Omit<UserSettings, "id"> = {
  weightUnit: "kg",
  heightUnit: "cm",
  macroPct: { protein: 30, fat: 30, carbs: 40 },
  maxDeficitKcal: 500,
  maxSurplusKcal: 300,
  minCaloriesKcal: 1200,
  notificationsEnabled: false,
};

// ─── Read ──────────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<UserSettings> {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  if (error) throw new Error(`getSettings: ${error.message}`);

  // Si no existe aún, devolvemos defaults (se crearán al primer upsert)
  if (!data) {
    return { id: SETTINGS_ID, ...DEFAULT_SETTINGS };
  }

  return rowToSettings(data as UserSettingsRow);
}

// ─── Upsert ────────────────────────────────────────────────────────────────────

export async function upsertSettings(
  settings: Omit<UserSettings, "id">
): Promise<UserSettings> {
  const row = settingsToRow({ ...settings, id: SETTINGS_ID });

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(`upsertSettings: ${error.message}`);

  return rowToSettings(data as UserSettingsRow);
}
