"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils/format";

type ConversationMeta = {
  id: string;
  renter_id: string;
  owner_id: string;
  listings: { id: string; title: string };
  renter: { id: string; full_name: string; avatar_url: string | null };
  owner: { id: string; full_name: string; avatar_url: string | null };
  lastMessage: { content: string; created_at: string; sender_id: string } | null;
  unreadCount: number;
};

export function ConversationList({
  conversations: initialConversations,
  currentUserId,
  activeConversationId,
}: {
  conversations: ConversationMeta[];
  currentUserId: string;
  activeConversationId?: string;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const supabase = useMemo(() => createClient(), []);

  // Subscribe to all message inserts to update last message & unread counts
  useEffect(() => {
    const channel = supabase
      .channel("conversation-list-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as {
            id: string;
            conversation_id: string;
            sender_id: string;
            content: string;
            created_at: string;
            read_at: string | null;
          };

          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id !== msg.conversation_id) return conv;
              const isUnread = msg.sender_id !== currentUserId;
              return {
                ...conv,
                lastMessage: {
                  content: msg.content,
                  created_at: msg.created_at,
                  sender_id: msg.sender_id,
                },
                unreadCount: isUnread ? conv.unreadCount + 1 : conv.unreadCount,
              };
            })
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as { conversation_id: string; sender_id: string; read_at: string | null };
          const old = payload.old as { read_at: string | null };
          // Decrement when messages are marked as read
          if (msg.sender_id !== currentUserId && !old.read_at && msg.read_at) {
            setConversations((prev) =>
              prev.map((conv) => {
                if (conv.id !== msg.conversation_id) return conv;
                return { ...conv, unreadCount: Math.max(0, conv.unreadCount - 1) };
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, supabase]);

  const otherPerson = (conv: ConversationMeta) =>
    conv.renter_id === currentUserId ? conv.owner : conv.renter;

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist">
          <svg className="h-7 w-7 text-bark-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-pine">No conversations yet</p>
        <p className="mt-1 text-sm text-bark-light">Browse listings to start a conversation</p>
        <Link
          href="/listings"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-amber hover:bg-pine-light transition-colors"
        >
          Browse Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone/60">
      {conversations.map((conv) => {
        const other = otherPerson(conv);
        const listing = conv.listings;
        const isActive = conv.id === activeConversationId;

        return (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-mist/50 ${
              isActive ? "bg-mist" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {other.avatar_url ? (
                <img
                  src={other.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-stone/40"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pine text-sm font-semibold text-amber ring-2 ring-stone/40">
                  {other.full_name[0]}
                </div>
              )}
              {conv.unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-pine shadow-sm">
                  {conv.unreadCount}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`truncate text-sm ${conv.unreadCount > 0 ? "font-bold text-pine" : "font-semibold text-bark"}`}>
                  {other.full_name}
                </p>
                {conv.lastMessage && (
                  <span className="shrink-0 text-[10px] text-bark-light">
                    {timeAgo(conv.lastMessage.created_at)}
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-pine-muted">{listing.title}</p>
              {conv.lastMessage && (
                <p className={`mt-0.5 truncate text-xs ${conv.unreadCount > 0 ? "font-medium text-bark" : "text-bark-light"}`}>
                  {conv.lastMessage.sender_id === currentUserId ? "You: " : ""}
                  {conv.lastMessage.content}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
