"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "#site/content";
import { 
  ShieldCheck, 
  Bot, 
  MessageSquareCode, 
  Share2, 
  Server, 
  Workflow, 
  Briefcase, 
  Target, 
  PhoneCall, 
  ScanSearch, 
  Database 
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquareCode,
  Share2,
  Server,
  Workflow,
  Briefcase,
  Target,
  PhoneCall,
  ScanSearch,
  Database,
  ShieldCheck,
  Bot
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  // Slice to maxLength, then find the last space to avoid cutting mid-word
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) return truncated.slice(0, lastSpace).trim() + "...";
  return truncated.trim() + "...";
};

export function ServiceFeed() {
  // 1. Updated Logic: Finding the specific service by a more flexible slug match
  // Ensure the string below matches your actual .md or .mdx filename/slug exactly
  const primaryService = services.find(s => s.isFeatured) || services[0];

  const scrollingServices = services.filter(s => s.slug !== primaryService.slug);

  const [startIndex, setStartIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAutoPlaying || scrollingServices.length <= 3) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % scrollingServices.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, scrollingServices.length]);

  const handleInteraction = useCallback(() => {
    setIsAutoPlaying(false);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  const visibleScrolling = [];
  const numToShow = Math.min(3, scrollingServices.length);
  for (let i = 0; i < numToShow; i++) {
    const index = (startIndex + i) % scrollingServices.length;
    visibleScrolling.push(scrollingServices[index]);
  }

  return (
    <div className="flex flex-col w-full max-w-sm relative h-[630px] overflow-hidden" onMouseEnter={handleInteraction}>
      <div className="absolute left-[-23px] top-4 bottom-4 w-px bg-border z-0 hidden lg:block border-l border-dashed opacity-50" />

      {/* --- STATIC FEATURED CARD --- */}
      <div className="group relative z-10 w-full h-[180px] pb-4">
        <Link href={primaryService.permalink} className="block w-full h-full">
          <div className="absolute left-[-29px] top-6 h-3 w-3 rounded-full border-2 border-background bg-blue-600 shadow-sm hidden lg:block" />
          <div className="h-full rounded-2xl border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 p-5 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02]">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                Featured Service
              </span>
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white leading-tight line-clamp-2">
              {truncateText(primaryService.title, 65)}
            </h3>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
              {truncateText(primaryService.description, 95)}
            </p>
          </div>
        </Link>
      </div>

      {/* --- SCROLLING REMAINING CARDS --- */}
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleScrolling.map((service) => {
          const IconComponent = ICON_MAP[service.icon || "Bot"] || Bot;
          return (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="group relative z-10 w-full h-[150px] pb-4">
                <Link href={service.permalink} className="block w-full h-full">
                  <div className="absolute left-[-29px] top-6 h-3 w-3 rounded-full border-2 border-background bg-zinc-300 group-hover:bg-blue-500 hidden lg:block transition-all" />
                  <div className="h-full rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 p-5 shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:border-blue-500/30">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-500/10 transition-colors">
                        <IconComponent className="h-4 w-4 text-zinc-500 group-hover:text-blue-600" />
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                        {truncateText(service.title, 55)}
                      </h3>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {truncateText(service.description, 85)}
                    </p>
                  </div>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}