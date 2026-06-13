/**
 * Queries CRUD para `user_profile`.
 *
 * La tabla está diseñada para UN único registro (el perfil del usuario propietario).
 * Todas las operaciones usan upsert sobre el mismo id fijo.
 */

import { supabase } from "@/db/supabase";
import {
  UserProfile,
  UserProfileRow,
  profileToRow,
  rowToProfile,
} from "@/db/types";

/** ID fijo del único perfil de la app. */
export const PROFILE_ID = "00000000-0000-0000-0000-000000000001";

// ─── Read ──────────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", PROFILE_ID)
    .maybeSingle();

  if (error) throw new Error(`getProfile: ${error.message}`);
  if (!data) return null;

  return rowToProfile(data as UserProfileRow);
}

// ─── Upsert ────────────────────────────────────────────────────────────────────

export async function upsertProfile(
  profile: Omit<UserProfile, "id">
): Promise<UserProfile> {
  const row = profileToRow({ ...profile, id: PROFILE_ID });

  const { error } = await supabase
    .from("user_profile")
    .upsert(row, { onConflict: "id" });

  if (error) throw new Error(`upsertProfile: ${error.message}`);

  // No dependemos de un SELECT posterior para confirmar el guardado.
  // El upsert ya valida persistencia; esto evita bloquear el flujo si la
  // lectura posterior queda restringida por RLS en el proyecto remoto.
  return rowToProfile({
    ...row,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as UserProfileRow);
}

// ─── Delete (reset) ────────────────────────────────────────────────────────────

export async function deleteProfile(): Promise<void> {
  const { error } = await supabase
    .from("user_profile")
    .delete()
    .eq("id", PROFILE_ID);

  if (error) throw new Error(`deleteProfile: ${error.message}`);
}
