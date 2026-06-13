"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { avatarFor } from "@/lib/utils";

const VIEWPORT = 280;
const OUTPUT = 512;

type Props = { username: string; currentAvatarUrl: string | null; userId: string };

export function AvatarPicker({ username, currentAvatarUrl, userId }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editorImg, setEditorImg] = useState<HTMLImageElement | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const onPick = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new window.Image();
    img.onload = () => {
      setEditorImg(img);
      const s = Math.max(VIEWPORT / img.width, VIEWPORT / img.height);
      setScale(s);
      setPos({ x: 0, y: 0 });
      setErr(null);
      setOpen(true);
    };
    img.src = url;
    e.target.value = "";
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !editorImg) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const w = editorImg.width * scale;
    const h = editorImg.height * scale;
    const maxX = Math.max(0, (w - VIEWPORT) / 2);
    const maxY = Math.max(0, (h - VIEWPORT) / 2);
    const nx = Math.min(maxX, Math.max(-maxX, dragRef.current.px + dx));
    const ny = Math.min(maxY, Math.max(-maxY, dragRef.current.py + dy));
    setPos({ x: nx, y: ny });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    if (!editorImg) return;
    const w = editorImg.width * scale;
    const h = editorImg.height * scale;
    const maxX = Math.max(0, (w - VIEWPORT) / 2);
    const maxY = Math.max(0, (h - VIEWPORT) / 2);
    setPos((p) => ({
      x: Math.min(maxX, Math.max(-maxX, p.x)),
      y: Math.min(maxY, Math.max(-maxY, p.y)),
    }));
  }, [scale, editorImg]);

  const onConfirm = useCallback(async () => {
    if (!editorImg) return;
    setUploading(true);
    setErr(null);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT;
      canvas.height = OUTPUT;
      const ctx = canvas.getContext("2d")!;
      const k = OUTPUT / VIEWPORT;
      const w = editorImg.width * scale;
      const h = editorImg.height * scale;
      const dx = OUTPUT / 2 - (w / 2) * k + pos.x * k;
      const dy = OUTPUT / 2 - (h / 2) * k + pos.y * k;
      ctx.drawImage(editorImg, dx, dy, w * k, h * k);
      const blob: Blob = await new Promise((res) =>
        canvas.toBlob((b) => res(b!), "image/jpeg", 0.9),
      );

      const supabase = createClient();
      const path = `${userId}/avatar-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, blob, {
          contentType: "image/jpeg",
          upsert: true,
          cacheControl: "3600",
        });
      if (upErr) throw upErr;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      // Cache-bust the <img> preview only
      setPreviewUrl(publicUrl + "?v=" + Date.now());
      setAvatarUrl(publicUrl);
      setOpen(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      setErr(msg);
    } finally {
      setUploading(false);
    }
  }, [editorImg, scale, pos.x, pos.y, userId]);

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-900">
          <Image
            src={previewUrl ?? avatarFor(username, currentAvatarUrl)}
            alt=""
            width={96}
            height={96}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
        <button
          type="button"
          onClick={onPick}
          className="text-[color:var(--color-primary)] text-sm font-semibold cursor-pointer"
        >
          Change Profile Photo
        </button>
        {err && <div className="text-red-500 text-xs">{err}</div>}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
        {/* Hidden URL field submitted with the form */}
        <input type="hidden" name="avatar_url" value={avatarUrl} readOnly />
      </div>

      {open && editorImg && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <header className="h-12 px-4 flex items-center justify-between border-b border-white/10">
            <button
              type="button"
              onClick={() => !uploading && setOpen(false)}
              aria-label="Cancel"
              className="text-white/80 disabled:opacity-40"
              disabled={uploading}
            >
              <X size={24} />
            </button>
            <span className="font-semibold">Move and Scale</span>
            <button
              type="button"
              onClick={onConfirm}
              disabled={uploading}
              className="text-[color:var(--color-primary)] font-semibold disabled:opacity-50 min-w-[60px] text-right"
            >
              {uploading ? <Loader2 size={18} className="animate-spin inline" /> : "Choose"}
            </button>
          </header>

          <div className="flex-1 flex items-center justify-center">
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative overflow-hidden touch-none select-none"
              style={{
                width: VIEWPORT,
                height: VIEWPORT,
                borderRadius: "50%",
                outline: "2px solid white",
                cursor: dragRef.current ? "grabbing" : "grab",
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
                  transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <div className="px-6 pb-8">
            <input
              type="range"
              min={Math.max(VIEWPORT / editorImg.width, VIEWPORT / editorImg.height)}
              max={Math.max(VIEWPORT / editorImg.width, VIEWPORT / editorImg.height) * 4}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>
      )}
    </>
  );
}
