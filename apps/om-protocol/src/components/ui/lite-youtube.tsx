"use client";

import { useEffect, useRef, useState } from "react";

interface LiteYouTubeProps {
  videoid: string;
  className?: string;
}

export default function LiteYouTube({ videoid, className }: LiteYouTubeProps) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (customElements.get("lite-youtube")) {
      setReady(true);
      return;
    }
    import("lite-youtube-embed").then(() => setReady(true));
  }, []);

  // Create the custom element imperatively after registration
  useEffect(() => {
    const container = containerRef.current;
    if (!ready || !container) return;

    const el = document.createElement("lite-youtube");
    el.setAttribute("videoid", videoid);
    el.setAttribute("playlabel", "Play video");
    container.appendChild(el);

    return () => {
      el.remove();
    };
  }, [ready, videoid]);

  return <div ref={containerRef} className={className} />;
}
