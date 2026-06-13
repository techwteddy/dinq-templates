"use client";

/**
 * Connect modal — opens when a user clicks "Connect" on a match card or
 * profile badge. Asks the server to draft an intro message with Claude,
 * shows it in an editable textarea, then fires `requestConnection` with
 * the final text when the user hits Send.
 *
 * Design philosophy (from the spec):
 *   AI accelerates the hardest part of messaging a stranger — the blank
 *   page — but never sends anything the user hasn't approved.
 */

import { useEffect, useState, useTransition } from "react";
import { Sparkles, X, Send, Loader2, RefreshCw, Wand2 } from "lucide-react";
import { draftIntroMessage, requestConnection } from "@/app/actions";

type Props = {
  open: boolean;
  onClose: () => void;
  target: {
    user_id: string;
    username: string;
    full_name: string | null;
    avatar_url?: string | null;
    score?: number;
  };
  onSent?: () => void;
};

const MAX_LEN = 500;

export function ConnectModal({ open, onClose, target, onSent }: Props) {
  const [drafting, setDrafting] = useState(false);
  const [draftUsedAi, setDraftUsedAi] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, startSend] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  // Fetch draft whenever the modal opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setErr(null);
    setDrafting(true);
    setMessage("");
    setReason(null);
    setDraftUsedAi(false);

    (async () => {
      try {
        const res = await draftIntroMessage(target.user_id);
        if (cancelled) return;
        setMessage(res.message ?? "");
        setReason(res.reason);
        setDraftUsedAi(res.ai);
      } catch (e) {
        if (!cancelled) setErr("Couldn't draft a message — write one below.");
        console.warn(e);
      } finally {
        if (!cancelled) setDrafting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, target.user_id]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const regenerate = async () => {
    setRegenerating(true);
    try {
      const res = await draftIntroMessage(target.user_id);
      setMessage(res.message ?? "");
      setDraftUsedAi(res.ai);
    } catch (e) {
      console.warn(e);
    } finally {
      setRegenerating(false);
    }
  };

  const send = (withMessage: boolean) => {
    const payload = withMessage ? message.trim() : undefined;
    startSend(async () => {
      setErr(null);
      const res = await requestConnection(target.user_id, payload, target.score);
      if (res && "error" in res && res.error) {
        setErr(res.error);
        return;
      }
      onSent?.();
      onClose();
    });
  };

  const first =
    target.full_name?.split(" ")[0] || target.username || "them";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#111] border border-white/10 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[color:var(--color-primary)]" />
            <h2 className="font-semibold text-sm">
              Connect with {first}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-md hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </header>

        {/* AI reason banner */}
        {reason && (
          <div className="mx-4 mt-3 rounded-lg border border-[color:var(--color-primary)]/40 bg-[color:var(--color-primary)]/10 px-3 py-2 text-xs text-white/90 flex items-start gap-2">
            <Wand2 size={14} className="text-[color:var(--color-primary)] mt-0.5 flex-shrink-0" />
            <span className="leading-snug">{reason}</span>
          </div>
        )}

        {/* Body */}
        <div className="px-4 py-3 flex-1 overflow-y-auto">
          <label
            htmlFor="connect-msg"
            className="text-xs text-white/60 flex items-center gap-1.5 mb-1.5"
          >
            {draftUsedAi ? (
              <>
                <Sparkles size={12} className="text-[color:var(--color-primary)]" />
                AI-drafted — edit freely
              </>
            ) : (
              <>Your message (optional)</>
            )}
          </label>
          <textarea
            id="connect-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_LEN))}
            disabled={drafting}
            rows={5}
            placeholder={
              drafting
                ? "Drafting a personalized intro…"
                : `Hey ${first}, just came across your profile…`
            }
            className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-[color:var(--color-primary)] resize-none"
          />
          <div className="mt-1 flex items-center justify-between text-[10px] text-white/40">
            <button
              type="button"
              onClick={regenerate}
              disabled={drafting || regenerating || sending}
              className="inline-flex items-center gap-1 text-[color:var(--color-primary)] hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {regenerating ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <RefreshCw size={11} />
              )}
              Regenerate
            </button>
            <span>
              {message.length}/{MAX_LEN}
            </span>
          </div>

          {err && (
            <p className="mt-2 text-[11px] text-[color:var(--color-danger)]">{err}</p>
          )}
        </div>

        {/* Footer */}
        <footer className="px-4 py-3 border-t border-white/10 flex gap-2">
          <button
            type="button"
            onClick={() => send(false)}
            disabled={sending || drafting}
            className="flex-1 h-10 rounded-md text-sm font-semibold bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 disabled:opacity-50"
          >
            Skip message
          </button>
          <button
            type="button"
            onClick={() => send(true)}
            disabled={sending || drafting || message.trim().length === 0}
            className="flex-1 h-10 rounded-md text-sm font-bold bg-[color:var(--color-primary)] text-white hover:brightness-110 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            {sending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Send size={14} /> Send request
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
