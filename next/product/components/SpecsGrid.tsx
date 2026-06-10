"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap,
  Bluetooth,
  Battery,
  Keyboard,
  Volume2,
  Cpu,
  Gauge,
  Palette,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const specs = [
  {
    icon: Zap,
    title: "1000Hz Polling",
    description: "Ultra-responsive input with 1ms response time",
    size: "large",
    accent: true,
  },
  {
    icon: Bluetooth,
    title: "Tri-Mode Connection",
    description: "2.4GHz, Bluetooth 5.1, USB-C",
    size: "medium",
  },
  {
    icon: Battery,
    title: "200+ Hours",
    description: "4000mAh battery with fast charging",
    size: "medium",
  },
  {
    icon: Keyboard,
    title: "75% Layout",
    description: "Compact without compromise",
    size: "small",
  },
  {
    icon: Volume2,
    title: "Acoustic Design",
    description: "PE foam, silicone dampening, poron gasket",
    size: "large",
  },
  {
    icon: Cpu,
    title: "ARM Processor",
    description: "Powerful onboard memory for profiles",
    size: "small",
  },
  {
    icon: Gauge,
    title: "Hot-Swap PCB",
    description: "5-pin socket compatible",
    size: "small",
  },
  {
    icon: Palette,
    title: "South-facing RGB",
    description: "Per-key illumination, 16.8M colors",
    size: "medium",
  },
];

export default function SpecsGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2";
      case "medium":
        return "md:col-span-1 md:row-span-2";
      default:
        return "md:col-span-1 md:row-span-1";
    }
  };

  return (
    <section
      id="specs"
      ref={containerRef}
      className="relative z-50 py-32 bg-bg-secondary -mt-1"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-neutral-500 text-sm font-mono tracking-widest uppercase mb-4">
            Specifications
          </p>
          <h2 className="text-4xl md:text-6xl font-space font-semibold text-white mb-4">
            Built for <span className="text-gradient">Performance</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Every specification engineered for the ultimate typing experience
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[140px]">
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.title}
                ref={addToRefs}
                className={`${getSizeClasses(spec.size)} group relative p-6 rounded-2xl bg-bg-card border border-white/5 hover:border-primary-500/30 transition-all duration-300 hover-lift cursor-pointer overflow-hidden`}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                      spec.accent
                        ? "bg-primary-500/20 text-primary-500"
                        : "bg-neutral-800 text-neutral-400 group-hover:text-primary-500"
                    } transition-colors duration-300`}
                  >
                    <Icon size={20} />
                  </div>

                  <h3 className="text-lg font-space font-semibold text-white mb-2">
                    {spec.title}
                  </h3>

                  <p className="text-neutral-500 text-sm leading-relaxed flex-grow">
                    {spec.description}
                  </p>

                  {/* Index */}
                  <div className="absolute bottom-4 right-4 text-neutral-700 font-mono text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Corner Decoration for accent cards */}
                {spec.accent && (
                  <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary-500/10 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
