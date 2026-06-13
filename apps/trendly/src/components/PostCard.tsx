"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X, Archive, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toggleLike, toggleSave, addComment, listComments, toggleArchive } from "@/app/actions";
import { Avatar } from "@/components/Avatar";
import { timeAgo, formatCount } from "@/lib/utils";

export type FeedPost = {
  id: string;
  caption: string | null;
  image_url: string;
  media_type?: "image" | "video" | null;
  audio_url?: string | null;
  created_at: string | null;
  author_id?: string;
  author_username: string;
  author_avatar: string | null;
  author_has_story?: boolean;
  author_story_viewed?: boolean;
  author_location?: string | null;
  archived?: boolean;
  liked: boolean;
  saved: boolean;
  likes_count: number;
  comments_count: number;
  top_liker?: { username: string } | null;
};

type CommentRow = {
  id: string;
  content: string;
  created_at: string | null;
  username: string;
  avatar_url: string | null;
};

export function PostCard({
  post,
  currentUserId,
}: {
  post: FeedPost;
  currentUserId?: string | null;
}) {
  const isAuthor = !!currentUserId && post.author_id === currentUserId;
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes_count);
  const [saved, setSaved] = useState(post.saved);
  const [archived, setArchived] = useState(!!post.archived);
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(post.comments_count);
  const [isPending, start] = useTransition();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [modalText, setModalText] = useState("");
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuErr, setMenuErr] = useState<string | null>(null);
  // Drives heart-pop animation by remounting the icon's wrapper key.
  const [popTick, setPopTick] = useState(0);
  const [bubbleTick, setBubbleTick] = useState(0);
  const [sendTick, setSendTick] = useState(0);
  const [bookmarkTick, setBookmarkTick] = useState(0);
  const [burstAt, setBurstAt] = useState<{ x: number; y: number; key: number } | null>(null);
  const lastTapRef = useRef<{ t: number; x: number; y: number } | null>(null);
  const modalInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const like = () => {
    const willLike = !liked;
    setLiked(willLike);
    setLikes((n) => (liked ? n - 1 : n + 1));
    setPopTick((t) => t + 1);
    if (willLike && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(10);
    }
    start(() => toggleLike(post.id));
  };

  // Double-tap on the photo to like — fires a giant flying heart.
  const onMediaPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const now = Date.now();
    const last = lastTapRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (last && now - last.t < 350 && Math.hypot(x - last.x, y - last.y) < 40) {
      lastTapRef.current = null;
      if (!liked) {
        setLiked(true);
        setLikes((n) => n + 1);
        setPopTick((t) => t + 1);
        start(() => toggleLike(post.id));
      }
      setBurstAt({ x, y, key: now });
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(15);
      }
    } else {
      lastTapRef.current = { t: now, x, y };
    }
  };
  const save = () => {
    setSaved((v) => !v);
    setBookmarkTick((t) => t + 1);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
    start(() => toggleSave(post.id));
  };
  const send = () => {
    const text = comment.trim();
    if (!text) return;
    setComment("");
    setCommentCount((n) => n + 1);
    start(() => addComment(post.id, text));
  };

  const openComments = async () => {
    setBubbleTick((t) => t + 1);
    setShowComments(true);
    setLoadingComments(true);
    try {
      const res = await listComments(post.id);
      setComments(res.comments ?? []);
    } finally {
      setLoadingComments(false);
    }
  };
  const closeComments = () => setShowComments(false);

  const sendModal = () => {
    const text = modalText.trim();
    if (!text) return;
    const optimistic: CommentRow = {
      id: `tmp-${Date.now()}`,
      content: text,
      created_at: new Date().toISOString(),
      username: "you",
      avatar_url: null,
    };
    setComments((cs) => [...cs, optimistic]);
    setCommentCount((n) => n + 1);
    setModalText("");
    start(async () => {
      await addComment(post.id, text);
      const res = await listComments(post.id);
      setComments(res.comments ?? []);
    });
  };

  const share = async () => {
    setSendTick((t) => t + 1);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/p/${post.id}`
        : `/p/${post.id}`;
    const shareData = {
      title: `@${post.author_username} on Trendly`,
      text: post.caption ?? "",
      url,
    };
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied");
    } catch {
      setShareMsg("Could not copy link");
    }
  };

  useEffect(() => {
    if (!shareMsg) return;
    const t = setTimeout(() => setShareMsg(null), 1800);
    return () => clearTimeout(t);
  }, [shareMsg]);

  // Click-outside to close the overflow menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  const archiveToggle = () => {
    setMenuErr(null);
    const optimistic = !archived;
    setArchived(optimistic);
    setMenuOpen(false);
    start(async () => {
      const res = await toggleArchive(post.id);
      if (res && "error" in res && res.error) {
        setArchived(!optimistic);
        setMenuErr(res.error);
      }
    });
  };

  useEffect(() => {
    if (!showComments) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeComments();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => modalInputRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [showComments]);
  // Subtle parallax: translate the photo proportionally to its position
  // in the viewport (-12px at the very top, 0 at center, +12px at bottom).
  const mediaWrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = mediaWrapRef.current;
    if (!el || typeof window === "undefined") return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1..1 where 0 is centered in viewport.
      const t = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
      el.style.setProperty("--plx", `${(-t * 12).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);


  return (
    <article className={`post-card pb-3${(post.likes_count ?? 0) >= 10 ? " featured" : ""}`}>
      <header className="flex items-center gap-3 px-3 py-2">
        {post.author_has_story && post.author_id ? (
          <Link
            href={`/stories/${post.author_id}`}
            aria-label={`View ${post.author_username}'s story`}
          >
            <Avatar
              username={post.author_username}
              avatarUrl={post.author_avatar}
              size={36}
              ring={post.author_story_viewed ? "viewed" : "story"}
            />
          </Link>
        ) : (
          <Link href={`/u/${post.author_username}`} aria-label={`Open ${post.author_username}'s profile`}>
            <Avatar
              username={post.author_username}
              avatarUrl={post.author_avatar}
              size={36}
            />
          </Link>
        )}
        <Link href={`/u/${post.author_username}`} className="leading-tight">
          <div className="text-sm font-semibold">{post.author_username}</div>
          {post.author_location && <div className="text-[11px] text-white/60">{post.author_location}</div>}
        </Link>
        <div className="ml-auto relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-white/80 p-1 -m-1 rounded hover:bg-white/5"
            aria-label="More"
            aria-expanded={menuOpen}
          >
            <MoreHorizontal size={20} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 min-w-[180px] rounded-md bg-neutral-900 border border-white/10 shadow-lg py-1 z-30">
              {isAuthor ? (
                <button
                  type="button"
                  onClick={archiveToggle}
                  disabled={isPending}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
                >
                  {archived ? (
                    <>
                      <RotateCcw size={16} />
                      Unarchive post
                    </>
                  ) : (
                    <>
                      <Archive size={16} />
                      Archive post
                    </>
                  )}
                </button>
              ) : (
                <div className="px-3 py-2 text-xs text-white/50">
                  Nothing here yet
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {archived && isAuthor && (
        <div className="mx-3 mt-2 px-2 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1.5 text-[11px] text-white/70">
          <Archive size={12} />
          Archived — only visible to you
        </div>
      )}
      {menuErr && (
        <div className="mx-3 mt-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-[11px] text-[color:var(--color-danger)]">
          {menuErr}
        </div>
      )}

      <div
        ref={mediaWrapRef}
        className="relative aspect-square bg-neutral-900 select-none overflow-hidden"
        onPointerDown={onMediaPointerDown}
      >
        <div className="parallax-img">
        {post.media_type === "video" ? (
          <video
            src={post.image_url}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover bg-black"
          />
        ) : (
          <Image
            src={post.image_url}
            alt={post.caption ?? ""}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 428px) 100vw, 428px"
            unoptimized
          />
        )}
        </div>
        {post.audio_url && (
          <audio src={post.audio_url} controls className="absolute bottom-2 left-2 right-2 w-[calc(100%-1rem)] h-8" />
        )}
        {burstAt && (
          <Heart
            key={burstAt.key}
            size={120}
            fill="#ff4d6d"
            color="#ff4d6d"
            className="heart-burst pointer-events-none absolute"
            style={{ left: burstAt.x, top: burstAt.y, filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.55))" }}
            onAnimationEnd={() => setBurstAt(null)}
          />
        )}
      </div>

      <div className="flex items-center gap-4 px-3 pt-2">
        <button onClick={like} aria-label="Like" className="active:scale-90 transition-transform">
          <span key={popTick} className="inline-block heart-pop">
            <Heart
              size={26}
              fill={liked ? "#ff4d6d" : "transparent"}
              color={liked ? "#ff4d6d" : "white"}
            />
          </span>
        </button>
        <button
          onClick={openComments}
          aria-label="Comment"
          className="active:scale-90 transition-transform"
        >
          <span key={`bub-${bubbleTick}`} className="inline-block icon-bubble-pop"><MessageCircle size={26} /></span>
        </button>
        <button
          onClick={share}
          aria-label="Share"
          className="active:scale-90 transition-transform"
        >
          <span key={`snd-${sendTick}`} className="inline-block icon-send-fly"><Send size={26} /></span>
        </button>
        <button onClick={save} className="ml-auto active:scale-90 transition-transform" aria-label="Save">
          <span key={`bm-${bookmarkTick}`} className="inline-block icon-bookmark-snap"><Bookmark size={26} fill={saved ? "white" : "transparent"} /></span>
        </button>
      </div>

      {shareMsg && (
        <p className="px-3 pt-1 text-xs text-white/70">{shareMsg}</p>
      )}

      <div className="px-3 pt-1">
        {likes > 0 && (
          <p className="text-sm">
            {post.top_liker ? (
              <>
                Liked by <span className="font-semibold">{post.top_liker.username}</span>
                {likes > 1 && <> and <span className="font-semibold">{formatCount(likes - 1)} others</span></>}
              </>
            ) : (
              <span className="font-semibold">{formatCount(likes)} likes</span>
            )}
          </p>
        )}

        {post.caption && (
          <p className="text-sm mt-0.5">
            <Link href={`/u/${post.author_username}`} className="font-semibold mr-1">
              {post.author_username}
            </Link>
            {post.caption}
          </p>
        )}

        {commentCount > 0 && (
          <button
            onClick={openComments}
            className="text-sm text-white/60 mt-0.5 cursor-pointer text-left"
          >
            View all {formatCount(commentCount)} comments
          </button>
        )}

        <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1">{timeAgo(post.created_at)} ago</p>

        <div className="flex items-center gap-3 mt-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-sm placeholder-white/40 outline-none"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          {comment && (
            <button
              onClick={send}
              disabled={isPending}
              className="text-sm font-semibold text-[color:var(--color-primary)]"
            >
              Post
            </button>
          )}
        </div>
      </div>

      {showComments && (
        <div
          className="sheet-backdrop"
          onClick={closeComments}
          role="presentation"
        >
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Comments"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sheet-handle" />
            <header className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)]">
              <span className="font-semibold text-sm">Comments</span>
              <button onClick={closeComments} aria-label="Close" className="text-white/80">
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {post.caption && (
                <div className="flex items-start gap-3">
                  <Avatar username={post.author_username} avatarUrl={post.author_avatar} size={32} />
                  <div className="text-sm">
                    <Link href={`/u/${post.author_username}`} className="font-semibold mr-1">
                      {post.author_username}
                    </Link>
                    {post.caption}
                    <div className="text-[11px] text-white/50 mt-1">{timeAgo(post.created_at)} ago</div>
                  </div>
                </div>
              )}

              {loadingComments ? (
                <p className="text-sm text-white/60">Loading…</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-white/60">No comments yet. Be the first.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <Avatar username={c.username} avatarUrl={c.avatar_url} size={32} />
                    <div className="text-sm">
                      <Link href={`/u/${c.username}`} className="font-semibold mr-1">
                        {c.username}
                      </Link>
                      {c.content}
                      <div className="text-[11px] text-white/50 mt-1">{timeAgo(c.created_at)} ago</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[color:var(--color-border)] px-3 py-2 flex items-center gap-2">
              <input
                ref={modalInputRef}
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 bg-transparent text-sm placeholder-white/40 outline-none px-1 py-2"
                onKeyDown={(e) => e.key === "Enter" && sendModal()}
              />
              <button
                onClick={sendModal}
                disabled={isPending || !modalText.trim()}
                className="text-sm font-semibold text-[color:var(--color-primary)] disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
