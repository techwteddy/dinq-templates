"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FamilyMessage } from "@/lib/database.types";
import { addMessage, deleteMessage } from "@/app/actions";

export default function MessageBoard({
  messages,
  memberName,
  memberRole,
}: {
  messages: FamilyMessage[];
  memberName: string;
  memberRole: "parent" | "kid";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  return (
    <div className="rounded-2xl border-2 border-card-border bg-card p-4 shadow-sm space-y-4">
      <h2 className="text-lg font-bold">Family Board</h2>

      {/* Add message form */}
      <form
        ref={formRef}
        action={async (fd) => {
          await addMessage(fd);
          formRef.current?.reset();
          router.refresh();
        }}
        className="flex gap-2"
      >
        <input type="hidden" name="author" value={memberName} />
        <input
          name="message"
          placeholder="Leave a note for the family..."
          required
          className="flex-1 px-3 py-2 rounded-xl border-2 border-card-border bg-card text-sm focus:border-honey focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-honey text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
        >
          Post
        </button>
      </form>

      {/* Messages list */}
      {messages.length === 0 ? (
        <p className="text-sm text-muted">No messages yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => {
            const canDelete = memberRole === "parent" || msg.author === memberName;

            return (
              <div
                key={msg.id}
                className="flex items-start justify-between gap-2 p-3 rounded-xl bg-background/50 border border-card-border"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{msg.author}</span>
                    <TimeAgo dateStr={msg.created_at} />
                    {msg.pinned && <span className="text-xs">📌</span>}
                  </div>
                  <p className="text-sm mt-0.5 whitespace-pre-wrap">{msg.message}</p>
                </div>
                {canDelete && (
                  <form
                    action={async (fd) => {
                      await deleteMessage(fd);
                      router.refresh();
                    }}
                    className="shrink-0"
                  >
                    <input type="hidden" name="id" value={msg.id} />
                    <button
                      type="submit"
                      className="text-muted hover:text-rose text-sm transition-colors"
                    >
                      ×
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TimeAgo({ dateStr }: { dateStr: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(formatTimeAgo(dateStr));
    const interval = setInterval(() => setText(formatTimeAgo(dateStr)), 60000);
    return () => clearInterval(interval);
  }, [dateStr]);

  if (!text) return null;

  return <span className="text-xs text-muted">{text}</span>;
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString();
}
