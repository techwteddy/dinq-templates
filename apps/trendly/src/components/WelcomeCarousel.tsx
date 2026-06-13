"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Users, ShieldCheck } from "lucide-react";
import { TrendlyLogo } from "@/components/TrendlyLogo";

const SLIDES = [
  {
    icon: Sparkles,
    title: "Share what is trending.",
    body:
      "Photos, reels, and 24-hour stories — built for creators who actually create.",
  },
  {
    icon: Users,
    title: "Find your people.",
    body:
      "Smart matches, real conversations, and a profile that proves what you've shipped.",
  },
  {
    icon: ShieldCheck,
    title: "Verified collaborations.",
    body:
      "Lock in collabs that both sides have signed off on. No clout-chasing — only receipts.",
  },
];

export function WelcomeCarousel() {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; px: number } | null>(null);
  const [drag, setDrag] = useState(0);

  // Auto-advance every 4s.
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, px: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setDrag(e.clientX - dragRef.current.x);
  };
  const onPointerUp = () => {
    if (!dragRef.current) return;
    const dx = drag;
    if (dx < -60 && idx < SLIDES.length - 1) setIdx(idx + 1);
    else if (dx > 60 && idx > 0) setIdx(idx - 1);
    dragRef.current = null;
    setDrag(0);
  };

  return (
    <>
      <div className="aurora"><span className="blob" /></div>
      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-6 relative">
      <TrendlyLogo size={48} />

      <div
        className="flex-1 w-full overflow-hidden mt-8 select-none"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragRef.current = null;
          setDrag(0);
        }}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="flex w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(${-idx * 100}% + ${drag}px))`,
            transitionDuration: dragRef.current ? "0ms" : "300ms",
          }}
        >
          {SLIDES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center px-4"
              >
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Icon size={56} className="text-white" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-semibold mt-8 max-w-xs">
                  {s.title}
                </h2>
                <p className="text-white/65 text-sm mt-3 max-w-xs leading-relaxed">
                  {s.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 mt-4 mb-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === idx ? 24 : 8,
              background: i === idx ? "var(--gradient-brand)" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      <Link
        href="/signup"
        className="w-full max-w-sm h-12 btn-primary flex items-center justify-center font-semibold"
      >
        Create account
      </Link>
      <Link
        href="/login"
        className="mt-3 text-sm text-white/70 hover:text-white"
      >
        I already have an account
      </Link>
      </div>
    </>
  );
}
