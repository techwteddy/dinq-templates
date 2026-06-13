"use client";

import { useState, useTransition } from "react";
import { saveInterests } from "@/app/actions";

const OPTIONS = [
  "Photography",
  "Design",
  "Travel",
  "Fitness",
  "Music",
  "Tech",
  "Fashion",
  "Food",
  "Gaming",
  "Art",
  "Film",
  "Books",
  "Startups",
  "Sports",
  "Wellness",
  "Anime",
  "Cars",
  "Outdoors",
];

const MIN = 3;
const MAX = 8;

export function InterestsPicker() {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const toggle = (opt: string) => {
    setErr(null);
    setPicked((s) => {
      const next = new Set(s);
      if (next.has(opt)) next.delete(opt);
      else if (next.size < MAX) next.add(opt);
      return next;
    });
  };

  const submit = () => {
    if (picked.size < MIN) {
      setErr(`Pick at least ${MIN} to continue.`);
      return;
    }
    start(async () => {
      const res = await saveInterests(Array.from(picked));
      if (res && "error" in res && res.error) setErr(res.error);
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="text-center mt-4">
        <h1 className="text-2xl font-semibold">What are you into?</h1>
        <p className="text-sm text-white/60 mt-2">
          Pick {MIN}–{MAX} so we can match you with creators worth knowing.
        </p>
      </div>

      <div className="flex-1 mt-8 flex flex-wrap justify-center gap-2 content-start">
        {OPTIONS.map((opt) => {
          const on = picked.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className="h-10 px-4 rounded-full text-sm font-semibold border transition-colors"
              style={
                on
                  ? {
                      background: "var(--gradient-brand)",
                      borderColor: "transparent",
                      color: "#fff",
                    }
                  : {
                      background: "transparent",
                      borderColor: "rgba(255,255,255,0.25)",
                      color: "rgba(255,255,255,0.85)",
                    }
              }
            >
              {opt}
            </button>
          );
        })}
      </div>

      {err && (
        <p className="text-center text-sm text-[color:var(--color-danger)] mt-4">
          {err}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="text-xs text-white/55">
          {picked.size}/{MAX} selected
        </span>
        <button
          type="button"
          onClick={submit}
          disabled={pending || picked.size < MIN}
          className="w-full max-w-sm h-12 btn-primary flex items-center justify-center font-semibold"
        >
          {pending ? "Saving…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
