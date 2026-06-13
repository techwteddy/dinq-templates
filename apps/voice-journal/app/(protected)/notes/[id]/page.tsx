import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteEditor } from "@/components/notes/note-editor";
import type { Note } from "@/types";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: NotePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !note) {
    notFound();
  }

  const typedNote = note as Note;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Note</h2>
        <p className="mt-1 text-muted-foreground">
          Update your journal entry.
        </p>
      </div>
      <NoteEditor note={typedNote} userId={user!.id} />
    </div>
  );
}
