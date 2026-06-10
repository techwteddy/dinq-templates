"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="order"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-bg-primary">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong mb-8">
          <Sparkles size={14} className="text-accent-gold" />
          <span className="text-sm text-neutral-300">Limited First Edition</span>
        </div>

        {/* Headline */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-space font-bold text-white mb-6 leading-tight">
          Ready to
          <br />
          <span className="text-gradient">Elevate?</span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Experience the next generation of mechanical keyboards. 
          <br className="hidden md:block" />
          Pre-order now and be among the first.
        </p>

        {/* Price & CTA */}
        <div className="flex flex-col items-center gap-6">
          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-neutral-500 line-through text-xl">$349</span>
            <span className="text-4xl md:text-5xl font-space font-bold text-white">$299</span>
            <span className="text-neutral-500 text-lg">USD</span>
          </div>

          {/* CTA Button */}
          <button className="group relative px-12 py-5 bg-primary-500 text-white text-lg font-semibold rounded-full overflow-hidden shadow-glow hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-300">
            <span className="relative z-10 flex items-center gap-3">
              Pre-Order Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-neutral-500 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Free Shipping
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              2-Year Warranty
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              30-Day Returns
            </span>
          </div>
        </div>
      </div>

      {/* Decorative floating keyboard silhouette */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 opacity-5 pointer-events-none">
        <div className="w-full aspect-[3/1] border border-white/20 rounded-t-3xl" />
      </div>
    </section>
  );
}
