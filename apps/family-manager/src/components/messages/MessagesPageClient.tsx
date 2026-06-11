"use client";

import { useRef, useEffect, useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FamilyMessage } from "@/lib/database.types";
import { addMessage } from "@/app/actions";

type Channel = "family" | "parents";

export default function MessagesPageClient({
  messages,
  memberName,
  memberRole,
}: {
  messages: FamilyMessage[];
  memberName: string;
  memberRole: "parent" | "kid";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [activeChannel, setActiveChannel] = useState<Channel>("family");

  // Optimistic messages — show new message instantly
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, newMsg: FamilyMessage) => [...current, newMsg]
  );

  // Filter by active channel
  const channelMessages = optimisticMessages.filter(
    (m) => m.channel === activeChannel
  );

  const pinnedMessages = channelMessages.filter((m) => m.pinned);
  const regularMessages = channelMessages.filter((m) => !m.pinned);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [regularMessages.length, activeChannel]);

  // Poll for new messages — 60s when visible, pause when hidden, refresh on return
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    function startPolling() {
      stopPolling();
      interval = setInterval(() => router.refresh(), 60000);
    }

    function stopPolling() {
      if (interval) { clearInterval(interval); interval = null; }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        router.refresh();
        startPolling();
      } else {
        stopPolling();
      }
    }

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [router]);

  const isParent = memberRole === "parent";

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">
      <h1 className="text-2xl font-bold mb-3">Messages</h1>

      {/* Channel tabs — only for parents */}
      {isParent && (
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveChannel("family")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              activeChannel === "family"
                ? "bg-teal text-white shadow-sm"
                : "bg-card border-2 border-card-border hover:border-teal/30"
            }`}
          >
            Family
          </button>
          <button
            onClick={() => setActiveChannel("parents")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              activeChannel === "parents"
                ? "bg-lavender text-white shadow-sm"
                : "bg-card border-2 border-card-border hover:border-lavender/30"
            }`}
          >
            Parents Only
          </button>
        </div>
      )}

      {/* Pinned messages */}
      {pinnedMessages.length > 0 && (
        <div className="space-y-2 mb-3">
          {pinnedMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start justify-between gap-2 p-3 rounded-xl bg-honey/15 border border-honey/40"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs">📌</span>
                  <span className="font-medium text-sm">{msg.author}</span>
                </div>
                <p className="text-sm mt-0.5 whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scrollable messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 mb-3 scroll-smooth"
      >
        {regularMessages.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">
            {activeChannel === "parents"
              ? "No parent messages yet. Start a private conversation!"
              : "No messages yet. Start the conversation!"}
          </p>
        ) : (
          regularMessages.map((msg) => {
            const isOwn = msg.author === memberName;
            const isParentsChannel = activeChannel === "parents";

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    isOwn
                      ? isParentsChannel
                        ? "bg-lavender/15 border border-lavender/40 rounded-br-sm"
                        : "bg-teal/15 border border-teal/40 rounded-br-sm"
                      : "bg-card border border-card-border rounded-bl-sm"
                  }`}
                >
                  {!isOwn && (
                    <span className={`font-medium text-sm block mb-0.5 ${isParentsChannel ? "text-lavender" : "text-teal"}`}>
                      {msg.author}
                    </span>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <div className="mt-1">
                    <TimeAgo dateStr={msg.created_at} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input bar */}
      <form
        ref={formRef}
        action={(fd) => {
          const messageText = fd.get("message") as string;
          startTransition(async () => {
            addOptimistic({
              id: -Date.now(),
              author: memberName,
              message: messageText,
              pinned: false,
              channel: activeChannel,
              created_at: new Date().toISOString(),
            });
            formRef.current?.reset();
            await addMessage(fd);
            router.refresh();
          });
        }}
        className="flex gap-2 pt-2 border-t border-card-border"
      >
        <input type="hidden" name="author" value={memberName} />
        <input type="hidden" name="channel" value={activeChannel} />
        <textarea
          name="message"
          rows={1}
          placeholder={activeChannel === "parents" ? "Private message..." : "Type a message..."}
          required
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          className={`flex-1 px-4 py-3 rounded-2xl border-2 border-card-border bg-card text-sm focus:outline-none transition-colors resize-none ${
            activeChannel === "parents" ? "focus:border-lavender" : "focus:border-teal"
          }`}
        />
        <button
          type="submit"
          className={`px-5 py-3 rounded-2xl text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95 ${
            activeChannel === "parents" ? "bg-lavender" : "bg-teal"
          }`}
        >
          Send
        </button>
      </form>
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
