"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export function TidyCalEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If window.TidyCal is already available, we can initialize our specific element
    if (window.TidyCal && containerRef.current) {
      const container = containerRef.current;
      // Because TidyCal replaces the node, we must wrap it in a stable container to prevent React errors
      // So we render a fresh div each time the effect runs
      const child = document.createElement("div");
      child.className = "tidycal-embed";
      child.dataset.path = "sheamus/30-minute-meeting";
      container.appendChild(child);
      
      // Call init
      window.TidyCal.init(child);

      return () => {
        // Cleanup if necessary
        container.innerHTML = "";
      };
    }
  }, []);

  return (
    <div className="w-full">
      <div id="tidycal-container" ref={containerRef}>
        <div className="tidycal-embed" data-path="sheamus/30-minute-meeting" />
      </div>
      <Script
        src="https://asset-tidycal.b-cdn.net/js/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          // It initializes automatically on load due to the script's IIFE,
          // but if we need a hook when it finishes loading:
          if (containerRef.current) {
            const el = containerRef.current.querySelector('.tidycal-embed');
            if (el && window.TidyCal) {
               // Sometimes the native script will catch it, sometimes it won't.
               // We let the native script do its job if it's the first time.
            }
          }
        }}
      />
    </div>
  );
}

// Ensure TypeScript doesn't complain about window.TidyCal
interface TidyCalAPI {
  init(el: Element): void;
}

declare global {
  interface Window {
    TidyCal?: TidyCalAPI;
  }
}
