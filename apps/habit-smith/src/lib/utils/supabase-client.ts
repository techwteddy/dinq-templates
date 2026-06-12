import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env/env";

export const supabaseClient = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co",
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key",
);

// Planned tables:
// users (id, email, created_at)
// profiles (user_id, display_name, username, bio, timezone, reminder_preference, privacy_level)
// habits (id, user_id, title, description, category, frequency, target_count, unit, archived)
// habit_logs (habit_id, date, completed, count, notes)
// friends (user_id, friend_id, created_at)
// subscriptions (user_id, tier, status, billing_cycle, current_period_end)
