"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Music2,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { formatCount } from "@/lib/utils";
import { toggleLike, toggleSave, addComment, listComments } from "@/app/actions";

export type Reel = {
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
};

type CommentRow = {
  id: string;
  content: string;
  created_at: string | null;
  username: string;
  avatar_url: string | null;
};

export function ReelsFeed({ reels }: { reels: Reel[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(reels[0]?.id ?? null);
  const [muted, setMuted] = useState(true); // reels default muted (IG behavior)

  // Observe which reel is currently in view.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.getAttribute("data-reel-id");
          if (!id) continue;
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            setActiveId(id);
          }
        }
      },
      { root, threshold: [0, 0.6, 1] },
    );
    const slides = root.querySelectorAll("[data-reel-id]");
    slides.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reels.length]);

  // Play the active video, pause others.
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
      {reels.map((r) => (
        <ReelSlide
          key={r.id}
          reel={r}
          isActive={r.id === activeId}
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
          registerVideo={(el) => {
            if (el) videoRefs.current.set(r.id, el);
            else videoRefs.current.delete(r.id);
          }}
        />
      ))}
    </div>
  );
}

function ReelSlide({
  reel,
  isActive,
  muted,
  onToggleMute,
  registerVideo,
}: {
  reel: Reel;
  isActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
  registerVideo: (el: HTMLVideoElement | null) => void;
}) {
  const [liked, setLiked] = useState(reel.liked);
  const [likes, setLikes] = useState(reel.likes_count);
  const [commentCount, setCommentCount] = useState(reel.comments_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [, start] = useTransition();

  const like = () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
    start(() => toggleLike(reel.id));
  };

  const save = () => {
    start(() => toggleSave(reel.id));
  };

  const openComments = async () => {
    setShowComments(true);
    setLoading(true);
    try {
      const res = await listComments(reel.id);
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
      await addComment(reel.id, text);
      const res = await listComments(reel.id);
      setComments(res.comments ?? []);
    });
  };

  const share = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/p/${reel.id}`
        : `/p/${reel.id}`;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: `@${reel.author_username}`, url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied");
      setTimeout(() => setShareMsg(null), 1800);
    } catch {
      setShareMsg("Could not copy link");
      setTimeout(() => setShareMsg(null), 1800);
    }
  };

  const isVideo = reel.media_type === "video";

  return (
    <section
      data-reel-id={reel.id}
      className="relative h-dvh w-full snap-start bg-black flex items-center justify-center overflow-hidden"
    >
      {isVideo ? (
        <video
          ref={registerVideo}
          src={reel.image_url}
          playsInline
          loop
          preload="metadata"
          className="absolute inset-0 w-full h-full object-contain bg-black"
        />
      ) : (
        <Image
          src={reel.image_url}
          alt={reel.caption ?? ""}
          fill
          className="object-contain"
          unoptimized
          priority={isActive}
        />
      )}

      {/* Top gradient overlay with Reels label */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link href="/feed" className="text-white" aria-label="Back">
            <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="font-semibold text-lg">Reels</span>
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
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 text-white z-10">
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
        <button onClick={share} className="flex flex-col items-center" aria-label="Share">
          <Send size={30} />
        </button>
        <button onClick={save} className="flex flex-col items-center" aria-label="More">
          <MoreHorizontal size={30} />
        </button>
        <Link
          href={`/u/${reel.author_username}`}
          aria-label={`Open @${reel.author_username}'s profile`}
          className="w-10 h-10 rounded overflow-hidden border-2 border-white block"
        >
          <Avatar
            username={reel.author_username}
            avatarUrl={reel.author_avatar}
            size={36}
          />
        </Link>
      </div>

      {/* Bottom gradient + info block */}
      <div className="absolute left-0 right-0 bottom-0 pt-20 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute left-0 right-16 bottom-6 px-4 text-white z-10">
        <Link
          href={`/u/${reel.author_username}`}
          className="flex items-center gap-2 mb-2 w-fit"
        >
          <Avatar
            username={reel.author_username}
            avatarUrl={reel.author_avatar}
            size={32}
          />
          <span className="font-semibold text-sm drop-shadow">
            @{reel.author_username}
          </span>
          <span className="text-xs px-2 py-0.5 border border-white/80 rounded ml-1">
            Follow
          </span>
        </Link>
        {reel.caption ? (
          <p className="text-sm whitespace-pre-line line-clamp-3 drop-shadow">
            {reel.caption}
          </p>
        ) : (
          <p className="text-sm text-white/80 italic drop-shadow">
            Reel by @{reel.author_username}
          </p>
        )}
        <div className="flex items-center gap-1 text-xs mt-2 text-white/90 drop-shadow">
          <Music2 size={14} />
          <span className="truncate">
            Original audio &middot; @{reel.author_username}
          </span>
        </div>
      </div>

      {shareMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-3 py-1.5 rounded-full z-20">
          {shareMsg}
        </div>
      )}

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
