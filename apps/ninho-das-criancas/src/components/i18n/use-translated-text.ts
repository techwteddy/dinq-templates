"use client";

import { useEffect, useState } from "react";

function cacheKey(source: string) {
  let h = 0;
  for (let i = 0; i < Math.min(source.length, 300); i++) {
    h = (h * 33 + source.charCodeAt(i)) | 0;
  }
  return `tr:ko-pt:v1:${source.length}:${h}`;
}

/**
 * `enabled`(보통 locale === "pt")일 때 한국어 문자열을 API로 번역.
 * sessionStorage에 캐시해 같은 글을 다시 열 때 요청을 줄입니다.
 */
export function useTranslatedText(source: string, enabled: boolean) {
  const [text, setText] = useState(source);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setText(source);
      setLoading(false);
      return;
    }
    if (!source.trim()) {
      setText(source);
      setLoading(false);
      return;
    }

    const key = cacheKey(source);
    try {
      const hit = sessionStorage.getItem(key);
      if (hit) {
        setText(hit);
        setLoading(false);
        return;
      }
    } catch {
      /* private mode */
    }

    const ac = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: source }),
          signal: ac.signal,
        });
        const data = (await res.json()) as {
          translated?: string;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? "translate failed");
        const next = data.translated ?? source;
        if (!ac.signal.aborted) {
          setText(next);
          try {
            sessionStorage.setItem(key, next);
          } catch {
            /* ignore */
          }
        }
      } catch {
        if (!ac.signal.aborted) setText(source);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [source, enabled]);

  return { text, loading };
}
