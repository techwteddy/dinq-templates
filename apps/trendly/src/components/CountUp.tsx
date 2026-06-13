"use client";

import { useEffect, useRef, useState } from "react";
import { formatCount } from "@/lib/utils";

/**
 * Animated count-up: rolls from 0 to `value` over `duration` ms using rAF
 * with an ease-out cubic curve. Honors prefers-reduced-motion (snaps).
 */
export function CountUp({
  value,
  duration = 700,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [n, setN] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      setN(value);
      return;
    }
    startedRef.current = true;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setN(value);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{formatCount(n)}</span>;
}
