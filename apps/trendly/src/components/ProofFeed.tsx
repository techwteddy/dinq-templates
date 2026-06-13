"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
  Briefcase,
  Clock,
  Hammer,
  Target,
  Users,
  Info,
  ShieldCheck,
  X,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { formatCount } from "@/lib/utils";
import { toggleLike, addComment, listComments } from "@/app/actions";

export type ProofItem = {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string;
  media_type: "image" | "video" | null;
  created_at: string | null;
  author_username: string;
  author_avatar: string | null;
  liked: boolean;
  likes_count: number;
  comments_count: number;

  // Proof-of-Work metadata
  project_title: string;
  work_type: string;
  stage: "idea" | "in_progress" | "completed";
  tools: string[];
  time_spent_hours: number | null;
  started_at: string | null;
  intent: string | null;
  skills: string[];
  industry: string | null;
  target_audience: string | null;
  use_case: string | null;
  problem_solved: string | null;
  key_decisions: string | null;
  challenges: string | null;
  verified_collaborators: number;
};

type CommentRow = {
  id: string;
  content: string;
  created_at: string | null;
  username: string;
  avatar_url: string | null;
};

const STAGE_COLOR: Record<string, string> = {
  idea: "bg-yellow-500/80",
  in_progress: "bg-blue-500/80",
  completed: "bg-emerald-500/80",
};

const STAGE_LABEL: Record<string, string> = {
  idea: "Idea",
  in_progress: "In Progress",
  completed: "Completed",
};

export function ProofFeed({ items }: { items: ProofItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.getAttribute("data-proof-id");
          if (!id) continue;
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            setActiveId(id);
          }
        }
      },
      { root, threshold: [0, 0.6, 1] },
    );
    const slides = root.querySelectorAll("[data-proof-id]");
    slides.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    videoRefs.current.forEach((v, id) => {
      if (id === activeId) {
        v.muted = muted;
        v.play().catch(() => {
          v.muted = true;
          setMuted(true);
          v.play().catch(() => {});
        });
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [activeId, muted]);

  return (
    <div
      ref={containerRef}
      className="h-dvh w-full overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {items.map((it) => (
        <ProofSlide
          key={it.id}
          item={it}
          isActive={it.id === activeId}
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
          registerVideo={(el) => {
            if (el) videoRefs.current.set(it.id, el);
            else videoRefs.current.delete(it.id);
          }}
        />
      ))}
    </div>
  );
}

function ProofSlide({
  item,
  isActive,
  muted,
  onToggleMute,
  registerVideo,
}: {
  item: ProofItem;
  isActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
  registerVideo: (el: HTMLVideoElement | null) => void;
}) {
  const [liked, setLiked] = useState(item.liked);
  const [likes, setLikes] = useState(item.likes_count);
  const [commentCount, setCommentCount] = useState(item.comments_count);
  const [showComments, setShowComments] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const [, start] = useTransition();

  const like = () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
    start(() => toggleLike(item.id));
  };

  const openComments = async () => {
    setShowComments(true);
    setLoading(true);
    try {
      const res = await listComments(item.id);
      setComments(res.comments ?? []);
    } finally {
      setLoading(false);
    }
  };

  const sendComment = () => {
    const text = modalText.trim();
    if (!text) return;
    const optimistic: CommentRow = {
      id: `tmp-${Date.now()}`,
      content: text,
      created_at: new Date().toISOString(),
      username: "you",
      avatar_url: null,
    };
    setComments((c) => [...c, optimistic]);
    setCommentCount((n) => n + 1);
    setModalText("");
    start(async () => {
      await addComment(item.id, text);
      const res = await listComments(item.id);
      setComments(res.comments ?? []);
    });
  };

  const isVideo = item.media_type === "video";

  return (
    <section
      data-proof-id={item.id}
      className="relative h-dvh w-full snap-start bg-black flex items-center justify-center overflow-hidden"
    >
      {isVideo ? (
        <video
          ref={registerVideo}
          src={item.image_url}
          playsInline
          loop
          preload="metadata"
          className="absolute inset-0 w-full h-full object-contain bg-black"
        />
      ) : (
        <Image
          src={item.image_url}
          alt={item.project_title}
          fill
          className="object-contain"
          unoptimized
          priority={isActive}
        />
      )}

      {/* Top bar: back + label + stage chip + mute */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-8 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link href="/feed" className="text-white" aria-label="Back">
            <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="font-semibold text-lg">Proof</span>
          <span
            className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-semibold text-white ${
              STAGE_COLOR[item.stage] ?? "bg-neutral-500/80"
            }`}
          >
            {STAGE_LABEL[item.stage] ?? item.stage}
          </span>
        </div>
        {isVideo && (
          <button
            type="button"
            onClick={onToggleMute}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 pointer-events-auto"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>

      {/* Right-side action column */}
      <div className="absolute right-3 bottom-36 flex flex-col items-center gap-5 text-white z-10">
        <button onClick={like} className="flex flex-col items-center" aria-label="Like">
          <Heart
            size={30}
            fill={liked ? "#ED4956" : "none"}
            color={liked ? "#ED4956" : "white"}
          />
          <span className="text-[11px] mt-0.5">{formatCount(likes)}</span>
        </button>
        <button onClick={openComments} className="flex flex-col items-center" aria-label="Comments">
          <MessageCircle size={30} />
          <span className="text-[11px] mt-0.5">{formatCount(commentCount)}</span>
        </button>
        <button onClick={() => setShowDetails(true)} className="flex flex-col items-center" aria-label="Details">
          <Info size={30} />
          <span className="text-[11px] mt-0.5">Details</span>
        </button>
        <button className="flex flex-col items-center" aria-label="Share">
          <Send size={30} />
        </button>
        <Link
          href={`/u/${item.author_username}`}
          aria-label={`Open @${item.author_username}'s profile`}
          className="w-10 h-10 rounded overflow-hidden border-2 border-white block"
        >
          <Avatar
            username={item.author_username}
            avatarUrl={item.author_avatar}
            size={36}
          />
        </Link>
      </div>

      {/* Bottom gradient + structured panel */}
      <div className="absolute left-0 right-0 bottom-0 pt-28 pb-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute left-0 right-16 bottom-6 px-4 text-white z-10">
        <Link
          href={`/u/${item.author_username}`}
          className="flex items-center gap-2 mb-2 w-fit"
        >
          <Avatar
            username={item.author_username}
            avatarUrl={item.author_avatar}
            size={32}
          />
          <span className="font-semibold text-sm drop-shadow">
            @{item.author_username}
          </span>
        </Link>

        <h2 className="text-base font-bold leading-tight drop-shadow line-clamp-2">
          {item.project_title}
        </h2>

        {item.caption && (
          <p className="text-sm whitespace-pre-line line-clamp-2 mt-1 drop-shadow text-white/90">
            {item.caption}
          </p>
        )}

        {/* Metadata strip */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Chip icon={<Briefcase size={11} />} label={item.work_type} />
          {item.time_spent_hours != null && (
            <Chip
              icon={<Clock size={11} />}
              label={`${item.time_spent_hours}h`}
            />
          )}
          {item.intent && (
            <Chip icon={<Target size={11} />} label={item.intent} />
          )}
          {item.verified_collaborators > 0 && (
            <Chip
              icon={<ShieldCheck size={11} />}
              label={
                item.verified_collaborators === 1
                  ? "1 verified collab"
                  : `${item.verified_collaborators} verified collabs`
              }
              tone="success"
            />
          )}
        </div>

        {/* Tools & skills rail */}
        {(item.tools.length > 0 || item.skills.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tools.slice(0, 4).map((t) => (
              <span
                key={`t-${t}`}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white backdrop-blur-sm"
              >
                <Hammer size={10} className="inline mr-1 -mt-0.5" />
                {t}
              </span>
            ))}
            {item.skills.slice(0, 4).map((s) => (
              <span
                key={`s-${s}`}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--color-primary)]/90 text-white"
              >
                #{s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Details drawer */}
      {showDetails && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-end"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-[#0b0b0b] text-white w-full max-h-[85dvh] rounded-t-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="font-semibold text-sm">Proof details</span>
              <button onClick={() => setShowDetails(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 text-sm space-y-3">
              <DetailRow label="Project">{item.project_title}</DetailRow>
              <DetailRow label="Type">{item.work_type}</DetailRow>
              <DetailRow label="Stage">
                {STAGE_LABEL[item.stage] ?? item.stage}
              </DetailRow>
              {item.started_at && (
                <DetailRow label="Started">{item.started_at}</DetailRow>
              )}
              {item.time_spent_hours != null && (
                <DetailRow label="Time spent">
                  {item.time_spent_hours} hours
                </DetailRow>
              )}
              {item.tools.length > 0 && (
                <DetailRow label="Stack">{item.tools.join(", ")}</DetailRow>
              )}
              {item.skills.length > 0 && (
                <DetailRow label="Skills">
                  {item.skills.map((s) => `#${s}`).join(" ")}
                </DetailRow>
              )}
              {item.intent && <DetailRow label="Intent">{item.intent}</DetailRow>}
              {item.industry && (
                <DetailRow label="Industry">{item.industry}</DetailRow>
              )}
              {item.target_audience && (
                <DetailRow label="Audience">{item.target_audience}</DetailRow>
              )}
              {item.use_case && (
                <DetailRow label="Use case">{item.use_case}</DetailRow>
              )}
              {item.problem_solved && (
                <DetailBlock label="Problem solved">
                  {item.problem_solved}
                </DetailBlock>
              )}
              {item.key_decisions && (
                <DetailBlock label="Key decisions">
                  {item.key_decisions}
                </DetailBlock>
              )}
              {item.challenges && (
                <DetailBlock label="Challenges">{item.challenges}</DetailBlock>
              )}
              <DetailRow label="Verified collaborators">
                {item.verified_collaborators}
              </DetailRow>
            </div>
          </div>
        </div>
      )}

      {/* Comments drawer */}
      {showComments && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end"
          onClick={() => setShowComments(false)}
        >
          <div
            className="bg-[#0b0b0b] w-full max-h-[70dvh] rounded-t-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-white/10 text-center font-semibold text-sm">
              Comments
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {loading ? (
                <p className="text-white/60 text-sm text-center py-6">Loading...</p>
              ) : comments.length === 0 ? (
                <p className="text-white/60 text-sm text-center py-6">No comments yet</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-2 py-2">
                    <Avatar username={c.username} avatarUrl={c.avatar_url} size={30} />
                    <div className="flex-1 text-sm">
                      <span className="font-semibold mr-1">{c.username}</span>
                      <span>{c.content}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 flex items-center gap-2 border-t border-white/10">
              <input
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendComment();
                }}
                placeholder="Add a comment..."
                className="flex-1 h-9 bg-transparent border border-white/30 rounded-full px-3 text-sm outline-none"
              />
              <button
                onClick={sendComment}
                disabled={!modalText.trim()}
                className="text-[color:var(--color-primary)] font-semibold text-sm disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Chip({
  icon,
  label,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "default" | "success";
}) {
  const cls =
    tone === "success"
      ? "bg-emerald-500/80 text-white"
      : "bg-white/15 text-white backdrop-blur-sm";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${cls}`}
    >
      {icon}
      <span className="capitalize">{label}</span>
    </span>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-white/50 text-xs uppercase tracking-wide w-28 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-white/95 flex-1 capitalize">{children}</span>
    </div>
  );
}

function DetailBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-white/50 text-xs uppercase tracking-wide mb-1">
        {label}
      </div>
      <p className="text-white/95 whitespace-pre-line">{children}</p>
    </div>
  );
}
