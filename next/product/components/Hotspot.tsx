"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HotspotProps {
  startFrame: number;
  endFrame: number;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  title: string;
  description: string;
  frameCount: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function Hotspot({ 
  startFrame, 
  endFrame, 
  x, 
  y, 
  title, 
  description, 
  frameCount,
  containerRef 
}: HotspotProps) {
  const hotspotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !hotspotRef.current) return;

    // Calculate triggers based on frame count (simulated via scroll distance)
    // We assume the parent timeline maps 0-100% scroll to 0-frameCount
    
    // Show trigger
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: `${(startFrame / frameCount) * 100}% top`,
      end: `${(endFrame / frameCount) * 100}% top`,
      onEnter: () => animateIn(),
      onEnterBack: () => animateIn(),
      onLeave: () => animateOut(),
      onLeaveBack: () => animateOut(),
    });

    function animateIn() {
      if (!hotspotRef.current) return;
      gsap.to(hotspotRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        overwrite: true // Prevent conflict
      });
    }

    function animateOut() {
      if (!hotspotRef.current) return;
      gsap.to(hotspotRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 10,
        duration: 0.3,
        ease: "power2.in",
        overwrite: true // Prevent conflict
      });
    }

    // Initial state
    gsap.set(hotspotRef.current, { opacity: 0, scale: 0.8, y: 10 });

    return () => {
      trigger.kill();
      if (hotspotRef.current) gsap.killTweensOf(hotspotRef.current);
    };
  }, [containerRef, startFrame, endFrame, frameCount]);

  return (
    <div 
      ref={hotspotRef}
      className="absolute z-20 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="flex items-center gap-4 group">
        {/* Dot with pulse */}
        <div className="relative">
          <div className="h-4 w-4 rounded-full bg-primary-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] ring-2 ring-white/20 backdrop-blur-sm" />
          <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary-500/50" />
          {/* Connector Line */}
          <div className="absolute left-1/2 top-4 h-16 w-[1px] -translate-x-1/2 bg-gradient-to-b from-primary-500 to-transparent opacity-50" />
        </div>

        {/* Content Card */}
        <div className="w-64 rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md transition-all">
          <h3 className="mb-1 font-space text-lg font-bold text-white leading-tight">
            {title}
          </h3>
          <p className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
