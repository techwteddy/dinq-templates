"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/notes/note-card";
import { DeleteNoteDialog } from "@/components/notes/delete-note-dialog";
import type { Note } from "@/types";

interface NotesListProps {
  notes: Note[];
}

export function NotesList({ notes: initialNotes }: NotesListProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);

  const handleDelete = useCallback(
    async (noteId: string) => {
      const noteToDelete = notes.find((n) => n.id === noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));

      const supabase = createClient();
      const { error } = await supabase.from("notes").delete().eq("id", noteId);

      if (error) {
        if (noteToDelete) {
          setNotes((prev) => [...prev, noteToDelete].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ));
        }
        toast.error("Failed to delete note", { description: error.message });
        return;
      }

      toast.success("Note deleted");
      router.refresh();
    },
    [notes, router]
  );

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="text-4xl">📝</div>
        <h3 className="text-lg font-medium">No notes yet</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Start capturing your thoughts by creating your first voice note.
        </p>
        <Link href="/notes/new">
          <Button>
            <PlusIcon />
            New Note
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </p>
        <Link href="/notes/new">
          <Button>
            <PlusIcon />
            New Note
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map((note) => (
          <div key={note.id} className="relative">
            <NoteCard note={note} />
            <div className="absolute right-3 bottom-3">
              <DeleteNoteDialog
                noteId={note.id}
                noteTitle={note.title}
                onDelete={handleDelete}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
