"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, Clock, Sparkles, Flame, ThumbsUp, Compass } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { requestConnection } from "@/app/actions";
import type { MatchCandidate } from "@/lib/matching";
import { ConnectModal } from "@/components/ConnectModal";

const LABEL_META: Record<
  MatchCandidate["label"],
  { text: string; icon: React.ReactNode; className: string }
> = {
  perfect: {
    text: "Perfect Match",
    icon: <Flame size={14} />,
    className:
      "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30",
  },
  strong: {
    text: "Strong Match",
    icon: <Sparkles size={14} />,
    className: "bg-[color:var(--color-primary)] text-white",
  },
  good: {
    text: "Good Fit",
    icon: <ThumbsUp size={14} />,
    className: "bg-emerald-500/90 text-white",
  },
  explore: {
    text: "Explore",
    icon: <Compass size={14} />,
    className: "bg-white/10 text-white/90",
  },
};

export function MatchCard({ match }: { match: MatchCandidate }) {
  const [status, setStatus] = useState(match.connection_status);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const meta = LABEL_META[match.label];

  const onConnect = () => {
    setErr(null);
    // Incoming request → one-click accept (no modal, no message needed).
    if (status === "pending_incoming") {
      startTransition(async () => {
        const res = await requestConnection(
          match.user_id,
          undefined,
          match.score,
        );
        if (res && "error" in res && res.error) {
          setErr(res.error);
        } else if (res && "ok" in res) {
          setStatus("connected");
        }
      });
      return;
    }
    // Fresh request → open the ConnectModal with an AI-drafted intro.
    setModalOpen(true);
  };

  const onSent = () => {
    setStatus("pending_outgoing");
  };

  const disabled = pending || (status !== "none" && status !== "pending_incoming");

  return (
    <>
    <article className="w-64 flex-shrink-0 rounded-2xl bg-[#111] border border-white/10 p-3 flex flex-col">
      <div className="flex items-start gap-3">
        <Link href={`/u/${match.username}`} className="flex-shrink-0">
          <Avatar
            username={match.username}
            avatarUrl={match.avatar_url}
            size={48}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/u/${match.username}`}
            className="font-semibold text-sm truncate block hover:underline"
          >
            {match.full_name ?? match.username}
          </Link>
          <p className="text-xs text-white/50 truncate">@{match.username}</p>
        </div>
        {/* Big match % badge */}
        <div className="flex flex-col items-end">
          <span className="text-lg font-extrabold leading-none">
            {match.score}%
          </span>
          <span
            className={`mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.className}`}
          >
            {meta.icon}
            {meta.text}
          </span>
        </div>
      </div>

      {/* Reasons */}
      {match.reasons.length > 0 && (
        <ul className="mt-3 space-y-1">
          {match.reasons.map((r, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-[11px] text-white/80"
            >
              <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">{r}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA row */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onConnect}
          disabled={disabled}
          className={`flex-1 h-9 rounded-md text-xs font-semibold transition-colors ${
            status === "connected"
              ? "bg-emerald-500/20 text-emerald-300"
              : status === "pending_outgoing"
                ? "bg-white/10 text-white/60"
                : status === "pending_incoming"
                  ? "bg-[color:var(--color-primary)] text-white"
                  : "bg-[color:var(--color-primary)] text-white hover:brightness-110"
          } disabled:cursor-not-allowed`}
        >
          {connectLabel(status, pending)}
        </button>
        <Link
          href={`/u/${match.username}`}
          className="h-9 px-3 inline-flex items-center justify-center rounded-md text-xs font-medium bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
        >
          View
        </Link>
      </div>

      {err && (
        <p className="mt-2 text-[10px] text-[color:var(--color-danger)]">{err}</p>
      )}
    </article>
    <ConnectModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      target={{
        user_id: match.user_id,
        username: match.username,
        full_name: match.full_name,
        avatar_url: match.avatar_url,
        score: match.score,
      }}
      onSent={onSent}
    />
    </>
  );
}

function connectLabel(
  status: MatchCandidate["connection_status"],
  pending: boolean,
) {
  if (pending) return "…";
  switch (status) {
    case "connected":
      return (
        <span className="inline-flex items-center gap-1">
          <Check size={14} /> Connected
        </span>
      );
    case "pending_outgoing":
      return (
        <span className="inline-flex items-center gap-1">
          <Clock size={14} /> Requested
        </span>
      );
    case "pending_incoming":
      return "Accept";
    default:
      return "Connect";
  }
}

// Horizontal rail wrapper used on /search
export function TopMatchesRail({ matches }: { matches: MatchCandidate[] }) {
  if (matches.length === 0) return null;
  return (
    <section className="border-b border-[color:var(--color-border)] py-3">
      <header className="flex items-center justify-between px-3 pb-2">
        <h2 className="text-sm font-bold flex items-center gap-1.5">
          <Flame size={16} className="text-orange-400" />
          Top Matches for You
        </h2>
        <Link
          href="/connections"
          className="text-xs text-[color:var(--color-primary)] font-semibold"
        >
          See all
        </Link>
      </header>
      <div className="flex gap-3 overflow-x-auto px-3 pb-1 no-scrollbar">
        {matches.map((m) => (
          <MatchCard key={m.user_id} match={m} />
        ))}
      </div>
    </section>
  );
}
