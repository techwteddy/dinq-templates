"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  Loader2,
  RotateCw,
  SlidersHorizontal,
  Crop,
  Type as TypeIcon,
  X,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createPost } from "@/app/actions";

const MAX_VIDEO_SEC = 180; // 3 minutes
const VIEWPORT = 320;
const OUTPUT = 1080;

type Mode = "idle" | "edit" | "ready";
type MediaType = "image" | "video";

type Filter = {
  name: string;
  // CSS filter string used both for preview and canvas export.
  filter: string;
};

const FILTERS: Filter[] = [
  { name: "Normal", filter: "none" },
  { name: "Clarendon", filter: "contrast(1.2) saturate(1.35)" },
  { name: "Juno", filter: "saturate(1.4) contrast(1.1)" },
  { name: "Lark", filter: "brightness(1.1) contrast(0.9) saturate(1.1)" },
  { name: "Moon", filter: "grayscale(1) brightness(1.1) contrast(1.1)" },
  { name: "Gingham", filter: "brightness(1.05) sepia(0.25) contrast(0.9)" },
  { name: "Reyes", filter: "sepia(0.4) saturate(0.9) brightness(1.05)" },
  { name: "Warm", filter: "sepia(0.5) saturate(1.3) hue-rotate(-15deg)" },
  { name: "Cool", filter: "saturate(1.1) hue-rotate(15deg) brightness(1.05)" },
];

// Greedy word-wrap helper for overlay text rendered on the canvas.
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const out: string[] = [];
  for (const para of text.split(/\r?\n/)) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      out.push("");
      continue;
    }
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

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

export function PostComposer({ userId }: { userId: string }) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [state, formAction, pending] = useActionState(
    async (_: unknown, fd: FormData) => await createPost(fd),
    null,
  );

  const [mode, setMode] = useState<Mode>("idle");
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // blob: URL or public URL
  // Controlled hidden-input values — must survive re-renders so the form
  // action receives them on submit.
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaTypeForForm, setMediaTypeForForm] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Image-editor state
  const [editorImg, setEditorImg] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [filterIdx, setFilterIdx] = useState(0);
  const [tab, setTab] = useState<"crop" | "filter" | "text">("crop");
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  // Text-overlay state — text is rendered as a draggable layer above the
  // image during editing, then baked into the canvas on confirm.
  const [overlayText, setOverlayText] = useState("");
  const [overlayPos, setOverlayPos] = useState({ x: 0, y: 0 });
  const [overlayColor, setOverlayColor] = useState("#ffffff");
  const [overlaySize, setOverlaySize] = useState(36); // px relative to viewport
  const overlayDragRef = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);

  const effective = useMemo(() => {
    if (!editorImg) return { w: 0, h: 0 };
    const rot = ((rotation % 360) + 360) % 360;
    const swap = rot === 90 || rot === 270;
    return {
      w: (swap ? editorImg.height : editorImg.width) * scale,
      h: (swap ? editorImg.width : editorImg.height) * scale,
    };
  }, [editorImg, scale, rotation]);

  const minScale = useMemo(() => {
    if (!editorImg) return 1;
    const rot = ((rotation % 360) + 360) % 360;
    const swap = rot === 90 || rot === 270;
    const w = swap ? editorImg.height : editorImg.width;
    const h = swap ? editorImg.width : editorImg.height;
    return Math.max(VIEWPORT / w, VIEWPORT / h);
  }, [editorImg, rotation]);

  // Clamp pan within bounds
  useEffect(() => {
    const maxX = Math.max(0, (effective.w - VIEWPORT) / 2);
    const maxY = Math.max(0, (effective.h - VIEWPORT) / 2);
    setPos((p) => ({
      x: Math.min(maxX, Math.max(-maxX, p.x)),
      y: Math.min(maxY, Math.max(-maxY, p.y)),
    }));
  }, [effective.w, effective.h]);

  const resetAll = useCallback(() => {
    setMode("idle");
    setMediaType(null);
    setPreviewUrl(null);
    setEditorImg(null);
    setScale(1);
    setPos({ x: 0, y: 0 });
    setRotation(0);
    setFilterIdx(0);
    setTab("crop");
    setOverlayText("");
    setOverlayPos({ x: 0, y: 0 });
    setOverlayColor("#ffffff");
    setOverlaySize(36);
    setErr(null);
    setProgress(null);
    setMediaUrl("");
    setMediaTypeForForm("");
  }, []);

  const onPickClick = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setErr(null);

    if (f.type.startsWith("video/")) {
      try {
        const dur = await getVideoDuration(f);
        if (dur > MAX_VIDEO_SEC) {
          setErr(
            `Video is ${Math.round(dur)}s — max is 3 minutes (${MAX_VIDEO_SEC}s).`,
          );
          return;
        }
        await uploadVideo(f);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Could not read video");
      }
      return;
    }

    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      const img = new window.Image();
      img.onload = () => {
        setEditorImg(img);
        const s = Math.max(VIEWPORT / img.width, VIEWPORT / img.height);
        setScale(s);
        setPos({ x: 0, y: 0 });
        setRotation(0);
        setFilterIdx(0);
        setTab("crop");
        setMode("edit");
      };
      img.onerror = () => setErr("Could not open image");
      img.src = url;
      return;
    }

    setErr("Unsupported file type — pick an image or video");
  };

  async function uploadVideo(f: File) {
    setUploading(true);
    setProgress("Uploading video…");
    try {
      const supabase = createClient();
      const ext = (f.name.split(".").pop() || "mp4").toLowerCase();
      const path = `${userId}/${Date.now()}-${crypto
        .randomUUID()
        .slice(0, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("posts")
        .upload(path, f, {
          contentType: f.type || "video/mp4",
          upsert: false,
        });
      if (upErr) throw upErr;
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(path);

      setPreviewUrl(publicUrl);
      setMediaType("video");
      setMediaUrl(publicUrl);
      setMediaTypeForForm("video");
      setMode("ready");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const maxX = Math.max(0, (effective.w - VIEWPORT) / 2);
    const maxY = Math.max(0, (effective.h - VIEWPORT) / 2);
    const nx = Math.min(maxX, Math.max(-maxX, dragRef.current.px + dx));
    const ny = Math.min(maxY, Math.max(-maxY, dragRef.current.py + dy));
    setPos({ x: nx, y: ny });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onConfirmEdit = useCallback(async () => {
    if (!editorImg) return;
    setUploading(true);
    setErr(null);
    setProgress("Uploading photo…");
    try {
      const OUT = OUTPUT;
      const canvas = document.createElement("canvas");
      canvas.width = OUT;
      canvas.height = OUT;
      const ctx = canvas.getContext("2d")!;
      // Apply CSS filter to the output
      ctx.filter = FILTERS[filterIdx].filter;

      const k = OUT / VIEWPORT;
      ctx.save();
      // Move origin to viewport-center in output space, plus user's pan
      ctx.translate(OUT / 2 + pos.x * k, OUT / 2 + pos.y * k);
      ctx.rotate((rotation * Math.PI) / 180);
      const drawW = editorImg.width * scale * k;
      const drawH = editorImg.height * scale * k;
      ctx.drawImage(editorImg, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Bake the text overlay (if any) on top of the filtered/cropped image.
      if (overlayText.trim()) {
        ctx.filter = "none"; // text shouldn't get the photo filter
        ctx.save();
        const fontPx = Math.round(overlaySize * k);
        ctx.font = `bold ${fontPx}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Soft drop shadow so light text stays legible on light backgrounds.
        ctx.shadowColor = "rgba(0,0,0,0.55)";
        ctx.shadowBlur = Math.max(2, fontPx * 0.08);
        ctx.shadowOffsetY = Math.max(1, fontPx * 0.04);
        ctx.fillStyle = overlayColor;
        const tx = OUT / 2 + overlayPos.x * k;
        const ty = OUT / 2 + overlayPos.y * k;
        // Word-wrap so very long captions don't run off the canvas.
        const lines = wrapText(ctx, overlayText, OUT * 0.9);
        const lineHeight = fontPx * 1.15;
        const totalH = lines.length * lineHeight;
        lines.forEach((line, i) => {
          const ly = ty - totalH / 2 + lineHeight / 2 + i * lineHeight;
          ctx.fillText(line, tx, ly);
        });
        ctx.restore();
      }

      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob(
          (b) => (b ? res(b) : rej(new Error("Could not encode image"))),
          "image/jpeg",
          0.92,
        ),
      );

      const supabase = createClient();
      const path = `${userId}/${Date.now()}-${crypto
        .randomUUID()
        .slice(0, 8)}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("posts")
        .upload(path, blob, {
          contentType: "image/jpeg",
          upsert: false,
          cacheControl: "3600",
        });
      if (upErr) throw upErr;

      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(path);

      setPreviewUrl(publicUrl);
      setMediaType("image");
      setMediaUrl(publicUrl);
      setMediaTypeForForm("image");
      setMode("ready");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }, [editorImg, filterIdx, pos.x, pos.y, rotation, scale, userId]);

  // ---------- Render ----------

  if (mode === "edit" && editorImg) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
        <header className="h-12 px-3 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={() => !uploading && resetAll()}
            aria-label="Cancel"
            className="disabled:opacity-40"
            disabled={uploading}
          >
            <X size={24} />
          </button>
          <span className="font-semibold">Edit photo</span>
          <button
            type="button"
            onClick={onConfirmEdit}
            disabled={uploading}
            className="text-[color:var(--color-primary)] font-semibold disabled:opacity-50 min-w-[56px] text-right"
          >
            {uploading ? <Loader2 size={18} className="animate-spin inline" /> : "Next"}
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center bg-black">
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative overflow-hidden touch-none select-none"
            style={{
              width: VIEWPORT,
              height: VIEWPORT,
              outline: "2px solid rgba(255,255,255,0.9)",
              cursor: dragRef.current ? "grabbing" : "grab",
              backgroundColor: "#111",
            }}
          >
            <img
              src={editorImg.src}
              alt=""
              draggable={false}
              style={{
                position: "absolute",
                width: editorImg.width * scale,
                height: editorImg.height * scale,
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                filter: FILTERS[filterIdx].filter,
                pointerEvents: "none",
              }}
            />
            {/* Grid overlay for rule-of-thirds when cropping */}
            {tab === "crop" && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 right-0 border-t border-white/25" />
                <div className="absolute top-2/3 left-0 right-0 border-t border-white/25" />
                <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/25" />
                <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/25" />
              </div>
            )}
            {/* Live text overlay — draggable when on the Text tab. */}
            {overlayText.trim() && (
              <div
                onPointerDown={(e) => {
                  if (tab !== "text") return;
                  e.stopPropagation();
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  overlayDragRef.current = {
                    x: e.clientX,
                    y: e.clientY,
                    px: overlayPos.x,
                    py: overlayPos.y,
                  };
                }}
                onPointerMove={(e) => {
                  if (!overlayDragRef.current) return;
                  e.stopPropagation();
                  const dx = e.clientX - overlayDragRef.current.x;
                  const dy = e.clientY - overlayDragRef.current.y;
                  const max = VIEWPORT / 2 - 20;
                  setOverlayPos({
                    x: Math.min(max, Math.max(-max, overlayDragRef.current.px + dx)),
                    y: Math.min(max, Math.max(-max, overlayDragRef.current.py + dy)),
                  });
                }}
                onPointerUp={() => {
                  overlayDragRef.current = null;
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translate(${overlayPos.x}px, ${overlayPos.y}px)`,
                  maxWidth: VIEWPORT * 0.9,
                  textAlign: "center",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
                  fontWeight: 700,
                  fontSize: overlaySize,
                  color: overlayColor,
                  textShadow: "0 2px 6px rgba(0,0,0,0.55)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  cursor: tab === "text" ? "grab" : "default",
                  pointerEvents: tab === "text" ? "auto" : "none",
                  touchAction: "none",
                  userSelect: "none",
                }}
              >
                {overlayText}
              </div>
            )}
          </div>
        </div>

        {tab === "crop" ? (
          <div className="px-6 pb-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60 w-10">Zoom</span>
              <input
                type="range"
                min={minScale}
                max={minScale * 4}
                step={0.01}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="flex-1 accent-white"
              />
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                aria-label="Rotate"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
              >
                <RotateCw size={18} />
              </button>
            </div>
          </div>
        ) : tab === "text" ? (
          <div className="px-3 pb-3 flex-shrink-0 space-y-2">
            <textarea
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              placeholder="Type your caption…"
              rows={2}
              className="w-full bg-white/10 rounded-md p-2 text-sm text-white placeholder-white/40 outline-none resize-none"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60 w-10">Size</span>
              <input
                type="range"
                min={18}
                max={72}
                step={1}
                value={overlaySize}
                onChange={(e) => setOverlaySize(Number(e.target.value))}
                className="flex-1 accent-white"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-white/60 w-10 flex-shrink-0">Color</span>
              {[
                "#ffffff",
                "#000000",
                "#ED4956",
                "#F7B500",
                "#22C55E",
                "#3B82F6",
                "#A855F7",
                "#EC4899",
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setOverlayColor(c)}
                  aria-label={`Color ${c}`}
                  className={`w-7 h-7 rounded-full border-2 flex-shrink-0 ${
                    overlayColor === c ? "border-white" : "border-white/30"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <p className="text-[10px] text-white/50">
              Tip: drag the text on the photo to reposition it.
            </p>
          </div>
        ) : (
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {FILTERS.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setFilterIdx(i)}
                  className="flex-shrink-0 flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-16 h-16 rounded-md overflow-hidden bg-neutral-900 ${
                      filterIdx === i ? "ring-2 ring-white" : "ring-1 ring-white/20"
                    }`}
                  >
                    <img
                      src={editorImg.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: f.filter,
                      }}
                      draggable={false}
                    />
                  </div>
                  <span
                    className={`text-[10px] ${
                      filterIdx === i ? "text-white" : "text-white/60"
                    }`}
                  >
                    {f.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-3 py-3 border-t border-white/10 flex-shrink-0 flex justify-center">
          <div className="segmented w-full max-w-xs">
            <button type="button" onClick={() => setTab("crop")} className={tab === "crop" ? "is-active" : ""}>
              <Crop size={14} /> Crop
            </button>
            <button type="button" onClick={() => setTab("filter")} className={tab === "filter" ? "is-active" : ""}>
              <SlidersHorizontal size={14} /> Filters
            </button>
            <button type="button" onClick={() => setTab("text")} className={tab === "text" ? "is-active" : ""}>
              <TypeIcon size={14} /> Text
            </button>
          </div>
        </div>

        {err && (
          <div className="px-4 py-2 text-center text-[color:var(--color-danger)] text-sm flex-shrink-0">
            {err}
          </div>
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
        <span className="font-semibold">New Post</span>
        <button
          type="submit"
          disabled={mode !== "ready" || pending || uploading}
          className={`text-sm font-semibold ${
            mode === "ready" && !pending && !uploading
              ? "text-[color:var(--color-primary)]"
              : "text-white/30"
          }`}
        >
          {pending ? "Posting…" : "Share"}
        </button>
      </header>

      <div
        className="relative aspect-square bg-neutral-900 flex items-center justify-center cursor-pointer"
        onClick={() => mode === "idle" && onPickClick()}
      >
        {mode === "ready" && previewUrl ? (
          mediaType === "video" ? (
            <video
              src={previewUrl}
              controls
              playsInline
              className="w-full h-full object-cover bg-black"
            />
          ) : (
            <Image
              src={previewUrl}
              alt="preview"
              fill
              className="object-cover"
              unoptimized
            />
          )
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 text-white/80">
            <Loader2 className="animate-spin" />
            <span className="text-sm">{progress ?? "Uploading…"}</span>
          </div>
        ) : (
          <div className="text-center text-white/60 text-sm px-6">
            <div>Tap to pick a photo or video</div>
            <div className="mt-1 text-xs text-white/40">
              Videos up to 3 minutes · photos can be edited
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {mode === "ready" && (
        <div className="flex items-center justify-end px-3 py-2 border-b border-[color:var(--color-border)]">
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1 text-xs text-white/70 hover:text-white"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      )}

      <div className="p-3">
        <textarea
          name="caption"
          placeholder="Write a caption…"
          rows={3}
          className="w-full bg-transparent outline-none text-sm placeholder-white/40 resize-none"
        />
      </div>

      {err && (
        <p className="px-4 text-[color:var(--color-danger)] text-sm">{err}</p>
      )}
      {state?.error && (
        <p className="px-4 text-[color:var(--color-danger)] text-sm">{state.error}</p>
      )}

      {mode === "ready" && (
        <div className="px-4 py-2 border-t border-[color:var(--color-border)] flex items-center gap-2">
          <label className="text-xs text-white/60 w-12 cursor-pointer">Music</label>
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
                const ext = (f.name.split(".").pop() || "mp3").toLowerCase();
                const path = `${userId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
                const { error: upErr } = await supabase.storage
                  .from("posts")
                  .upload(path, f, { contentType: f.type || "audio/mpeg" });
                if (upErr) throw upErr;
                const { data: { publicUrl } } = supabase.storage.from("posts").getPublicUrl(path);
                const audioInput = document.querySelector<HTMLInputElement>('input[name="audio_url"]');
                if (audioInput) audioInput.value = publicUrl;
              } catch (err) {
                setErr(err instanceof Error ? err.message : "Audio upload failed");
              }
            }}
            className="text-xs text-white/80 file:bg-white/10 file:text-white file:rounded file:border-0 file:px-2 file:py-1 file:mr-2"
          />
        </div>
      )}
      <input type="hidden" name="audio_url" defaultValue="" />
      <input type="hidden" name="media_url" value={mediaUrl} readOnly />
      <input type="hidden" name="media_type" value={mediaTypeForForm} readOnly />

      <div className="border-t border-[color:var(--color-border)] mt-auto">
        <p className="px-4 py-3 text-sm text-white/70">Tag People</p>
        <p className="px-4 py-3 text-sm text-white/70 border-t border-[color:var(--color-border)]">
          Add Location
        </p>
      </div>
    </form>
  );
}
