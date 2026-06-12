"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/lib/translations";

function useCountUp(target: number, duration = 2000, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const raf = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo: slow start, explosive acceleration, snappy finish
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, active]);

  return value;
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1400, active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 p-2 sm:p-4">
      <span
        className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text"
        style={{ backgroundImage: "var(--gradient-accent)" }}
      >
        {count}{suffix}
      </span>
      <span className="text-sm text-center" style={{ color: "var(--color-text-muted)" }}>{label}</span>
    </div>
  );
}

export default function StatsCounter() {
  const { lang } = useLanguage();
  const stats = t[lang].stats;

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl my-8 px-4 py-4"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {stats.map((s) => (
        <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
      ))}
    </div>
  );
}
