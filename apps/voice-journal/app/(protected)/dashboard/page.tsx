import { createClient } from "@/lib/supabase/server";
import { NotesList } from "@/components/notes/notes-list";
import type { Note } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  const notes: Note[] = error ? [] : (data ?? []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Your Journal</h2>
        <p className="mt-1 text-muted-foreground">
          All your voice notes in one place.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load notes. Please try refreshing the page.
        </div>
      )}

      <NotesList notes={notes} />
    </div>
  );
}
