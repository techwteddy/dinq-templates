import { createClient } from "@/lib/supabase/server";
import type { Recurrence } from "@/types/database";

export async function listRecurrences(): Promise<Recurrence[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recurrences")
    .select("*")
    .order("active", { ascending: false })
    .order("next_run", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Recurrence[];
}
