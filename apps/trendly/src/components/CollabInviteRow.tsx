"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Check, Film, ShieldCheck, X as XIcon } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { respondToCollabInvite } from "@/app/actions";

export type CollabInvite = {
  post_id: string;
  author_id: string;
  author_username: string;
  author_full_name: string | null;
  author_avatar_url: string | null;
  project_title: string;
  image_url: string;
  media_type: "image" | "video" | null;
  role: string | null;
  invited_at: string | null;
  status: "pending" | "verified" | "declined";
};

export function CollabInviteRow({ inv }: { inv: CollabInvite }) {
  const [status, setStatus] = useState<CollabInvite["status"]>(inv.status);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const act = (accept: boolean) => {
    setErr(null);
    start(async () => {
      const res = await respondToCollabInvite(inv.post_id, accept);
      if (res && "error" in res && res.error) {
        setErr(res.error);
        return;
      }
      setStatus(accept ? "verified" : "declined");
    });
  };

  return (
    <article className="flex gap-3 px-3 py-3 border-b border-[color:var(--color-border)]">
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-900">
        {inv.media_type === "video" ? (
          <>
            <video
              src={inv.image_url}
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <Film
              size={14}
              className="absolute top-1 right-1 text-white drop-shadow"
            />
          </>
        ) : (
          <Image
            src={inv.image_url}
            alt={inv.project_title}
            fill
            unoptimized
            className="object-cover"
            sizes="64px"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Avatar
            username={inv.author_username}
            avatarUrl={inv.author_avatar_url}
            size={20}
          />
          <Link
            href={`/u/${inv.author_username}`}
            className="text-sm font-semibold truncate hover:underline"
          >
            {inv.author_full_name ?? inv.author_username}
          </Link>
          <span className="text-xs text-white/40 truncate">
            @{inv.author_username}
          </span>
        </div>

        <p className="text-xs text-white/80 mt-0.5 leading-snug">
          Tagged you as{" "}
          <span className="font-semibold text-white">
            {inv.role ? `a ${inv.role} collaborator` : "a collaborator"}
          </span>{" "}
          on <span className="text-white">{inv.project_title}</span>
        </p>

        {status === "pending" ? (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => act(true)}
              disabled={pending}
              className="h-7 px-3 inline-flex items-center gap-1 rounded-md bg-[color:var(--color-primary)] text-white text-xs font-bold hover:brightness-110 disabled:opacity-50"
            >
              <ShieldCheck size={12} /> Verify
            </button>
            <button
              type="button"
              onClick={() => act(false)}
              disabled={pending}
              className="h-7 px-3 inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/10 text-white/80 text-xs font-semibold hover:bg-white/10 disabled:opacity-50"
            >
              <XIcon size={12} /> Decline
            </button>
            <Link
              href={`/p/${inv.post_id}`}
              className="text-xs text-white/50 hover:text-white/80 underline ml-auto"
            >
              View post
            </Link>
          </div>
        ) : status === "verified" ? (
          <p className="mt-2 text-xs inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <Check size={14} /> Verified — shows on both your profiles
          </p>
        ) : (
          <p className="mt-2 text-xs text-white/50">Declined</p>
        )}

        {err && (
          <p className="mt-1 text-[11px] text-[color:var(--color-danger)]">
            {err}
          </p>
        )}
      </div>
    </article>
  );
}
