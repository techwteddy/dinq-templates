"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Avatar } from "@/components/Avatar";
import { respondToConnection } from "@/app/actions";

export type RequestRow = {
  id: string;
  requester_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  intro_message: string | null;
  match_score: number | null;
  created_at: string | null;
};

export function ConnectionRequestRow({ req }: { req: RequestRow }) {
  const [resolved, setResolved] = useState<"accepted" | "declined" | null>(null);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const act = (accept: boolean) => {
    setErr(null);
    start(async () => {
      const res = await respondToConnection(req.id, accept);
      if (res && "error" in res && res.error) {
        setErr(res.error);
      } else {
        setResolved(accept ? "accepted" : "declined");
      }
    });
  };

  if (resolved) {
    return (
      <div className="flex items-center gap-3 px-3 py-3 border-b border-[color:var(--color-border)]">
        <Avatar username={req.username} avatarUrl={req.avatar_url} size={44} />
        <div className="flex-1 text-sm">
          <span className="font-semibold">@{req.username}</span>
          <span className="text-white/60">
            {resolved === "accepted" ? " is now in your network." : " declined."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 px-3 py-3 border-b border-[color:var(--color-border)]">
      <Link href={`/u/${req.username}`} className="flex-shrink-0">
        <Avatar username={req.username} avatarUrl={req.avatar_url} size={44} />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/u/${req.username}`}
            className="font-semibold text-sm truncate hover:underline"
          >
            {req.full_name ?? req.username}
          </Link>
          {typeof req.match_score === "number" && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[color:var(--color-primary)]/90 text-white">
              {req.match_score}%
            </span>
          )}
        </div>
        <p className="text-xs text-white/50 truncate">@{req.username}</p>
        {req.intro_message && (
          <p className="mt-1 text-xs text-white/80 whitespace-pre-line">
            &ldquo;{req.intro_message}&rdquo;
          </p>
        )}
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => act(true)}
            disabled={pending}
            className="h-8 px-4 rounded-md text-xs font-semibold bg-[color:var(--color-primary)] text-white disabled:opacity-50"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => act(false)}
            disabled={pending}
            className="h-8 px-4 rounded-md text-xs font-medium bg-white/5 border border-white/15 text-white/80 disabled:opacity-50"
          >
            Decline
          </button>
        </div>
        {err && (
          <p className="mt-1 text-[10px] text-[color:var(--color-danger)]">{err}</p>
        )}
      </div>
    </div>
  );
}
