import React from "react";
import { Linkedin, Github, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Custom SVG for X logo
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.95H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.965H5.078z" />
  </svg>
);

// Custom Sketchy Reddit Icon (Snoo) - Scaled Up
const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Left and Right Ears */}
    <circle cx="3.5" cy="14" r="1.75" />
    <circle cx="20.5" cy="14" r="1.75" />

    {/* Wide Head */}
    <ellipse cx="12" cy="14" rx="8" ry="5.5" />

    {/* Antenna Stem */}
    <path d="M12 8.5v-5h3.5" />

    {/* Antenna Dot */}
    <circle cx="16.5" cy="3.5" r="1.25" />

    {/* Eyes (Filled for contrast) */}
    <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />

    {/* Smile */}
    <path d="M9 16.5c1.5 1.5 4.5 1.5 6 0" />
  </svg>
);

// Custom SVG for YouTube logo
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export function HeroGreeting() {
  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/sheamus-byrne/", color: "hover:text-blue-600" },
    { icon: XIcon, href: "https://x.com/famousshea", color: "hover:text-zinc-900 dark:hover:text-white" },
    { icon: Github, href: "https://github.com/famousshea", color: "hover:text-zinc-900 dark:hover:text-white" },
    { icon: RedditIcon, href: "https://www.reddit.com/user/FamousSheamusAI/", color: "hover:text-[#FF4500]" },
    { icon: YoutubeIcon, href: "https://www.youtube.com/@famoussheamusai", color: "hover:text-[#FF0000]" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-lg p-6 sm:p-8 lg:p-10 rounded-3xl bg-white/75 dark:bg-zinc-950/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/5 dark:shadow-none">
      <div className="space-y-2">
        <h1 className="hero-title text-5xl md:text-7xl font-bold tracking-tight text-foreground relative py-2">
          Hello, I&apos;m <br />
          <span className="relative">
            Sheamus.
            <div className="absolute -bottom-2 left-0 h-2 w-full bg-accent/20 rounded-full -rotate-1" />
          </span>
        </h1>
        <p className="hero-description text-xl md:text-2xl font-medium text-zinc-500 dark:text-zinc-400">
          Fractional CTO and <span className="text-accent underline decoration-4 underline-offset-8">AI Implementation Consultant</span>
        </p>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
        Helping businesses scale revenue by implementing AI
        and building resilient automated systems.
        No new software to learn—just pure efficiency.
      </p>

      {/* Social Links Badge Feed */}
      <div className="flex flex-wrap gap-2">
        {socialLinks.map((social, i) => {
          const Icon = social.icon;
          return (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-border shadow-sm transition-all hover:-translate-y-1 hover:border-accent/30",
                social.color
              )}
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>

      {/* Primary Rainbow CTA */}
      <div className="pt-4">
        <Link href="/contact" className="group relative w-fit flex items-center justify-center p-0.5 overflow-hidden rounded-2xl transition-transform hover:scale-105 active:scale-95">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-rainbow bg-[length:200%_auto]" />

          <div className="relative flex items-center gap-3 px-8 py-4 bg-white dark:bg-zinc-950 rounded-2xl transition-colors group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900 border border-transparent">
            <span className="text-lg font-bold tracking-tight text-foreground">Book a Strategy Call</span>
            <ArrowRight className="h-5 w-5 text-foreground group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
        </Link>
      </div>
    </div>
  );
}