"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  ChevronLeft,
  Phone,
  Video,
  Info,
  Camera,
  Mic,
  ImageIcon,
  Sticker,
  Heart,
  X,
  Square,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/Avatar";
import { sendMessage } from "@/app/actions";
import { useCall } from "@/components/CallProvider";
import { cn, timeAgo } from "@/lib/utils";
import type { Message } from "@/lib/database.types";

type User = { id: string; username: string; avatar_url: string | null };

const STICKERS = ["❤️", "🔥", "😂", "😍", "🥺", "👍", "🎉", "😎", "🙌", "💯", "✨", "😭"];

export function ChatThread({
  me,
  peer,
  initialMessages,
}: {
  me: User;
  peer: User;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [stickerOpen, setStickerOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [, startTransition] = useTransition();
  const { startCall } = useCall();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`dm:${[me.id, peer.id].sort().join(":")}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${peer.id}`,
        },
        (payload) => {
          const m = payload.new as Message;
          if (m.receiver_id !== me.id) return;
          setMessages((prev) =>
            prev.some((p) => p.id === m.id) ? prev : [...prev, m],
          );
          supabase
            .from("messages")
            .update({ is_read: true })
            .eq("id", m.id)
            .then(() => {});
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${me.id}`,
        },
        (payload) => {
          const m = payload.new as Message;
          if (m.receiver_id !== peer.id) return;
          setMessages((prev) => prev.map((p) => (p.id === m.id ? m : p)));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [me.id, peer.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Send plain text (from input or sticker/heart)
  const sendText = (body: string) => {
    if (!body.trim()) return;
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      sender_id: me.id,
      receiver_id: peer.id,
      content: body,
      media_url: null,
      media_type: null,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    startTransition(() => sendMessage(peer.id, { content: body }));
  };

  const sendFromInput = () => {
    const body = text.trim();
    if (!body) return;
    setText("");
    sendText(body);
  };

  const sendHeart = () => sendText("❤️");

  // Upload a Blob to chat-media bucket and send as message with media
  const uploadAndSend = async (blob: Blob, type: "image" | "audio", ext: string) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${me.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("chat-media")
        .upload(path, blob, {
          contentType: blob.type || (type === "image" ? "image/jpeg" : "audio/webm"),
          cacheControl: "3600",
        });
      if (upErr) throw upErr;
      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-media").getPublicUrl(path);

      const optimistic: Message = {
        id: `opt-${Date.now()}`,
        sender_id: me.id,
        receiver_id: peer.id,
        content: null,
        media_url: publicUrl,
        media_type: type,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);
      startTransition(() =>
        sendMessage(peer.id, { media_url: publicUrl, media_type: type }),
      );
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Image button: open file picker, upload, send
  const onImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
    await uploadAndSend(f, "image", ext);
  };

  // Voice: start/stop recording
  const toggleRecord = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const rec = new MediaRecorder(stream);
      mediaRecorderRef.current = rec;
      audioChunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioStreamRef.current?.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
        setRecording(false);
        if (blob.size > 0) await uploadAndSend(blob, "audio", "webm");
      };
      rec.start();
      setRecording(true);
    } catch (err) {
      alert("Mic permission denied or unsupported");
      console.error(err);
    }
  };

  const cancelRecord = () => {
    if (!recording) return;
    const rec = mediaRecorderRef.current;
    if (rec) {
      rec.onstop = () => {
        audioStreamRef.current?.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
        setRecording(false);
      };
      rec.stop();
    }
    audioChunksRef.current = [];
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <header className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-[color:var(--color-border)] h-14 px-3 flex items-center gap-3">
        <Link href="/messages" aria-label="Back">
          <ChevronLeft size={28} />
        </Link>
        <Link href={`/u/${peer.username}`} className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar username={peer.username} avatarUrl={peer.avatar_url} size={34} />
          <span className="text-sm font-semibold truncate">{peer.username}</span>
        </Link>
        <button
          aria-label="Voice call"
          onClick={() => startCall(peer, "audio")}
          title="Voice call"
        >
          <Phone size={22} />
        </button>
        <button
          aria-label="Video call"
          onClick={() => startCall(peer, "video")}
          title="Video call"
        >
          <Video size={22} />
        </button>
        <button aria-label="Info">
          <Info size={22} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-2">
        {messages.map((m, i) => {
          const mine = m.sender_id === me.id;
          const prev = messages[i - 1];
          const showAvatar = !mine && (!prev || prev.sender_id !== m.sender_id);
          const isSticker =
            !m.media_url &&
            !!m.content &&
            /^[\p{Emoji}\p{Emoji_Presentation}\u200d\ufe0f]{1,4}$/u.test(m.content.trim());
          return (
            <div key={m.id} className={cn("flex items-end gap-2", mine ? "justify-end" : "justify-start")}>
              {!mine && (
                <div className="w-6">
                  {showAvatar && <Avatar username={peer.username} avatarUrl={peer.avatar_url} size={24} />}
                </div>
              )}
              {m.media_url && m.media_type === "image" ? (
                <div className="max-w-[72%] rounded-2xl overflow-hidden">
                  <Image
                    src={m.media_url}
                    alt=""
                    width={480}
                    height={480}
                    unoptimized
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
              ) : m.media_url && m.media_type === "audio" ? (
                <audio
                  controls
                  src={m.media_url}
                  className="max-w-[72%] h-10"
                />
              ) : isSticker ? (
                <div className="text-5xl leading-none py-1">{m.content}</div>
              ) : (
                <div
                  className={cn(
                    "max-w-[72%] px-3.5 py-2 text-sm leading-snug break-words",
                    mine
                      ? "bg-[color:var(--color-primary)] text-white rounded-2xl rounded-br-md"
                      : "bg-[color:var(--color-bg-elev)] text-white rounded-2xl rounded-bl-md",
                  )}
                >
                  {m.content}
                </div>
              )}
            </div>
          );
        })}
        {messages.length > 0 && (
          <div className="text-center text-[11px] text-white/40 pt-2">
            {mounted && (
              <>
                {timeAgo(messages[messages.length - 1].created_at)} ago
                {messages[messages.length - 1].sender_id === me.id && (
                  <span className="ml-2">
                    {messages[messages.length - 1].is_read ? "Seen" : "Delivered"}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Sticker tray */}
      {stickerOpen && (
        <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] p-3">
          <div className="grid grid-cols-6 gap-3">
            {STICKERS.map((s) => (
              <button
                key={s}
                type="button"
                className="text-3xl active:scale-90 transition"
                onClick={() => {
                  sendText(s);
                  setStickerOpen(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recording banner */}
      {recording && (
        <div className="border-t border-[color:var(--color-border)] bg-red-500/10 px-3 py-2 flex items-center gap-3">
          <span className="flex items-center gap-2 text-red-400 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Recording…
          </span>
          <button onClick={cancelRecord} className="text-white/70 text-sm ml-auto">
            Cancel
          </button>
          <button
            onClick={toggleRecord}
            className="text-[color:var(--color-primary)] text-sm font-semibold"
          >
            <Square size={14} className="inline -mt-0.5" /> Stop & Send
          </button>
        </div>
      )}

      <div className="p-2 border-t border-[color:var(--color-border)]">
        <div className="flex items-center gap-2 rounded-full border border-[color:var(--color-border)] px-3 py-1.5">
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            aria-label="Camera"
            className="w-9 h-9 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center"
          >
            <Camera size={18} />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={uploading ? "Uploading…" : "Message…"}
            disabled={uploading}
            className="flex-1 bg-transparent outline-none text-sm placeholder-white/40 disabled:opacity-60"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendFromInput();
              }
            }}
          />
          {text ? (
            <button
              onClick={sendFromInput}
              className="text-[color:var(--color-primary)] text-sm font-semibold"
            >
              Send
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleRecord}
                aria-label="Voice message"
                className={recording ? "text-red-500" : ""}
                title={recording ? "Stop recording" : "Record voice message"}
              >
                <Mic size={20} />
              </button>
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                aria-label="Image"
                title="Send image"
              >
                <ImageIcon size={20} />
              </button>
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImagePick}
              />
              <button
                type="button"
                onClick={() => setStickerOpen((v) => !v)}
                aria-label="Sticker"
                className={stickerOpen ? "text-[color:var(--color-primary)]" : ""}
                title="Stickers"
              >
                <Sticker size={20} />
              </button>
              <button
                type="button"
                onClick={sendHeart}
                aria-label="Send heart"
                title="Send ❤️"
              >
                <Heart size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {cameraOpen && (
        <CameraCapture
          onClose={() => setCameraOpen(false)}
          onCapture={async (blob) => {
            setCameraOpen(false);
            await uploadAndSend(blob, "image", "jpg");
          }}
        />
      )}
    </div>
  );
}

function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (b: Blob) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Camera unavailable");
      }
    })();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (b) => {
        if (b) onCapture(b);
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <header className="h-12 px-3 flex items-center justify-between">
        <button onClick={onClose} aria-label="Close">
          <X size={26} />
        </button>
        <span className="font-semibold">Camera</span>
        <span className="w-6" />
      </header>
      <div className="flex-1 flex items-center justify-center">
        {err ? (
          <div className="text-center px-8 text-white/80">
            <p className="text-sm">{err}</p>
            <p className="text-xs text-white/50 mt-2">
              Allow camera access in your browser settings and try again.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
        )}
      </div>
      {!err && (
        <div className="flex justify-center pb-8 pt-4">
          <button
            onClick={capture}
            className="w-16 h-16 rounded-full border-4 border-white"
            aria-label="Capture"
          />
        </div>
      )}
    </div>
  );
}
