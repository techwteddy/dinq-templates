"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/lib/translations";

interface TerminalIntroProps {
  onDone: () => void;
  exiting?: boolean;
}

export default function TerminalIntro({ onDone, exiting = false }: TerminalIntroProps) {
  const { lang } = useLanguage();
  const tr = t[lang].terminal;
  const [lines, setLines] = useState<{ cmd: string; out: string; doneCmd: boolean; doneOut: boolean }[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [cmdChars, setCmdChars] = useState(0);
  const [outChars, setOutChars] = useState(0);
  const [phase, setPhase] = useState<"cmd" | "out" | "pause">("cmd");
  const bottomRef = useRef<HTMLDivElement>(null);
  const SPEED_CMD = 22;
  const SPEED_OUT = 9;
  const PAUSE_BETWEEN = 180;

  useEffect(() => {
    setLines([]);
    setCurrentLine(0);
    setCmdChars(0);
    setOutChars(0);
    setPhase("cmd");
  }, [lang]);

  useEffect(() => {
    if (currentLine >= tr.lines.length) {
      const t = setTimeout(onDone, 300);
      return () => clearTimeout(t);
    }

    const line = tr.lines[currentLine];

    if (phase === "cmd") {
      if (cmdChars < line.cmd.length) {
        const timer = setTimeout(() => setCmdChars((n) => n + 1), SPEED_CMD);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setPhase("out"), PAUSE_BETWEEN);
        return () => clearTimeout(timer);
      }
    }

    if (phase === "out") {
      if (outChars < line.out.length) {
        const timer = setTimeout(() => setOutChars((n) => n + 1), SPEED_OUT);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setLines((prev) => [...prev, { ...line, doneCmd: true, doneOut: true }]);
          setCmdChars(0);
          setOutChars(0);
          setPhase("cmd");
          setCurrentLine((n) => n + 1);
        }, PAUSE_BETWEEN);
        return () => clearTimeout(timer);
      }
    }
  }, [currentLine, phase, cmdChars, outChars, tr.lines, onDone]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, cmdChars, outChars]);

  const activeLine = currentLine < tr.lines.length ? tr.lines[currentLine] : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.8s ease",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <div
        className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.15)" }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
          <span className="ml-4 text-xs text-gray-500 font-mono">terminal — portfolio</span>
        </div>

        {/* Terminal body */}
        <div
          className="font-mono text-xs sm:text-sm p-4 sm:p-5 space-y-1 overflow-y-auto overflow-x-hidden"
          style={{ background: "rgba(0,0,0,0.6)", minHeight: "220px", maxHeight: "340px" }}
        >
          {lines.map((l, i) => (
            <div key={i}>
              <p>
                <span className="text-teal-400">➜ </span>
                <span className="text-gray-200">{l.cmd}</span>
              </p>
              <p className="text-gray-400 pl-4 break-words">{l.out}</p>
            </div>
          ))}

          {activeLine && (
            <div>
              {phase === "cmd" || phase === "out" ? (
                <p>
                  <span className="text-teal-400">➜ </span>
                  <span className="text-gray-200">{activeLine.cmd.slice(0, cmdChars)}</span>
                  <span className="animate-pulse text-teal-400">▋</span>
                </p>
              ) : null}
              {phase === "out" && outChars > 0 && (
                <p className="text-gray-400 pl-4">{activeLine.out.slice(0, outChars)}</p>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <button
        onClick={onDone}
        className="absolute bottom-8 right-8 text-xs text-gray-500 hover:text-gray-300 transition underline"
      >
        {tr.skip}
      </button>
    </div>
  );
}
