"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  s: number;
  b: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Orb {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rad: number;
  r: number;
  g: number;
  b: number;
  speed: number;
  phase: number;
}

interface Particle {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  size: number;
  speed: number;
  phase: number;
  brightness: number;
}

function createStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    s: Math.random() * 1.5 + 0.3,
    b: Math.random() * 0.6 + 0.4,
    twinkleSpeed: Math.random() * 2 + 0.5,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    cx: Math.random(),
    cy: Math.random(),
    rx: Math.random() * 0.06 + 0.01,
    ry: Math.random() * 0.04 + 0.01,
    size: Math.random() * 1.8 + 0.5,
    speed: Math.random() * 0.4 + 0.15,
    phase: Math.random() * Math.PI * 2,
    brightness: Math.random() * 0.5 + 0.3,
  }));
}

const ORBS: Orb[] = [
  { cx: 0.18, cy: 0.3, rx: 0.04, ry: 0.035, rad: 0.08, r: 30, g: 80, b: 210, speed: 0.3, phase: 0 },
  { cx: 0.78, cy: 0.55, rx: 0.035, ry: 0.05, rad: 0.1, r: 40, g: 100, b: 225, speed: 0.22, phase: 1.2 },
  { cx: 0.5, cy: 0.18, rx: 0.03, ry: 0.025, rad: 0.055, r: 60, g: 50, b: 185, speed: 0.35, phase: 2.5 },
  { cx: 0.85, cy: 0.25, rx: 0.025, ry: 0.04, rad: 0.06, r: 25, g: 60, b: 165, speed: 0.28, phase: 3.8 },
  { cx: 0.12, cy: 0.75, rx: 0.03, ry: 0.03, rad: 0.05, r: 50, g: 70, b: 200, speed: 0.32, phase: 5.0 },
  { cx: 0.6, cy: 0.78, rx: 0.025, ry: 0.035, rad: 0.045, r: 35, g: 85, b: 195, speed: 0.25, phase: 0.7 },
];

const RINGS = [0.06, 0.1, 0.15, 0.21];

export default function CosmicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Responsive particle counts
    const isMobile = window.innerWidth < 768;
    const stars = createStars(isMobile ? 150 : 350);
    const particles = createParticles(isMobile ? 12 : 30);

    let w = window.innerWidth;
    let h = window.innerHeight;
    let bgGrad: CanvasGradient | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bgGrad = null; // invalidate on resize
    };
    resize();
    window.addEventListener("resize", resize);

    let startTime: number | null = null;

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, w, h);

      if (!bgGrad) {
        bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, "#060614");
        bgGrad.addColorStop(0.5, "#0a0e24");
        bgGrad.addColorStop(1, "#0c142a");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (const star of stars) {
        const twinkle =
          0.4 +
          0.6 *
            (Math.sin(elapsed * star.twinkleSpeed + star.twinkleOffset) * 0.5 +
              0.5);
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${star.b * twinkle})`;
        ctx.fill();
      }

      // Orbs
      for (const orb of ORBS) {
        const ox =
          (orb.cx + orb.rx * Math.sin(elapsed * orb.speed + orb.phase)) * w;
        const oy =
          (orb.cy + orb.ry * Math.cos(elapsed * orb.speed + orb.phase)) * h;
        const pulse =
          1 + 0.12 * Math.sin(elapsed * orb.speed * 2 + orb.phase);
        const radius = orb.rad * Math.min(w, h) * pulse;

        const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius);
        orbGrad.addColorStop(
          0,
          `rgba(${orb.r}, ${orb.g}, ${orb.b}, 0.18)`
        );
        orbGrad.addColorStop(
          0.4,
          `rgba(${orb.r}, ${orb.g}, ${orb.b}, 0.08)`
        );
        orbGrad.addColorStop(
          1,
          `rgba(${orb.r}, ${orb.g}, ${orb.b}, 0)`
        );
        ctx.beginPath();
        ctx.arc(ox, oy, radius, 0, Math.PI * 2);
        ctx.fillStyle = orbGrad;
        ctx.fill();
      }

      // Sacred geometry rings 
      const rcx = w * 0.5;
      const rcy = h * 0.15;
      const baseSize = Math.min(w, h);
      for (let i = 0; i < RINGS.length; i++) {
        const ringPulse = (Math.sin(elapsed * 0.5 + i * 0.8) + 1) / 2;
        const alpha = 0.04 + 0.06 * ringPulse;
        const r = RINGS[i] * baseSize + 3 * Math.sin(elapsed * 0.3 + i);
        ctx.beginPath();
        ctx.arc(rcx, rcy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(70, 120, 220, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Floating particles
      for (const p of particles) {
        const px =
          (p.cx + p.rx * Math.sin(elapsed * p.speed + p.phase)) * w;
        const py =
          (p.cy + p.ry * Math.cos(elapsed * p.speed * 0.7 + p.phase)) * h;
        const pAlpha =
          p.brightness *
          (0.3 +
            0.7 *
              (Math.sin(elapsed * p.speed * 3 + p.phase) * 0.5 + 0.5));
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 150, 255, ${pAlpha})`;
        ctx.fill();
      }

      // Breathing center glow
      const breathCycle = 12;
      const breathT = (elapsed % breathCycle) / breathCycle;
      let breathScale: number;
      if (breathT < 4 / 12) {
        breathScale = 0.6 + 0.4 * (breathT / (4 / 12));
      } else if (breathT < 6 / 12) {
        breathScale = 1.0;
      } else {
        breathScale = 1.0 - 0.4 * ((breathT - 6 / 12) / (6 / 12));
      }
      const breathRadius = 40 * breathScale;
      const breathGrad = ctx.createRadialGradient(
        rcx,
        rcy,
        0,
        rcx,
        rcy,
        breathRadius
      );
      breathGrad.addColorStop(
        0,
        `rgba(100, 150, 255, ${0.08 * breathScale})`
      );
      breathGrad.addColorStop(1, "rgba(100, 150, 255, 0)");
      ctx.beginPath();
      ctx.arc(rcx, rcy, breathRadius, 0, Math.PI * 2);
      ctx.fillStyle = breathGrad;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
      {/* Static gradient fallback for reduced-motion */}
      <div
        className="fixed inset-0 hidden motion-reduce:block"
        style={{
          zIndex: 0,
          background:
            "linear-gradient(180deg, #060614 0%, #0a0e24 50%, #0c142a 100%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
