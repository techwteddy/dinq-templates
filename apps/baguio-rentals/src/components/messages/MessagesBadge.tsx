"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function MessagesBadge({
  userId,
  initialCount,
  variant = "icon",
}: {
  userId: string;
  initialCount: number;
  variant?: "icon" | "nav";
}) {
  const [count, setCount] = useState(initialCount);
  const supabase = useMemo(() => createClient(), []);
  const pathname = usePathname();

  const refetchCount = useCallback(() => {
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .neq("sender_id", userId)
      .is("read_at", null)
      .then(({ count: freshCount }) => {
        setCount(freshCount ?? 0);
      });
  }, [userId, supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("navbar-unread")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as { sender_id: string };
          if (msg.sender_id !== userId) {
            setCount((prev) => prev + 1);
          }
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
          const msg = payload.new as { sender_id: string; read_at: string | null };
          const old = payload.old as { read_at: string | null };
          // Decrement when a message is marked as read
          if (msg.sender_id !== userId && !old.read_at && msg.read_at) {
            setCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, refetchCount]);

  // Refetch when navigating to/from messages pages
  useEffect(() => {
    if (pathname.startsWith("/messages")) {
      refetchCount();
    }
  }, [pathname, refetchCount]);

  if (variant === "nav") {
    const isActive = pathname.startsWith("/messages");
    return (
      <Link
        href="/messages"
        className={`relative flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-all ${
          isActive
            ? "text-pine"
            : "text-bark-light hover:text-pine"
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Messages
        {count > 0 && (
          <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-pine">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/messages"
      className="relative rounded-lg p-2 text-bark-light hover:bg-mist hover:text-pine transition-colors"
      title="Messages"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-pine shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
