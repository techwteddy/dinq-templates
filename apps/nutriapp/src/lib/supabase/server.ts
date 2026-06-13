// src/lib/supabase/server.ts
// ─────────────────────────────────────────────────────────────
// Returns a typed Supabase client for server-side use (Route Handlers,
// Server Components, Server Actions).
// Requires: @supabase/supabase-js
// ─────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Simple singleton — safe for Next.js server environment
let _client: SupabaseClient<any> | null = null;

export function getSupabase() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only key

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  _client = createClient<any>(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}
