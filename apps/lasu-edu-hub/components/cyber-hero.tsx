'use client';

import { useEffect, useRef } from 'react';

export function CyberHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax scroll effect
    const handleScroll = () => {
      if (containerRef.current && crestRef.current) {
        const scrollY = window.scrollY;
        const parallaxFactor = 0.5;
        crestRef.current.style.transform = `translateY(${scrollY * parallaxFactor}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-[#0a0f1c] via-[#1a1f3a] to-[#0a0f1c] overflow-hidden flex items-center justify-center"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 animate-scanlines" />
        <svg className="absolute inset-0 w-full h-full" opacity="0.1">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f5ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Data Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#00f5ff] animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animation: `cyber-float ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* 3D Rotating Crest */}
        <div
          ref={crestRef}
          className="mb-12 flex justify-center"
        >
          <div className="w-40 h-40 sm:w-56 sm:h-56 relative animate-holographic-3d">
            {/* Golden Laurel Wreath */}
            <div className="absolute inset-0 rounded-full border-4 border-[#ffd700] shadow-[0_0_30px_rgba(255,215,0,0.3)] animate-neon-pulse">
              <div className="absolute inset-0 rounded-full border-2 border-[#00f5ff]/30" />
            </div>

            {/* Central Crest */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#00f5ff]/20 via-[#9d00ff]/20 to-[#ffd700]/20 border-2 border-[#00f5ff] flex items-center justify-center font-bold text-4xl sm:text-5xl neon-text-cyan shadow-[0_0_40px_rgba(0,245,255,0.3),inset_0_0_20px_rgba(0,245,255,0.1)]">
                L
              </div>
            </div>

            {/* Outer Pulse Ring */}
            <div className="absolute inset-0 rounded-full border border-[#9d00ff]/50 animate-pulse-ring" />
          </div>
        </div>

        {/* Glitch Headline */}
        <div className="mb-8 relative">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-4 animate-glitch-text neon-text-cyan">
            PIONEERING
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight animate-glitch-text neon-text-purple">
            TOMORROW'S
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight animate-glitch-text neon-text-gold">
            INNOVATORS
          </h1>
        </div>

        {/* Subheadline */}
        <div className="mb-12 space-y-3">
          <p className="text-lg sm:text-xl text-[#e0e6ff] font-light tracking-widest uppercase">
            Science & Technology Education
          </p>
          <p className="text-base sm:text-lg text-[#a0a6b8] font-light">
            Lagos State University • Since 1983 • For Truth and Service
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <button className="cyber-button group text-base sm:text-lg px-8 py-4 relative overflow-hidden">
            <span className="relative z-10">ENTER THE ACADEMY</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f5ff]/0 to-[#00f5ff]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </button>

          <button className="cyber-button purple group text-base sm:text-lg px-8 py-4 relative overflow-hidden">
            <span className="relative z-10">JOIN THE LEGACY</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#9d00ff]/0 to-[#9d00ff]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#00f5ff] text-sm uppercase tracking-widest font-semibold">Scroll to explore</span>
            <svg className="w-6 h-6 text-[#00f5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f5ff] via-[#9d00ff] to-[#ffd700] z-50 animate-holographic" />
    </section>
  );
}
