"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NoteCard({ note }: NoteCardProps) {
  const preview =
    note.content.length > 120
      ? note.content.slice(0, 120) + "..."
      : note.content || "Empty note";

  return (
    <Link href={`/notes/${note.id}`} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1">
              {note.title || "Untitled"}
            </CardTitle>
            <Badge variant="outline" className="shrink-0">
              {note.language === "ur" ? "اردو" : "English"}
            </Badge>
          </div>
          <CardDescription>{formatDate(note.created_at)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p
            className={`line-clamp-2 text-sm text-muted-foreground ${note.language === "ur" ? "font-urdu text-base leading-relaxed" : ""}`}
            dir={note.language === "ur" ? "rtl" : "ltr"}
          >
            {preview}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
