"use client";

import { useState, useEffect } from "react";

type Phase = "inhale" | "hold" | "exhale";

const SEQUENCE: { phase: Phase; duration: number }[] = [
  { phase: "inhale", duration: 4000 },
  { phase: "hold", duration: 2000 },
  { phase: "exhale", duration: 6000 },
];

const PHASE_LABEL: Record<Phase, string> = {
  inhale: "Breathe In",
  hold: "Hold",
  exhale: "Release",
};

const MAX_CYCLES = 3;

interface BreathingOrbProps {
  onComplete: () => void;
}

export default function BreathingOrb({ onComplete }: BreathingOrbProps) {
  const [phase, setPhase] = useState<Phase | null>(null);
  const [count, setCount] = useState(4);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let idx = 0;
    let cycle = 0;
    let timer: ReturnType<typeof setTimeout>;
    let countTimer: ReturnType<typeof setInterval>;

    const run = () => {
      const current = SEQUENCE[idx];
      setPhase(current.phase);
      let c = current.duration / 1000;
      setCount(c);

      countTimer = setInterval(() => {
        c--;
        if (c > 0) setCount(c);
      }, 1000);

      timer = setTimeout(() => {
        clearInterval(countTimer);
        idx = (idx + 1) % SEQUENCE.length;

        if (idx === 0) {
          cycle++;
          if (cycle >= MAX_CYCLES) {
            setFading(true);
            timer = setTimeout(() => onComplete(), 1000);
            return;
          }
        }

        run();
      }, current.duration);
    };

    run();
    return () => {
      clearTimeout(timer);
      clearInterval(countTimer);
    };
  }, [onComplete]);

  const scale = phase === "inhale" || phase === "hold" ? "scale(1)" : "scale(0.65)";
  const transition =
    phase === null
      ? "none"
      : phase === "inhale"
        ? "transform 4s ease-in-out"
        : phase === "hold"
          ? "transform 0.3s"
          : "transform 6s ease-in-out";

  return (
    <div
      className="flex flex-col items-center gap-4 transition-opacity duration-1000"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div
        className="flex items-center justify-center rounded-full border border-om-border-subtle"
        style={{
          width: 100,
          height: 100,
          background:
            "radial-gradient(circle, var(--om-glow-soft) 0%, transparent 70%)",
          transform: scale,
          transition,
        }}
      >
        <span
          className="font-display text-2xl font-light text-om-text-secondary"
        >
          {count}
        </span>
      </div>
      <span
        className="font-body text-[13px] font-normal uppercase tracking-[4px] text-om-text-dim"
      >
        {phase ? PHASE_LABEL[phase] : PHASE_LABEL.inhale}
      </span>
    </div>
  );
}
