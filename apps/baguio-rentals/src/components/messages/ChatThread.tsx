"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markAsRead } from "@/app/messages/actions";
import { timeAgo } from "@/lib/utils/format";
import type { Message } from "@/lib/types/database";

export function ChatThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  // Subscribe to new messages via Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          // Skip realtime messages from self — we already have the optimistic version
          if (newMsg.sender_id === currentUserId) return;
          // Message from other user — append if not already present
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setHasUnread(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId, supabase]);

  // Scroll to bottom on new messages (within container only)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const content = input.trim();
    setInput("");
    setSending(true);

    // Optimistic insert
    const optimistic: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
      read_at: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    await sendMessage(conversationId, content);
    setSending(false);
  };

  return (
    <>
      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist">
              <svg className="h-7 w-7 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-pine">No messages yet</p>
            <p className="mt-1 text-sm text-bark-light">Start the conversation!</p>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    isMe
                      ? "bg-pine text-cream rounded-br-md"
                      : "bg-warm-white text-bark border border-stone/60 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMe ? "text-stone-dark/70" : "text-bark-light"
                    }`}
                  >
                    {timeAgo(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
          <div />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-stone/60 bg-warm-white px-4 py-3"
      >
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (hasUnread) {
              setHasUnread(false);
              markAsRead(conversationId);
            }
          }}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-stone/60 bg-cream px-4 py-2.5 text-sm text-bark placeholder:text-bark-light/50 focus:border-pine-muted focus:outline-none focus:ring-1 focus:ring-pine-muted transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine text-amber shadow-md shadow-pine/20 hover:bg-pine-light disabled:opacity-40 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </>
  );
}
