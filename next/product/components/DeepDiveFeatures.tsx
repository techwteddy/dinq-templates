"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    label: "PRECISION",
    title: "Every Key,\nPerfectly Weighted",
    description: "63.5g actuation force with gold-plated springs. Each keystroke feels intentional, controlled, and satisfying.",
    stat: "63.5g",
    statLabel: "Actuation Force",
  },
  {
    id: 2,
    label: "ACOUSTICS",
    title: "Sound\nEngineered",
    description: "Triple-layer foam dampening with silicone gaskets. The signature 'thock' that keyboard enthusiasts crave.",
    stat: "32dB",
    statLabel: "Noise Level",
  },
  {
    id: 3,
    label: "WIRELESS",
    title: "Zero\nCompromise",
    description: "2.4GHz wireless with 1ms latency. 8000mAh battery lasts 3 months. Gaming-grade performance, untethered.",
    stat: "1ms",
    statLabel: "Response Time",
  },
];

export default function DeepDiveFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // Hero text reveal animation
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroTextRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      heroTl.fromTo(
        ".hero-line",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: "power3.out" }
      );

      // Each feature section animation
      featureRefs.current.forEach((featureEl, index) => {
        if (!featureEl) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: featureEl,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
          },
        });

        // Staggered reveal for each feature
        tl.fromTo(
          featureEl.querySelector(".feature-label"),
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 }
        )
        .fromTo(
          featureEl.querySelector(".feature-title"),
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.1
        )
        .fromTo(
          featureEl.querySelector(".feature-description"),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.3
        )
        .fromTo(
          featureEl.querySelector(".feature-stat"),
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6 },
          0.4
        )
        .fromTo(
          featureEl.querySelector(".feature-line"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power2.out" },
          0.2
        );
      });

      // Parallax effect on floating elements
      gsap.to(".floating-element", {
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-20 w-full overflow-hidden bg-[#050505]"
      id="features-deep-dive"
    >
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Floating Gradient Orbs */}
      <div className="floating-element pointer-events-none absolute -right-32 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent blur-3xl" />
      <div className="floating-element pointer-events-none absolute -left-32 top-3/4 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-orange-600/8 via-transparent to-transparent blur-3xl" />

      {/* Hero Section - Main Title */}
      <div ref={heroTextRef} className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32">
        <div className="overflow-hidden">
          <p className="hero-line mb-6 text-center font-mono text-xs uppercase tracking-[0.4em] text-orange-500">
            Engineered for Perfection
          </p>
        </div>
        <div className="overflow-hidden">
          <h2 className="hero-line text-center font-space text-6xl font-bold leading-[1.1] tracking-tight text-white md:text-8xl lg:text-9xl">
            The Details
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="hero-line text-center font-space text-6xl font-bold leading-[1.1] tracking-tight text-white/40 md:text-8xl lg:text-9xl">
            Define Us
          </h2>
        </div>
        <div className="overflow-hidden">
          <p className="hero-line mt-8 max-w-md text-center text-lg text-neutral-500">
            Three years of obsessive engineering. Zero compromise.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-600">Scroll</span>
            <div className="h-12 w-[1px] bg-gradient-to-b from-orange-500 to-transparent" />
          </div>
        </div>
      </div>

      {/* Features Container */}
      <div ref={featuresContainerRef} className="relative">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            ref={(el) => { featureRefs.current[index] = el; }}
            className="relative flex min-h-screen items-center border-t border-white/5"
          >
            <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:gap-24">
              {/* Left: Text Content */}
              <div className="flex flex-col justify-center">
                <span className="feature-label mb-4 inline-block w-fit rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-orange-500">
                  {feature.label}
                </span>
                <h3 className="feature-title font-space text-5xl font-bold leading-[1.1] text-white md:text-7xl" style={{ whiteSpace: 'pre-line' }}>
                  {feature.title}
                </h3>
                <div className="feature-line my-8 h-[1px] w-24 origin-left bg-gradient-to-r from-orange-500 to-transparent" />
                <p className="feature-description max-w-md text-lg leading-relaxed text-neutral-400">
                  {feature.description}
                </p>
              </div>

              {/* Right: Stat Display */}
              <div className="flex items-center justify-center md:justify-end">
                <div className="feature-stat relative">
                  <div className="absolute -inset-8 rounded-full bg-orange-500/5 blur-2xl" />
                  <div className="relative flex flex-col items-center rounded-3xl border border-white/5 bg-white/[0.02] px-16 py-12 backdrop-blur-sm">
                    <span className="font-space text-7xl font-bold text-white md:text-9xl">
                      {feature.stat}
                    </span>
                    <span className="mt-4 font-mono text-sm uppercase tracking-widest text-neutral-500">
                      {feature.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Number */}
            <div className="pointer-events-none absolute right-8 top-8 font-space text-[200px] font-bold leading-none text-white/[0.02] md:right-16 md:text-[300px]">
              0{feature.id}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="relative flex min-h-[50vh] flex-col items-center justify-center border-t border-white/5 px-6 py-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-neutral-600">
          Ready to Experience?
        </p>
        <h3 className="mb-8 text-center font-space text-4xl font-bold text-white md:text-6xl">
          Explore the Gallery
        </h3>
        <div className="flex items-center gap-3 text-orange-500">
          <span className="font-mono text-sm uppercase tracking-widest">Continue</span>
          <svg className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
