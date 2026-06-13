"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Check, Film, ShieldCheck, X as XIcon, Clock } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import {
  respondToCollaboration,
  revokeCollaboration,
} from "@/app/actions";

export type CollabProject = {
  collab_id: string;
  project_name: string;
  description: string | null;
  status: "pending" | "verified" | "declined";
  created_at: string | null;
  counterpart_id: string;
  counterpart_username: string;
  counterpart_full_name: string | null;
  counterpart_avatar_url: string | null;
  side: "received" | "sent";
  linked_posts: Array<{
    post_id: string;
    image_url: string;
    media_type: "image" | "video" | null;
  }>;
};

export function CollabProjectRow({ project }: { project: CollabProject }) {
  const [status, setStatus] = useState<CollabProject["status"]>(project.status);
  const [removed, setRemoved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const respond = (accept: boolean) => {
    setErr(null);
    start(async () => {
      const res = await respondToCollaboration(project.collab_id, accept);
      if (res && "error" in res && res.error) {
        setErr(res.error);
        return;
      }
      setStatus(accept ? "verified" : "declined");
    });
  };

  const revoke = () => {
    if (!confirm("Revoke this collaboration request?")) return;
    setErr(null);
    start(async () => {
      const res = await revokeCollaboration(project.collab_id);
      if (res && "error" in res && res.error) {
        setErr(res.error);
        return;
      }
      setRemoved(true);
    });
  };

  if (removed) return null;

  return (
    <article className="px-3 py-3 border-b border-[color:var(--color-border)]">
      {/* Top row: counterpart + status chip */}
      <div className="flex items-center gap-2">
        <Avatar
          username={project.counterpart_username}
          avatarUrl={project.counterpart_avatar_url}
          size={32}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/u/${project.counterpart_username}`}
              className="text-sm font-semibold truncate hover:underline"
            >
              {project.counterpart_full_name ?? project.counterpart_username}
            </Link>
            <StatusChip status={status} />
          </div>
          <p className="text-[11px] text-white/50 truncate">
            {project.side === "received"
              ? `@${project.counterpart_username} requested a collab verification`
              : `requested @${project.counterpart_username} to verify`}
          </p>
        </div>
      </div>

      {/* Project card */}
      <div className="mt-2 ml-10 p-2.5 rounded-md bg-white/5 border border-white/10">
        <h4 className="text-sm font-semibold leading-tight">
          {project.project_name}
        </h4>
        {project.description && (
          <p className="mt-1 text-xs text-white/70 whitespace-pre-line leading-snug">
            {project.description}
          </p>
        )}

        {project.linked_posts.length > 0 && (
          <div className="mt-2 flex gap-1 overflow-x-auto no-scrollbar">
            {project.linked_posts.map((p) => (
              <Link
                key={p.post_id}
                href={`/p/${p.post_id}`}
                className="relative w-14 h-14 rounded-md overflow-hidden bg-neutral-900 flex-shrink-0"
              >
                {p.media_type === "video" ? (
                  <>
                    <video
                      src={p.image_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <Film
                      size={10}
                      className="absolute top-0.5 right-0.5 text-white drop-shadow"
                    />
                  </>
                ) : (
                  <Image
                    src={p.image_url}
                    alt=""
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        {project.linked_posts.length === 0 && (
          <p className="mt-2 text-[11px] text-white/40 italic">
            No linked posts — evidence-free collab
          </p>
        )}
      </div>

      {/* Action row */}
      <div className="mt-2 ml-10">
        {project.side === "received" && status === "pending" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => respond(true)}
              disabled={pending}
              className="h-8 px-3 inline-flex items-center gap-1 rounded-md bg-[color:var(--color-primary)] text-white text-xs font-bold hover:brightness-110 disabled:opacity-50"
            >
              <ShieldCheck size={12} /> Verify
            </button>
            <button
              type="button"
              onClick={() => respond(false)}
              disabled={pending}
              className="h-8 px-3 inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/10 text-white/80 text-xs font-semibold hover:bg-white/10 disabled:opacity-50"
            >
              <XIcon size={12} /> Decline
            </button>
          </div>
        ) : project.side === "sent" && status === "pending" ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/50">Awaiting approval…</span>
            <button
              type="button"
              onClick={revoke}
              disabled={pending}
              className="h-7 px-2.5 inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/10 text-white/60 text-[11px] font-semibold hover:bg-white/10 disabled:opacity-50 ml-auto"
            >
              Revoke
            </button>
          </div>
        ) : status === "verified" ? (
          <p className="text-xs inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <Check size={14} /> Verified — public on both profiles
          </p>
        ) : (
          <p className="text-xs text-white/50">Declined</p>
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

function StatusChip({ status }: { status: "pending" | "verified" | "declined" }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
        <ShieldCheck size={10} /> verified
      </span>
    );
  }
  if (status === "declined") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/40">
        <XIcon size={10} /> declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/60">
      <Clock size={10} /> pending
    </span>
  );
}
