"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Send, MoreHorizontal, Volume2, VolumeX, Heart } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { timeAgo, cn } from "@/lib/utils";
import { toggleStoryLike, markStoryViewed, reactToStory } from "@/app/actions";
import type { Story } from "@/lib/database.types";

const IMAGE_DURATION_MS = 5000;

type LikeMap = Record<string, { liked: boolean; count: number }>;

export function StoryViewer({
  author,
  stories,
  currentUserId,
  initialLikes,
}: {
  author: { id: string; username: string; avatar_url: string | null };
  stories: Story[];
  currentUserId?: string;
  initialLikes?: LikeMap;
}) {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [likes, setLikes] = useState<LikeMap>(() => initialLikes ?? {});
  // Flying emojis triggered when the viewer taps a quick-reaction.
  const [bursts, setBursts] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  // Last-react counter chip — '+N <emoji>'.
  const [reactPulse, setReactPulse] = useState<{ key: number; emoji: string; n: number } | null>(null);
  const [, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const s = stories[idx];
  const isVideo = s?.media_type === "video";
  const isOwn = currentUserId === author.id;
  const likeState = (s && likes[s.id]) || { liked: false, count: 0 };

  const onToggleLike = () => {
    if (!s || isOwn) return; // Don't let authors like their own stories.
    // Optimistic update.
    const prev = likes[s.id] ?? { liked: false, count: 0 };
    const optimistic: LikeMap = {
      ...likes,
      [s.id]: {
        liked: !prev.liked,
        count: prev.count + (prev.liked ? -1 : 1),
      },
    };
    setLikes(optimistic);
    startTransition(async () => {
      const res = await toggleStoryLike(s.id);
      if (res && "liked" in res && typeof res.liked === "boolean") {
        // Reconcile with server truth.
        setLikes((m) => ({
          ...m,
          [s.id]: { liked: res.liked, count: res.count ?? 0 },
        }));
      } else {
        // Roll back on error.
        setLikes((m) => ({ ...m, [s.id]: prev }));
      }
    });
  };

  // Mark each story as viewed the moment it appears (idempotent on server).
  useEffect(() => {
    if (!s || !currentUserId || isOwn) return;
    const id = s.id;
    startTransition(() => { markStoryViewed(id); });
  }, [s, currentUserId, isOwn, startTransition]);

  const sendReaction = (emoji: string) => {
    if (!s || isOwn) return;
    const id = Date.now() + Math.random();
    const left = 30 + Math.random() * 40; // 30-70% horizontally
    setBursts((b) => [...b, { id, emoji, left }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1200);
    setReactPulse((rp) => ({ key: id, emoji, n: rp && rp.emoji === emoji ? rp.n + 1 : 1 }));
    setTimeout(() => setReactPulse(null), 1100);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(8);
    }
    startTransition(() => { reactToStory(s.id, emoji); });
  };

  const next = () => {
    if (idx < stories.length - 1) setIdx(idx + 1);
    else if (typeof window !== "undefined") window.history.back();
  };
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  // Image auto-advance + progress (pauses while user holds the screen).
  useEffect(() => {
    if (!s || isVideo || paused) return;
    const startedAt = Date.now() - (progress / 100) * IMAGE_DURATION_MS;
    const t = setInterval(() => {
      const p = (Date.now() - startedAt) / IMAGE_DURATION_MS;
      if (p >= 1) {
        clearInterval(t);
        next();
      } else {
        setProgress(p * 100);
      }
    }, 50);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, isVideo, paused]);

  // Reset progress when the story changes (separate from the timer effect).
  useEffect(() => { setProgress(0); }, [idx]);

  // Video progress + ended
  useEffect(() => {
    if (!s || !isVideo) return;
    setProgress(0);
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (v.duration > 0 && isFinite(v.duration)) {
        setProgress(Math.min(100, (v.currentTime / v.duration) * 100));
      }
    };
    const onEnded = () => next();
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    // Try unmuted first - user tapped to open so autoplay should work.
    // If the browser blocks it, fall back to muted playback.
    v.muted = muted;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {
        /* give up */
      });
    });
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, isVideo]);

  // Keep <video> in sync when the user toggles mute.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (!muted && v.paused && !paused) {
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
      });
    }
  }, [muted, paused]);

  // Tap-and-hold pauses the story (Instagram-style).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => {});
  }, [paused]);

  if (!s) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="px-2 pt-3 pb-2 flex gap-1">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/25 rounded overflow-hidden">
            <div
              className="h-full"
              style={{
                width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%",
                background: "var(--gradient-brand)",
              }}
            />
          </div>
        ))}
      </div>
      <div className="story-glass-bar flex items-center gap-3 px-3 py-2 mx-2 rounded-full">
        <Avatar username={author.username} avatarUrl={author.avatar_url} size={36} />
        <div className="flex-1">
          <div className="text-sm font-semibold">{author.username}</div>
          <div className="text-[11px] text-white/70">{timeAgo(s.created_at)}</div>
        </div>
        {isVideo && (
          <button
            type="button"
            aria-label={muted ? "Unmute story" : "Mute story"}
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
        <button aria-label="More">
          <MoreHorizontal size={22} />
        </button>
        <Link href="/feed" aria-label="Close">
          <X size={26} />
        </Link>
      </div>

      <div className="flex-1 relative">
        {isVideo ? (
          <video
            ref={videoRef}
            key={s.id}
            src={s.image_url}
            playsInline
            autoPlay
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        ) : (
          <Image src={s.image_url} alt="" fill className="object-contain" unoptimized />
        )}
        {/* Text overlay rendered live by the viewer (not baked into media). */}
        {((s as unknown as { overlay_text?: string | null }).overlay_text ?? "").trim() && (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 px-4 text-center font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
            style={{
              top: `${
                ((s as unknown as { overlay_y?: number | null }).overlay_y ?? 0.5) * 100
              }%`,
              transform: "translate(-50%, -50%)",
              color:
                (s as unknown as { overlay_color?: string | null }).overlay_color ??
                "#ffffff",
              fontSize: "clamp(20px, 5vw, 36px)",
              maxWidth: "90%",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {(s as unknown as { overlay_text?: string | null }).overlay_text}
          </div>
        )}
        {/* Story audio: looped, autoplay (best-effort, browsers may need a tap). */}
        {(s as unknown as { audio_url?: string | null }).audio_url && (
          <audio
            key={`audio-${s.id}`}
            src={(s as unknown as { audio_url: string }).audio_url}
            autoPlay
            loop
            className="hidden"
          />
        )}
        {/* Flying emoji bursts from quick-react. */}
        {bursts.map((b) => (
          <span
            key={b.id}
            className="float-up pointer-events-none absolute text-5xl"
            style={{ left: `${b.left}%`, bottom: 80 }}
          >
            {b.emoji}
          </span>
        ))}
        {/* Floating +N ❤️ counter when bursts fire. */}
        {reactPulse && (
          <div
            key={reactPulse.key}
            className="counter-pulse pointer-events-none absolute top-4 right-4 text-sm font-bold px-3 py-1 rounded-full bg-black/40 backdrop-blur-md"
          >
            +{reactPulse.n} {reactPulse.emoji}
          </div>
        )}
        {/* Hold-to-pause + tap-to-advance gesture overlay. */}
        <div
          className="absolute inset-0 z-10 flex"
          onPointerDown={(e) => {
            (e.currentTarget as HTMLElement).dataset.startX = String(e.clientX);
            (e.currentTarget as HTMLElement).dataset.startT = String(Date.now());
            setPaused(true);
          }}
          onPointerUp={(e) => {
            setPaused(false);
            const el = e.currentTarget as HTMLElement;
            const startX = Number(el.dataset.startX ?? e.clientX);
            const startT = Number(el.dataset.startT ?? Date.now());
            const dx = e.clientX - startX;
            const dt = Date.now() - startT;
            // Quick tap (< 250ms, < 8px movement) advances/rewinds.
            if (dt < 250 && Math.abs(dx) < 8) {
              const rect = el.getBoundingClientRect();
              const tapX = e.clientX - rect.left;
              if (tapX < rect.width / 3) prev();
              else next();
            }
          }}
          onPointerCancel={() => setPaused(false)}
          aria-label="Story controls"
        />
      </div>

      {/* Quick-react tap-bar — only shown when not the author. */}
      {!isOwn && (
        <div className="flex items-center justify-around px-4 py-2 bg-black/30">
          {["\u2764\ufe0f","\ud83d\udd25","\ud83d\udc4f","\ud83d\ude02","\ud83d\ude2e"].map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => sendReaction(e)}
              className="text-2xl active:scale-90 transition-transform p-1"
              aria-label={`React with ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      )}
      <div className="p-3 border-t border-white/10 flex items-center gap-2">
        <div
          className={cn(
            "flex-1 h-10 rounded-full border border-white/40 px-3 flex items-center text-sm text-white/70",
          )}
        >
          Send Message
        </div>
        {!isOwn && (
          <button
            type="button"
            onClick={onToggleLike}
            aria-label={likeState.liked ? "Unlike story" : "Like story"}
            className="flex items-center gap-1 px-1"
          >
            <Heart
              size={26}
              className={cn(
                "transition-transform active:scale-90",
                likeState.liked
                  ? "fill-[color:var(--color-danger,#ED4956)] text-[color:var(--color-danger,#ED4956)]"
                  : "text-white",
              )}
            />
          </button>
        )}
        {isOwn && likeState.count > 0 && (
          <div className="flex items-center gap-1 text-sm text-white/90 px-2">
            <Heart size={18} className="fill-white text-white" />
            {likeState.count}
          </div>
        )}
        <button aria-label="Send">
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
