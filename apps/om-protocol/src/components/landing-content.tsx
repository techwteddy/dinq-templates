"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import BreathingOrb from "./breathing-orb";

const LiteYouTube = dynamic(() => import("./ui/lite-youtube"), { ssr: false });

export default function LandingContent() {
  const [loaded, setLoaded] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [hasBreathed, setHasBreathed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleBreathingComplete = useCallback(() => {
    setShowBreathing(false);
    setHasBreathed(true);
  }, []);

  return (
    <div className="relative z-10 flex min-h-dvh flex-col items-center px-8 py-2">
      {/* Header */}
      <div id="landing-header" className="flex flex-col items-center pt-16">
        <h1
          className={`om-entrance om-title-gradient mb-2 text-center font-display leading-[1.1] tracking-[0.08em] ${loaded ? "is-loaded" : ""}`}
          style={{
            fontSize: "var(--text-title)",
            transitionDelay: "0.7s",
          }}
        >
          The OM Protocol
        </h1>

        <p
          className={`om-entrance mb-6 text-center font-body font-light uppercase text-om-text-secondary ${loaded ? "is-loaded" : ""}`}
          style={{
            fontSize: "var(--text-subtitle)",
            letterSpacing: "0.15em",
            transitionDelay: "0.9s",
          }}
        >
          A guided meditation practice for the modern mind
        </p>

        <div
          className={`om-entrance-fade om-divider mb-6 h-[2px] w-20 ${loaded ? "is-loaded" : ""}`}
          style={{ transitionDelay: "1.1s" }}
          aria-hidden="true"
        />
      </div>

      {/* Body */}
      <div id="landing-body" className="flex flex-1 flex-col items-center justify-center">
        <p
          className={`om-entrance mb-8 max-w-md text-center font-body font-light text-text-muted ${loaded ? "is-loaded" : ""}`}
          style={{
            fontSize: "var(--text-body)",
            lineHeight: 1.9,
            transitionDelay: "1.3s",
          }}
        >
          Something is being built — a new way to practice, track, and deepen
          your meditation journey. Rooted in ancient frequencies. Powered by
          intention.
        </p>

        {/* Breathing interaction */}
        <div
          className={`om-entrance-fade mb-12 flex flex-col items-center ${loaded ? "is-loaded" : ""}`}
          style={{ transitionDelay: "1.5s" }}
        >
          {!showBreathing ? (
            <Button
              variant="ghost"
              onClick={() => setShowBreathing(true)}
              className="cursor-pointer rounded-full border border-om-border-subtle bg-cosmic-blue/[0.03] px-7 py-2.5 font-body text-[11px] font-normal uppercase tracking-[4px] text-om-text-secondary transition-all duration-400 hover:border-cosmic-blue/40 hover:bg-cosmic-blue/[0.08] hover:text-om-text-secondary"
            >
              {hasBreathed && (
                <RotateCcw className="mr-1.5 size-3.5" />
              )}
              {hasBreathed ? "Breathe Again" : "Begin Breathing"}
            </Button>
          ) : (
            <div className="animate-fade-in">
              <BreathingOrb onComplete={handleBreathingComplete} />
            </div>
          )}
        </div>

        {/* Experience the Frequency */}
        <section
          className={`om-entrance mb-12 flex w-full flex-col items-center ${loaded ? "is-loaded" : ""}`}
          style={{ transitionDelay: "1.9s" }}
        >
          <p className="mb-3 font-body text-[10px] font-normal uppercase tracking-[4px] text-om-text-dim">
            Experience the Frequency
          </p>
          <div
            className="w-full max-w-[560px] overflow-hidden rounded-lg"
            style={{
              border: "0.5px solid var(--om-border-faint)",
              boxShadow: "0 0 40px var(--om-glow-faint)",
            }}
          >
            <LiteYouTube videoid="2RaWMoTJdHo" />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer
        className={`om-entrance-fade flex flex-col items-center gap-3 pb-6 ${loaded ? "is-loaded" : ""}`}
        style={{ transitionDelay: "2.1s" }}
      >
        <p className="font-body text-[8px] font-normal uppercase tracking-[3px] text-om-text-dim">
          TUNE IN &middot; FLOW DEEP &middot; HEAL FULLY
        </p>
        <nav className="flex gap-10" aria-label="Social media links">
          {[
            {
              label: "YouTube",
              href: "https://www.youtube.com/@theomprotocol",
            },
            // { label: "Instagram", href: "https://instagram.com/theomprotocol" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="om-social-link font-body text-xs font-normal uppercase no-underline"
            >
              {label}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
