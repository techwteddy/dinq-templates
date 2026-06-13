import { createClient } from "@/lib/supabase/server";
import { NoteEditor } from "@/components/notes/note-editor";

export default async function NewNotePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">New Note</h2>
        <p className="mt-1 text-muted-foreground">
          Create a new journal entry.
        </p>
      </div>
      <NoteEditor userId={user!.id} />
    </div>
  );
}
