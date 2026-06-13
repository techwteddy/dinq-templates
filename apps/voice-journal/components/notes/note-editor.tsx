"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import type { Note } from "@/types";

interface NoteEditorProps {
  note?: Note;
  userId: string;
}

export function NoteEditor({ note, userId }: NoteEditorProps) {
  const router = useRouter();
  const isEditing = !!note;

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [language, setLanguage] = useState<"en" | "ur">(
    note?.language ?? "en"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const hasChanges =
    title !== (note?.title ?? "") ||
    content !== (note?.content ?? "") ||
    language !== (note?.language ?? "en") ||
    audioBlob !== null;

  useEffect(() => {
    if (!hasChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const handleTranscript = useCallback((text: string) => {
    setContent((prev) => {
      if (!prev) return text;
      return prev + " " + text;
    });
  }, []);

  const handleRecordingComplete = useCallback((blob: Blob | null) => {
    setAudioBlob(blob);
  }, []);

  async function uploadAudio(noteId: string): Promise<string | null> {
    if (!audioBlob) return null;

    const supabase = createClient();
    const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
    const filePath = `${userId}/${noteId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("audio-recordings")
      .upload(filePath, audioBlob, {
        contentType: audioBlob.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Audio upload failed:", uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("audio-recordings")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  async function handleSave() {
    setIsSaving(true);

    const supabase = createClient();
    let noteId = note?.id;

    if (isEditing) {
      const { error: updateError } = await supabase
        .from("notes")
        .update({
          title: title || null,
          content,
          language,
          updated_at: new Date().toISOString(),
        })
        .eq("id", note.id);

      if (updateError) {
        toast.error("Failed to update note", { description: updateError.message });
        setIsSaving(false);
        return;
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("notes")
        .insert({
          user_id: userId,
          title: title || null,
          content,
          language,
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        toast.error("Failed to create note", { description: insertError?.message });
        setIsSaving(false);
        return;
      }
      noteId = inserted.id;
    }

    if (audioBlob && noteId) {
      const audioUrl = await uploadAudio(noteId);
      if (audioUrl) {
        await supabase
          .from("notes")
          .update({ audio_url: audioUrl })
          .eq("id", noteId);
      }
    }

    toast.success(isEditing ? "Note updated" : "Note saved");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Untitled note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <div className="flex gap-1 rounded-lg border border-input p-1">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                language === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage("ur")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                language === "ur"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              اردو
            </button>
          </div>
        </div>
      </div>

      <VoiceRecorder
        language={language}
        onTranscript={handleTranscript}
        onRecordingComplete={handleRecordingComplete}
        disabled={isSaving}
      />

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder={
            language === "ur"
              ? "یہاں اپنے خیالات لکھیں..."
              : "Write your thoughts here..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          dir={language === "ur" ? "rtl" : "ltr"}
          className={`min-h-75 ${language === "ur" ? "font-urdu text-lg leading-relaxed" : ""}`}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : isEditing
              ? "Update Note"
              : "Save Note"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (hasChanges) {
              if (window.confirm("You have unsaved changes. Discard them?")) {
                router.push("/dashboard");
              }
            } else {
              router.push("/dashboard");
            }
          }}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
