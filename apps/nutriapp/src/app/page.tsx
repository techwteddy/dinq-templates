/**
 * Página raíz — aplica auth single-user y luego decide onboarding/dashboard.
 */
import { redirect } from "next/navigation";
import { PROFILE_ID } from "@/db/queries/profile";
import { createAuthServerClient, getCurrentUser } from "@/lib/supabase/auth";

async function hasProfile(): Promise<boolean> {
  const { data, error } = await createAuthServerClient()
    .from("user_profile")
    .select("id")
    .eq("id", PROFILE_ID)
    .maybeSingle();

  if (error) {
    throw new Error(`hasProfile: ${error.message}`);
  }

  return !!data;
}

export default async function RootPage() {
  /**
   * Modelo elegido: login Supabase sencillo con un único dueño real.
   * La autenticación protege una base single-user; no convierte el dominio
   * en multiusuario ni introduce ownership por fila.
   */
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const profileExists = await hasProfile();

  if (profileExists) {
    redirect("/dashboard");
  } else {
    redirect("/onboarding");
  }
}
