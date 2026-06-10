"use client";

import React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

export function ContactBadge() {
  return (
    <Link
      href="/contact"
      className="group fixed bottom-32 md:bottom-10 left-6 z-50 flex items-center gap-2 rounded-full border border-border bg-white/80 dark:bg-zinc-900/80 p-2 pr-4 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white dark:hover:bg-zinc-900"
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
        {/* Pulse Effect */}
        <span className="absolute inset-0 block h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <Phone className="h-4 w-4 relative z-10" />
      </div>
      <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">Book a Call</span>
    </Link>
  );
}
