"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import t from "@/lib/translations";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AskFernando() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const tr = t[lang].askFernando;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: tr.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset greeting when language changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: tr.greeting }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((m) => m.role !== "assistant" || newMessages.indexOf(m) > 0),
          lang,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply ?? "Sorry, I couldn't respond right now." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ask Fernando AI"
        className="fixed bottom-8 left-8 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-white font-semibold shadow-lg transition-transform hover:scale-105"
        style={{ background: "var(--gradient-accent)" }}
      >
        <FontAwesomeIcon icon={faCommentDots} />
        <span className="hidden sm:inline text-sm">{tr.title}</span>
      </button>

      {/* Chat modal */}
      {open && (
        <div
          className="fixed bottom-24 left-4 sm:left-8 z-50 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{
            backgroundColor: isLight ? "rgba(248,250,252,0.98)" : "rgba(15,23,42,0.95)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${isLight ? "rgba(148,163,184,0.4)" : "rgba(255,255,255,0.15)"}`,
            maxHeight: "min(70vh, calc(100dvh - 8rem))",
          }}
          role="dialog"
          aria-label="Ask Fernando chat"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: "var(--gradient-accent)" }}
          >
            <span className="font-semibold text-white text-sm">{tr.title}</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white hover:text-gray-200 transition"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user" ? "text-white rounded-br-none" : "rounded-bl-none"
                  }`}
                  style={{
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #14b8a6, #3b82f6)"
                        : isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.1)",
                    color: msg.role === "user" ? "#fff" : isLight ? "#1e293b" : "#e5e7eb",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-xl rounded-bl-none text-sm"
                  style={{
                    background: isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.1)",
                    color: isLight ? "#64748b" : "#9ca3af",
                  }}
                >
                  {tr.thinking}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t" style={{ borderColor: isLight ? "rgba(148,163,184,0.3)" : "rgba(255,255,255,0.1)" }}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={tr.placeholder}
                disabled={loading}
                className="flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50"
                style={{
                  background: isLight ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.08)",
                  color: isLight ? "#1e293b" : "#fff",
                  fontSize: "16px",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="px-3 py-2 rounded-lg text-white transition hover:scale-105 disabled:opacity-40"
                style={{ background: "var(--gradient-accent)" }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
