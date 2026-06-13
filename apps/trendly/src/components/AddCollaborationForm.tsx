"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Check, Film, Search, ShieldCheck, X as XIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/Avatar";
import { createCollaboration } from "@/app/actions";

type LinkablePost = {
  id: string;
  image_url: string;
  media_type: "image" | "video" | null;
  caption: string | null;
  kind: "regular" | "proof_of_work";
};

type PartnerMatch = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

export function AddCollaborationForm({ posts }: { posts: LinkablePost[] }) {
  const router = useRouter();
  const [partnerQuery, setPartnerQuery] = useState("");
  const [partner, setPartner] = useState<PartnerMatch | null>(null);
  const [matches, setMatches] = useState<PartnerMatch[]>([]);
  const [searching, setSearching] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // Debounced partner search against Supabase profiles.
  useEffect(() => {
    if (partner) return; // already locked in
    const q = partnerQuery.trim().replace(/^@/, "").toLowerCase();
    if (!q || q.length < 2) {
      setMatches([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .ilike("username", `${q}%`)
        .limit(6);
      if (!cancelled) {
        setMatches(((data as unknown) as PartnerMatch[] | null) ?? []);
        setSearching(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [partnerQuery, partner]);

  const togglePost = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = () => {
    setErr(null);
    if (!partner) return setErr("Select a partner");
    if (!projectName.trim()) return setErr("Project name is required");

    start(async () => {
      const res = await createCollaboration({
        partnerUsername: partner.username,
        projectName,
        description: description.trim() || undefined,
        postIds: Array.from(selectedIds),
      });
      if (res && "error" in res && res.error) {
        setErr(res.error);
        return;
      }
      router.push("/collabs?tab=sent");
      router.refresh();
    });
  };

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Partner picker */}
      <section>
        <label className="text-xs font-semibold text-white/80 uppercase tracking-wide">
          1. Partner
        </label>
        <p className="text-xs text-white/50 mt-0.5">
          The other business or creator you collaborated with. They'll need to
          approve this before it's visible anywhere.
        </p>
        {partner ? (
          <div className="mt-2 flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2 py-1.5">
            <Avatar
              username={partner.username}
              avatarUrl={partner.avatar_url}
              size={28}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">
                {partner.full_name ?? partner.username}
              </div>
              <div className="text-[11px] text-white/50 truncate">
                @{partner.username}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPartner(null);
                setPartnerQuery("");
                setMatches([]);
              }}
              className="p-1.5 rounded hover:bg-white/10 text-white/60"
              aria-label="Clear partner"
            >
              <XIcon size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-2 relative">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2.5 h-10">
              <Search size={16} className="text-white/50" />
              <input
                type="text"
                value={partnerQuery}
                onChange={(e) => setPartnerQuery(e.target.value)}
                placeholder="Search @username"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
              />
              {searching && (
                <span className="text-[10px] text-white/40">searching…</span>
              )}
            </div>
            {matches.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 z-10 bg-neutral-900 border border-white/10 rounded-md overflow-hidden shadow-lg">
                {matches.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setPartner(m);
                        setPartnerQuery("");
                        setMatches([]);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 hover:bg-white/5 text-left"
                    >
                      <Avatar
                        username={m.username}
                        avatarUrl={m.avatar_url}
                        size={24}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">
                          {m.full_name ?? m.username}
                        </div>
                        <div className="text-[11px] text-white/50 truncate">
                          @{m.username}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Project name + description */}
      <section>
        <label className="text-xs font-semibold text-white/80 uppercase tracking-wide">
          2. Project
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g. Lumen App — Landing Page Redesign"
          maxLength={120}
          className="mt-2 w-full bg-white/5 border border-white/10 rounded-md px-3 h-10 text-sm placeholder:text-white/40 outline-none focus:border-[color:var(--color-primary)]"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional: what did you build together? what was your role?"
          rows={3}
          className="mt-2 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm placeholder:text-white/40 outline-none focus:border-[color:var(--color-primary)] resize-none"
        />
      </section>

      {/* Linked posts */}
      {posts.length > 0 && (
        <section>
          <label className="text-xs font-semibold text-white/80 uppercase tracking-wide">
            3. Link the work
            <span className="ml-1 text-white/40 font-normal normal-case">
              ({selectedIds.size} selected)
            </span>
          </label>
          <p className="text-xs text-white/50 mt-0.5">
            Pick the posts/reels that are evidence of this collaboration.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {posts.map((p) => {
              const isSelected = selectedIds.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePost(p.id)}
                  className={`relative aspect-square rounded-md overflow-hidden bg-neutral-900 transition-all ${
                    isSelected
                      ? "ring-2 ring-[color:var(--color-primary)]"
                      : "ring-0"
                  }`}
                  aria-pressed={isSelected}
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
                        size={12}
                        className="absolute top-1 right-1 text-white drop-shadow"
                      />
                    </>
                  ) : (
                    <Image
                      src={p.image_url}
                      alt=""
                      fill
                      unoptimized
                      sizes="120px"
                      className="object-cover"
                    />
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="w-6 h-6 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </span>
                    </div>
                  )}
                  {p.kind === "proof_of_work" && (
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1 rounded bg-emerald-500/80 text-white">
                      PoW
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {err && (
        <p className="text-xs text-[color:var(--color-danger)]">{err}</p>
      )}

      <div className="sticky bottom-0 bg-black pt-2 pb-4 border-t border-white/5">
        <button
          type="button"
          onClick={submit}
          disabled={pending || !partner || !projectName.trim()}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-md btn-primary text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldCheck size={16} />
          {pending ? "Sending request…" : "Send verification request"}
        </button>
        <p className="text-[11px] text-white/40 text-center mt-2">
          No approval = no visibility. Your partner must accept before anyone
          else can see this collaboration.
        </p>
      </div>
    </div>
  );
}
