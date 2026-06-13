"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useActionState,
  useRef,
  useState,
} from "react";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createProofOfWork } from "@/app/actions";

type MediaType = "image" | "video";

const MAX_VIDEO_SEC = 180;

const WORK_TYPES = [
  "design",
  "development",
  "marketing",
  "product",
  "content",
  "research",
  "other",
] as const;

const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
] as const;

const INTENTS = [
  { value: "", label: "Not specified" },
  { value: "hiring", label: "Looking to hire" },
  { value: "funding", label: "Seeking funding" },
  { value: "feedback", label: "Want feedback" },
  { value: "collaboration", label: "Open to collab" },
  { value: "showcase", label: "Just showcasing" },
] as const;

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

export function ProofComposer({ userId }: { userId: string }) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [state, formAction, pending] = useActionState(
    async (_: unknown, fd: FormData) => await createProofOfWork(fd),
    null,
  );

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onPick = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setErr(null);

    if (f.type.startsWith("video/")) {
      try {
        const dur = await getVideoDuration(f);
        if (dur > MAX_VIDEO_SEC) {
          setErr(`Video is ${Math.round(dur)}s — max is 3 minutes.`);
          return;
        }
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Could not read video");
        return;
      }
      await upload(f, "video");
      return;
    }

    if (f.type.startsWith("image/")) {
      await upload(f, "image");
      return;
    }

    setErr("Pick a photo or video");
  };

  async function upload(f: File, kind: MediaType) {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext =
        (f.name.split(".").pop() || (kind === "video" ? "mp4" : "jpg"))
          .toLowerCase();
      const path = `${userId}/${Date.now()}-${crypto
        .randomUUID()
        .slice(0, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("posts")
        .upload(path, f, {
          contentType: f.type || (kind === "video" ? "video/mp4" : "image/jpeg"),
          upsert: false,
        });
      if (upErr) throw upErr;
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(path);
      setMediaUrl(publicUrl);
      setMediaType(kind);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const reset = () => {
    setMediaUrl(null);
    setMediaType(null);
    setErr(null);
  };

  return (
    <form action={formAction} className="flex flex-col min-h-dvh bg-black text-white">
      <header className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)] sticky top-0 bg-black z-10">
        <Link href="/proof" aria-label="Cancel">
          <ChevronLeft size={28} />
        </Link>
        <span className="font-semibold">Post Proof</span>
        <button
          type="submit"
          disabled={!mediaUrl || pending || uploading}
          className={`text-sm font-semibold ${
            mediaUrl && !pending && !uploading
              ? "text-[color:var(--color-primary)]"
              : "text-white/30"
          }`}
        >
          {pending ? "Posting…" : "Share"}
        </button>
      </header>

      {/* Media picker / preview */}
      <div
        className="relative aspect-square bg-neutral-900 flex items-center justify-center cursor-pointer"
        onClick={() => !mediaUrl && !uploading && onPick()}
      >
        {mediaUrl ? (
          mediaType === "video" ? (
            <video
              src={mediaUrl}
              controls
              playsInline
              className="w-full h-full object-cover bg-black"
            />
          ) : (
            <Image
              src={mediaUrl}
              alt="preview"
              fill
              className="object-cover"
              unoptimized
            />
          )
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 text-white/80">
            <Loader2 className="animate-spin" />
            <span className="text-sm">Uploading…</span>
          </div>
        ) : (
          <div className="text-center text-white/60 text-sm px-6">
            <div>Tap to add a photo or short video</div>
            <div className="mt-1 text-xs text-white/40">
              Show the real work — WIP, BTS, demos
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

      {mediaUrl && (
        <div className="flex items-center justify-end px-3 py-2 border-b border-[color:var(--color-border)]">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 text-xs text-white/70 hover:text-white"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      )}

      {/* Hidden upload fields */}
      <input type="hidden" name="media_url" value={mediaUrl ?? ""} />
      <input type="hidden" name="media_type" value={mediaType ?? ""} />

      {/* Proof metadata */}
      <div className="p-4 space-y-5">
        <Field label="Caption">
          <textarea
            name="caption"
            rows={2}
            placeholder="Describe what you're showing…"
            className={inputCls + " resize-none"}
          />
        </Field>

        <Section title="1. Work Context">
          <Field label="Project title" required>
            <input
              name="project_title"
              required
              maxLength={120}
              placeholder="e.g. Trendly — social reels app"
              className={inputCls}
            />
          </Field>
          <Field label="Work type" required>
            <select name="work_type" required defaultValue="development" className={selectCls}>
              {WORK_TYPES.map((w) => (
                <option key={w} value={w} className="bg-black capitalize">
                  {w}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stage" required>
            <select name="stage" required defaultValue="in_progress" className={selectCls}>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value} className="bg-black">
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        <Section title="2. Verified Stack">
          <Field label="Tools / tech" hint="Comma separated — e.g. Figma, Next.js, Supabase">
            <input
              name="tools"
              placeholder="Figma, Next.js, Supabase"
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="3. Timeline / Effort">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Hours spent">
              <input
                type="number"
                step="0.5"
                min="0"
                name="time_spent_hours"
                placeholder="12"
                className={inputCls}
              />
            </Field>
            <Field label="Started on">
              <input type="date" name="started_at" className={inputCls} />
            </Field>
          </div>
        </Section>

        <Section title="4. Collaborators (Collab Lock)">
          <Field
            label="Tag co-builders"
            hint="Comma or newline separated — e.g. @alice, @bob (design). They'll get a verify request; shows on both your profiles only after they accept."
          >
            <textarea
              name="collaborators"
              rows={2}
              placeholder="@alice, @bob (design)"
              className={inputCls + " resize-none"}
            />
          </Field>
        </Section>

        <Section title="5. Intent">
          <Field label="Why are you sharing this?">
            <select name="intent" defaultValue="" className={selectCls}>
              {INTENTS.map((i) => (
                <option key={i.value} value={i.value} className="bg-black">
                  {i.label}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        <Section title="6. Skill tags">
          <Field label="Skills" hint="Comma separated — e.g. React, UI design, Postgres">
            <input
              name="skills"
              placeholder="React, UI design, Postgres"
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="7. Business context">
          <Field label="Industry">
            <input name="industry" placeholder="SaaS, Edtech, …" className={inputCls} />
          </Field>
          <Field label="Target audience">
            <input
              name="target_audience"
              placeholder="Indie creators, Gen-Z students, …"
              className={inputCls}
            />
          </Field>
          <Field label="Use case">
            <input
              name="use_case"
              placeholder="What problem does this solve?"
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="9. Process notes">
          <Field label="Problem solved">
            <textarea
              name="problem_solved"
              rows={2}
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="Key decisions">
            <textarea
              name="key_decisions"
              rows={2}
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="Challenges">
            <textarea
              name="challenges"
              rows={2}
              className={inputCls + " resize-none"}
            />
          </Field>
        </Section>
      </div>

      {err && (
        <p className="px-4 pb-3 text-[color:var(--color-danger)] text-sm">{err}</p>
      )}
      {state?.error && (
        <p className="px-4 pb-3 text-[color:var(--color-danger)] text-sm">
          {state.error}
        </p>
      )}

      <div className="mt-auto p-4 text-xs text-white/40 border-t border-[color:var(--color-border)]">
        Layer 8 (trust signals) is computed after posting — verified collabs
        and engagement will appear on the post automatically.
      </div>
    </form>
  );
}

const inputCls =
  "w-full bg-transparent border border-white/15 rounded-md px-3 py-2 text-sm outline-none focus:border-white/40 placeholder-white/30";
const selectCls = inputCls + " appearance-none";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs uppercase tracking-wide text-white/50 font-semibold">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <div className="flex items-center gap-1 text-xs text-white/70">
        <span>{label}</span>
        {required && <span className="text-[color:var(--color-danger)]">*</span>}
      </div>
      {children}
      {hint && <p className="text-[10px] text-white/40">{hint}</p>}
    </label>
  );
}

