import { requireAuth } from "@/lib/supabase-server";
import type { Chore, ChoreScheduleEntry } from "@/lib/database.types";
import ChoresList from "@/components/chores/ChoresList";
import ChoreScheduleTable from "@/components/chores/ChoreScheduleTable";
import PushSubscribeButton from "@/components/chores/PushSubscribeButton";

function computeStreaks(entries: ChoreScheduleEntry[], kids: string[]): Record<string, number> {
  const streaks: Record<string, number> = {};

  for (const kid of kids) {
    const kidEntries = entries.filter((e) => e.kid_name === kid);
    if (kidEntries.length === 0) {
      streaks[kid] = 0;
      continue;
    }

    let streak = 0;
    const now = new Date();
    // Start from yesterday (today might not be done yet)
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() - 1);

    for (let d = 0; d < 60; d++) {
      const dayOfWeek = checkDate.getDay();
      const dateStr = checkDate.toISOString().slice(0, 10);

      // Get scheduled chores for this day of week
      const scheduled = kidEntries.filter((e) => e.day_of_week === dayOfWeek);
      if (scheduled.length === 0) {
        // No chores scheduled this day — skip
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }

      // Check if ALL scheduled chores were completed on this date
      const allDone = scheduled.every((e) => {
        if (!e.last_completed) return false;
        const completedDate = new Date(e.last_completed).toISOString().slice(0, 10);
        return completedDate === dateStr;
      });

      if (allDone) {
        streak++;
      } else {
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    streaks[kid] = streak;
  }

  return streaks;
}

export default async function ChoresPage() {
  const supabase = await requireAuth();

  const [{ data: chores }, { data: schedule }, { data: kidMembers }, { data: allMembers }] = await Promise.all([
    supabase.from("chores").select("id, name, frequency, assignee, last_completed").order("created_at", { ascending: true }),
    supabase.from("chore_schedule").select("id, kid_name, chore_name, day_of_week, time_of_day, last_completed").order("created_at", { ascending: true }),
    supabase.from("family_members").select("name").eq("role", "kid").order("name"),
    supabase.from("family_members").select("name").order("name"),
  ]);

  const kids = kidMembers?.map((m) => m.name) ?? [];
  const members = allMembers?.map((m) => m.name) ?? [];
  const scheduleEntries = (schedule as ChoreScheduleEntry[]) ?? [];
  const streaks = computeStreaks(scheduleEntries, kids);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Chores</h1>
      <ChoresList chores={(chores as Chore[]) ?? []} today={new Date().toISOString().slice(0, 10)} members={members} />

      <div className="mt-10 pt-8 border-t-2 border-card-border space-y-4">
        <ChoreScheduleTable entries={scheduleEntries} streaks={streaks} today={new Date().toISOString().slice(0, 10)} kids={kids} />
        <PushSubscribeButton members={members} />
      </div>
    </>
  );
}
