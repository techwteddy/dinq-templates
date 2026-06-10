import React from "react";
import Image from "next/image";

export function ProfileAvatar() {
  return (
    /* Increased dimensions for a commanding presence */
    <div className="relative h-96 w-full md:h-[35rem] md:w-[30rem] lg:h-[40rem] lg:w-[35rem] group">

      {/* 1. Subtle Brand Glow: Reinforces the Teal/Mint palette */}
      <div className="absolute inset-0 bg-teal-500/10 blur-[100px] rounded-full group-hover:bg-mint-400/15 transition-colors duration-500" />

      {/* 2. Rounded Container: Matches the "Bento-Grid" service layout */}
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl bg-white dark:bg-zinc-950">

        {/* 3. The Mask: Keeping a subtle bottom fade so the transition isn't jarring */}
        <div
          className="relative h-full w-full"
          style={{
            maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
          }}
        >
          {/* 4. Next.js Optimized Image: Fast load times for GEO dominance */}
          <Image
            src="/images/sheamus-suit03.webp"
            alt="Sheamus, Fractional CTO specializing in AI automation for SMBs"
            fill
            priority
            decoding="async"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          />
        </div>
      </div>

      {/* 5. ROI-Focused Status Badge: A high-trust professionalism signal */}
      <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-full bg-white dark:bg-zinc-900 px-4 py-2 shadow-2xl border border-teal-500/30 z-10">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
        </span>
        <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-tighter">
          SYSTEMS STATUS: ONLINE
        </span>
      </div>
    </div>
  );
}