"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Flame, Sparkles, ThumbsUp, Compass, Check, Clock } from "lucide-react";
import { requestConnection } from "@/app/actions";
import type { MatchCandidate } from "@/lib/matching";
import { ConnectModal } from "@/components/ConnectModal";

type Props = {
  match: Pick<
    MatchCandidate,
    "user_id" | "score" | "label" | "reasons" | "connection_status"
  > & {
    // Needed so the modal can greet by name without another round-trip.
    username: string;
    full_name: string | null;
  };
};

const LABEL_META: Record<
  MatchCandidate["label"],
  { text: string; icon: React.ReactNode; from: string; to: string }
> = {
  perfect: { text: "Perfect Match", icon: <Flame size={14} />, from: "from-orange-500", to: "to-red-500" },
  strong: { text: "Strong Match", icon: <Sparkles size={14} />, from: "from-sky-500", to: "to-blue-600" },
  good: { text: "Good Fit", icon: <ThumbsUp size={14} />, from: "from-emerald-500", to: "to-emerald-600" },
  explore: { text: "Explore", icon: <Compass size={14} />, from: "from-neutral-600", to: "to-neutral-700" },
};

export function ProfileMatchBadge({ match }: Props) {
  const [status, setStatus] = useState(match.connection_status);
  const [pending, start] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const meta = LABEL_META[match.label];

  const onConnect = () => {
    if (match.connection_status === "pending_incoming") {
      // Incoming → one-click accept
      start(async () => {
        const res = await requestConnection(match.user_id, undefined, match.score);
        if (res && "ok" in res) setStatus("connected");
      });
      return;
    }
    setModalOpen(true);
  };

  // Hide completely if below a floor — don't clutter low-signal profiles.
  if (match.score < 30) return null;

  return (
    <>
    <div
      className={`mx-4 mt-3 rounded-xl bg-gradient-to-r ${meta.from} ${meta.to} p-[1px]`}
    >
      <div className="rounded-[11px] bg-black/70 backdrop-blur-sm px-3 py-2.5 flex items-center gap-3">
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="text-xl font-extrabold leading-none">{match.score}%</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold mt-1 text-white/90">
            {meta.icon} {meta.text}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-white/80 leading-tight">
            {match.reasons.slice(0, 2).join(" · ") || "You're a good fit"}
          </p>
          {match.reasons.length > 2 && (
            <p className="text-[10px] text-white/50 mt-0.5">
              + {match.reasons.length - 2} more reason
              {match.reasons.length - 2 > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <ConnectCTA status={status} pending={pending} onConnect={onConnect} />
      </div>
    </div>
    <ConnectModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      target={{
        user_id: match.user_id,
        username: match.username,
        full_name: match.full_name,
        score: match.score,
      }}
      onSent={() => setStatus("pending_outgoing")}
    />
    </>
  );
}

function ConnectCTA({
  status,
  pending,
  onConnect,
}: {
  status: MatchCandidate["connection_status"];
  pending: boolean;
  onConnect: () => void;
}) {
  if (status === "connected") {
    return (
      <Link
        href="/connections?tab=network"
        className="h-8 px-3 inline-flex items-center gap-1 rounded-md bg-emerald-500/20 text-emerald-200 text-xs font-semibold"
      >
        <Check size={14} /> Connected
      </Link>
    );
  }
  if (status === "pending_outgoing") {
    return (
      <span className="h-8 px-3 inline-flex items-center gap-1 rounded-md bg-white/10 text-white/60 text-xs font-semibold">
        <Clock size={14} /> Requested
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onConnect}
      disabled={pending}
      className="h-8 px-3 rounded-md bg-white text-black text-xs font-bold disabled:opacity-60"
    >
      {pending ? "…" : status === "pending_incoming" ? "Accept" : "Connect"}
    </button>
  );
}
