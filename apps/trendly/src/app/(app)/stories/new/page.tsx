"use client";
import Link from "next/link";
import Image from "next/image";
import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Loader2, Scissors, Play, Pause } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createStory } from "@/app/actions";

const MAX_STORY_VIDEO_SEC = 60;
const THUMBS = 8;

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      const d = v.duration;
      URL.revokeObjectURL(v.src);
      if (!isFinite(d)) reject(new Error("Could not read duration"));
      else resolve(d);
    };
    v.onerror = () => {
      URL.revokeObjectURL(v.src);
      reject(new Error("Could not read video"));
    };
    v.src = URL.createObjectURL(file);
  });
}

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const s = Math.floor(t);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function pickRecorderMime(): string {
  const MR = (typeof window !== "undefined"
    ? (window as unknown as { MediaRecorder?: typeof MediaRecorder }).MediaRecorder
    : undefined);
  if (!MR) return "";
  const candidates = [
    "video/mp4;codecs=h264,aac",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const c of candidates) {
    if (MR.isTypeSupported && MR.isTypeSupported(c)) return c;
  }
  return "";
}

type Media = { url: string; type: "image" | "video" } | null;

type TrimState = {
  file: File;
  objectUrl: string;
  duration: number;
  thumbs: string[];
};

export default function NewStoryPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Controlled hidden-input values — survive re-renders triggered by useActionState.
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaTypeForForm, setMediaTypeForForm] = useState<string>("");

  const [media, setMedia] = useState<Media>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [trim, setTrim] = useState<TrimState | null>(null);
  const [start, setStart] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const trimVideoRef = useRef<HTMLVideoElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ startX: number; origStart: number } | null>(null);

  const end = useMemo(() => {
    if (!trim) return 0;
    return Math.min(trim.duration, start + MAX_STORY_VIDEO_SEC);
  }, [start, trim]);
  const clipLen = end - start;

  const [state, formAction, pending] = useActionState(
    async (_: unknown, fd: FormData) => await createStory(fd),
    null,
  );

  const uploadToStorage = async (file: Blob, kind: "image" | "video", ext: string) => {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    const uid = authData.user?.id;
    if (!uid) {
      setErr("Not signed in");
      return;
    }
    const path = `${uid}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    setUploading(true);
    setProgress(kind === "video" ? "Uploading video..." : "Uploading photo...");
    try {
      const { error: upErr } = await supabase.storage.from("stories").upload(path, file, {
        contentType: file.type || (kind === "video" ? "video/webm" : "image/jpeg"),
        upsert: false,
      });
      if (upErr) throw upErr;
      const {
        data: { publicUrl },
      } = supabase.storage.from("stories").getPublicUrl(path);
      setMedia({ url: publicUrl, type: kind });
      setMediaUrl(publicUrl);
      setMediaTypeForForm(kind);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const makeThumbs = async (file: File, duration: number): Promise<string[]> => {
    const thumbs: string[] = [];
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.src = URL.createObjectURL(file);
    await new Promise<void>((res, rej) => {
      v.onloadedmetadata = () => res();
      v.onerror = () => rej(new Error("thumb load"));
    });
    const w = 80;
    const h = Math.max(1, Math.round((v.videoHeight / Math.max(1, v.videoWidth)) * w));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    for (let i = 0; i < THUMBS; i++) {
      const t = (duration * i) / Math.max(1, THUMBS - 1);
      v.currentTime = Math.min(duration - 0.05, Math.max(0, t));
      await new Promise<void>((res) => {
        const onSeeked = () => {
          v.removeEventListener("seeked", onSeeked);
          res();
        };
        v.addEventListener("seeked", onSeeked);
      });
      ctx.drawImage(v, 0, 0, w, h);
      thumbs.push(canvas.toDataURL("image/jpeg", 0.6));
    }
    URL.revokeObjectURL(v.src);
    return thumbs;
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setErr(null);

    if (f.type.startsWith("video/")) {
      try {
        const dur = await getVideoDuration(f);
        if (dur <= MAX_STORY_VIDEO_SEC) {
          await uploadToStorage(f, "video", (f.name.split(".").pop() || "mp4").toLowerCase());
          return;
        }
        const objectUrl = URL.createObjectURL(f);
        setProgress("Preparing video...");
        const thumbs = await makeThumbs(f, dur).catch(() => [] as string[]);
        setProgress(null);
        setTrim({ file: f, objectUrl, duration: dur, thumbs });
        setStart(0);
        setPlaying(false);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Could not read video");
        setProgress(null);
      }
      return;
    }
    if (f.type.startsWith("image/")) {
      await uploadToStorage(f, "image", (f.name.split(".").pop() || "jpg").toLowerCase());
      return;
    }
    setErr("Unsupported file type - pick a photo or video");
  };

  useEffect(() => {
    if (!trim) return;
    const v = trimVideoRef.current;
    if (!v) return;
    v.currentTime = start;
    setCurrentTime(start);
  }, [start, trim]);

  useEffect(() => {
    if (!trim) return;
    const v = trimVideoRef.current;
    if (!v) return;
    const onTime = () => {
      setCurrentTime(v.currentTime);
      if (v.currentTime >= end - 0.02) {
        v.pause();
        v.currentTime = start;
        setPlaying(false);
      }
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [trim, start, end]);

  const onTrackPointerDown = (e: React.PointerEvent) => {
    if (!trim || !trackRef.current) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, origStart: start };
  };
  const onTrackPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !trim || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const dx = e.clientX - dragRef.current.startX;
    const dt = (dx / rect.width) * trim.duration;
    const maxStart = Math.max(0, trim.duration - MAX_STORY_VIDEO_SEC);
    const next = Math.min(maxStart, Math.max(0, dragRef.current.origStart + dt));
    setStart(next);
  };
  const onTrackPointerUp = () => {
    dragRef.current = null;
  };

  const togglePlay = () => {
    const v = trimVideoRef.current;
    if (!v || !trim) return;
    if (playing) {
      v.pause();
      setPlaying(false);
      return;
    }
    if (v.currentTime < start || v.currentTime >= end - 0.02) {
      v.currentTime = start;
    }
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const uploadWithClip = useCallback(
    async (file: File, startSec: number, endSec: number) => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData.user?.id;
      if (!uid) throw new Error("Not signed in");
      const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
      const path = `${uid}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("stories")
        .upload(path, file, {
          contentType: file.type || "video/mp4",
          upsert: false,
        });
      if (upErr) throw upErr;
      const {
        data: { publicUrl },
      } = supabase.storage.from("stories").getPublicUrl(path);
      // Media fragment tells <video> to play only this window.
      const clipped = `${publicUrl}#t=${startSec.toFixed(2)},${endSec.toFixed(2)}`;
      setMedia({ url: clipped, type: "video" });
      setMediaUrl(clipped);
      setMediaTypeForForm("video");
    },
    [],
  );

  const confirmTrim = useCallback(async () => {
    if (!trim) return;
    setErr(null);
    setUploading(true);

    // Try to re-encode the 60s window with MediaRecorder so the uploaded file
    // is actually small. If the browser can't do that, fall back to uploading
    // the original and using a media fragment (#t=start,end) on playback.
    try {
      const video = document.createElement("video");
      video.src = trim.objectUrl;
      video.muted = false;
      video.playsInline = true;
      video.preload = "auto";

      await new Promise<void>((res, rej) => {
        video.onloadedmetadata = () => res();
        video.onerror = () => rej(new Error("video load failed"));
      });

      const VideoEl = video as HTMLVideoElement & {
        captureStream?: () => MediaStream;
        mozCaptureStream?: () => MediaStream;
      };
      const canCapture = typeof VideoEl.captureStream === "function" ||
        typeof VideoEl.mozCaptureStream === "function";
      const hasRecorder = typeof window !== "undefined" &&
        typeof (window as unknown as { MediaRecorder?: unknown }).MediaRecorder !== "undefined";

      if (!canCapture || !hasRecorder) {
        setProgress("Uploading original (trim applied on playback)...");
        await uploadWithClip(trim.file, start, end);
        URL.revokeObjectURL(trim.objectUrl);
        setTrim(null);
        setPlaying(false);
        setUploading(false);
        setProgress(null);
        return;
      }

      setProgress("Trimming...");
      video.currentTime = start;
      await new Promise<void>((res) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          res();
        };
        video.addEventListener("seeked", onSeeked);
      });

      const stream = (VideoEl.captureStream?.() ?? VideoEl.mozCaptureStream?.()) as
        | MediaStream
        | undefined;
      if (!stream) {
        setProgress("Uploading original (trim applied on playback)...");
        await uploadWithClip(trim.file, start, end);
        URL.revokeObjectURL(trim.objectUrl);
        setTrim(null);
        setPlaying(false);
        setUploading(false);
        setProgress(null);
        return;
      }

      const mime = pickRecorderMime();
      const ext = mime.startsWith("video/mp4") ? "mp4" : "webm";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      const done: Promise<Blob> = new Promise((res) => {
        rec.onstop = () => res(new Blob(chunks, { type: mime || "video/webm" }));
      });

      const onTime = () => {
        if (video.currentTime >= end - 0.02) {
          video.pause();
          try {
            rec.stop();
          } catch {}
        }
      };
      video.addEventListener("timeupdate", onTime);

      rec.start(100);
      await video.play();
      const blob = await done;
      video.removeEventListener("timeupdate", onTime);

      setProgress("Uploading trimmed video...");
      const file = new File([blob], `clip.${ext}`, { type: blob.type });
      await uploadToStorage(file, "video", ext);

      URL.revokeObjectURL(trim.objectUrl);
      setTrim(null);
      setPlaying(false);
    } catch (e: unknown) {
      // Last-resort fallback: upload original and clip on playback.
      try {
        setProgress("Uploading original (trim applied on playback)...");
        await uploadWithClip(trim.file, start, end);
        URL.revokeObjectURL(trim.objectUrl);
        setTrim(null);
        setPlaying(false);
      } catch (e2: unknown) {
        setErr(
          (e2 instanceof Error ? e2.message : null) ||
            (e instanceof Error ? e.message : "Trim failed"),
        );
      } finally {
        setUploading(false);
        setProgress(null);
      }
    }
  }, [trim, start, end, uploadWithClip]);

  const cancelTrim = () => {
    if (trim) URL.revokeObjectURL(trim.objectUrl);
    setTrim(null);
    setPlaying(false);
    setStart(0);
  };

  const reset = () => {
    setMedia(null);
    setErr(null);
    setProgress(null);
    setMediaUrl("");
    setMediaTypeForForm("");
  };

  if (trim) {
    const maxStart = Math.max(0, trim.duration - MAX_STORY_VIDEO_SEC);
    const winLeft = (start / trim.duration) * 100;
    const winWidth = (clipLen / trim.duration) * 100;
    const playheadLeft = (currentTime / trim.duration) * 100;

    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
        <header className="h-12 px-3 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={cancelTrim}
            disabled={uploading}
            className="text-sm disabled:opacity-40"
          >
            Cancel
          </button>
          <span className="font-semibold flex items-center gap-1">
            <Scissors size={16} /> Trim to 60s
          </span>
          <button
            type="button"
            onClick={confirmTrim}
            disabled={uploading}
            className="text-[color:var(--color-primary)] font-semibold disabled:opacity-50 min-w-[56px] text-right"
          >
            {uploading ? <Loader2 size={18} className="animate-spin inline" /> : "Next"}
          </button>
        </header>

        <div className="flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={trimVideoRef}
            src={trim.objectUrl}
            playsInline
            className="w-full h-full object-contain"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>

        <div className="px-3 pt-2 pb-2 flex items-center justify-between text-xs text-white/70 flex-shrink-0">
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className="tabular-nums">
            {fmt(start)} - {fmt(end)} ({fmt(clipLen)}) / {fmt(trim.duration)}
          </span>
        </div>

        <div className="px-3 pb-4 flex-shrink-0">
          <div
            ref={trackRef}
            className="relative h-14 rounded overflow-hidden bg-neutral-900"
          >
            <div className="absolute inset-0 flex">
              {trim.thumbs.length === 0
                ? Array.from({ length: THUMBS }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-r border-black/40 last:border-r-0"
                    />
                  ))
                : trim.thumbs.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="flex-1 min-w-0 h-full object-cover border-r border-black/40 last:border-r-0"
                      draggable={false}
                    />
                  ))}
            </div>
            <div
              className="absolute top-0 bottom-0 bg-black/60"
              style={{ left: 0, width: `${winLeft}%` }}
            />
            <div
              className="absolute top-0 bottom-0 bg-black/60"
              style={{ left: `${winLeft + winWidth}%`, right: 0 }}
            />
            <div
              onPointerDown={onTrackPointerDown}
              onPointerMove={onTrackPointerMove}
              onPointerUp={onTrackPointerUp}
              onPointerCancel={onTrackPointerUp}
              className="absolute top-0 bottom-0 border-2 border-[color:var(--color-primary)] rounded cursor-grab active:cursor-grabbing touch-none"
              style={{ left: `${winLeft}%`, width: `${winWidth}%` }}
              role="slider"
              aria-label="Trim window"
              aria-valuemin={0}
              aria-valuemax={maxStart}
              aria-valuenow={start}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
              style={{ left: `${playheadLeft}%` }}
            />
          </div>
          <p className="text-[11px] text-white/50 mt-2">
            Drag the highlighted box to pick any 60-second window from your video.
          </p>
        </div>

        {progress && (
          <p className="px-4 pb-3 text-xs text-white/70 text-center">{progress}</p>
        )}
        {err && (
          <p className="px-4 pb-3 text-center text-[color:var(--color-danger)] text-sm">
            {err}
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col h-dvh">
      <header className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <Link href="/feed" aria-label="Cancel">
          <ChevronLeft size={28} />
        </Link>
        <span className="font-semibold">New Story</span>
        <button
          type="submit"
          disabled={!media || pending || uploading}
          className={`text-sm font-semibold ${
            media && !pending && !uploading
              ? "text-[color:var(--color-primary)]"
              : "text-white/30"
          }`}
        >
          {pending ? "Sharing..." : "Share"}
        </button>
      </header>

      <div
        className="flex-1 relative bg-neutral-900 flex items-center justify-center cursor-pointer"
        onClick={() => !media && !uploading && fileRef.current?.click()}
      >
        {media ? (
          media.type === "video" ? (
            <video
              src={media.url}
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <Image src={media.url} alt="" fill className="object-contain" unoptimized />
          )
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 text-white/80">
            <Loader2 className="animate-spin" />
            <span className="text-sm">{progress ?? "Uploading..."}</span>
          </div>
        ) : (
          <div className="text-center text-white/60 text-sm px-6">
            <div>Tap to pick a photo or video</div>
            <div className="mt-1 text-xs text-white/40">
              Longer videos let you pick any 60-second clip . stories disappear after 24h
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={onFile}
        />
      </div>

      {media && (
        <div className="flex items-center justify-end px-3 py-2 border-t border-[color:var(--color-border)]">
          <button
            type="button"
            onClick={reset}
            className="text-xs text-white/70 hover:text-white"
          >
            Pick a different file
          </button>
        </div>
      )}

      {err && (
        <p className="px-4 py-2 text-[color:var(--color-danger)] text-sm">{err}</p>
      )}
      {state?.error && (
        <p className="px-4 py-2 text-[color:var(--color-danger)] text-sm">{state.error}</p>
      )}

      {/* Add text + music to your story (rendered live by the viewer). */}
      {media && (
        <div className="px-4 py-3 space-y-2 border-t border-white/10">
          <input
            type="text"
            name="overlay_text"
            placeholder="Add text…"
            maxLength={120}
            className="w-full bg-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/40 outline-none"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60 w-12">Color</span>
            <input
              type="color"
              name="overlay_color"
              defaultValue="#ffffff"
              className="w-8 h-8 rounded bg-transparent cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/60 w-12 cursor-pointer">
              Music
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 8 * 1024 * 1024) {
                  setErr("Audio file too large (max 8MB)");
                  return;
                }
                setErr(null);
                try {
                  const supabase = createClient();
                  const { data: authData } = await supabase.auth.getUser();
                  const uid = authData.user?.id;
                  if (!uid) {
                    setErr("Not signed in");
                    return;
                  }
                  const ext = (f.name.split(".").pop() || "mp3").toLowerCase();
                  const path = `${uid}/${Date.now()}-${crypto
                    .randomUUID()
                    .slice(0, 8)}.${ext}`;
                  const { error: upErr } = await supabase.storage
                    .from("stories")
                    .upload(path, f, {
                      contentType: f.type || "audio/mpeg",
                    });
                  if (upErr) throw upErr;
                  const {
                    data: { publicUrl },
                  } = supabase.storage.from("stories").getPublicUrl(path);
                  const audioInput = document.querySelector<HTMLInputElement>(
                    'input[name="audio_url"]',
                  );
                  if (audioInput) audioInput.value = publicUrl;
                } catch (err) {
                  setErr(
                    err instanceof Error ? err.message : "Audio upload failed",
                  );
                }
              }}
              className="text-xs text-white/80 file:bg-white/10 file:text-white file:rounded file:border-0 file:px-2 file:py-1 file:mr-2"
            />
          </div>
          <input type="hidden" name="audio_url" defaultValue="" />
        </div>
      )}

      <input type="hidden" name="media_url" value={mediaUrl} readOnly />
      <input type="hidden" name="media_type" value={mediaTypeForForm} readOnly />
    </form>
  );
}
