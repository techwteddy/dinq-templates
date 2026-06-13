/**
 * Cliente Supabase.
 *
 * Exporta dos instancias:
 *  - `supabase`  → uso en componentes cliente (browser)
 *  - `createServerClient` → uso en Server Components / Route Handlers (SSR)
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno de Supabase.\n" +
      "Copia .env.example a .env.local y rellena los valores."
  );
}

/**
 * Cliente browser — se puede importar en cualquier "use client" component.
 * Usa la anon key con RLS activo en Supabase.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Re-export para facilitar tipado en queries
export type { SupabaseClient } from "@supabase/supabase-js";
