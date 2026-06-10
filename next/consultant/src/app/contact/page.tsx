import type { Metadata } from "next";
import React from "react";
import { SITE_URL, buildBreadcrumbs, buildGraphScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact Famous Sheamus | Worldwide AI Strategy Audits",
  description: "Connect with Famous Sheamus for a global AI audit and fractional CTO strategy. Serving enterprises worldwide with AI implementation and automation roadmap.",
  alternates: {
    canonical: '/contact',
  },
};

import { TopNav } from "@/components/TopNav";
import { Linkedin, Github, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { TidyCalEmbed } from "@/components/TidyCalEmbed";

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
    <circle cx="3.5" cy="14" r="1.75" />
    <circle cx="20.5" cy="14" r="1.75" />
    <ellipse cx="12" cy="14" rx="8" ry="5.5" />
    <path d="M12 8.5v-5h3.5" />
    <circle cx="16.5" cy="3.5" r="1.25" />
    <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
    <path d="M9 16.5c1.5 1.5 4.5 1.5 6 0" />
  </svg>
);

// Custom SVG for YouTube logo
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SOCIAL_LINKS = [
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/sheamus-byrne/", color: "hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]" },
  { name: "X / Twitter", icon: XIcon, href: "https://x.com/famousshea", color: "hover:bg-black hover:text-white hover:border-black dark:hover:bg-zinc-800" },
  { name: "GitHub", icon: Github, href: "https://github.com/famousshea", color: "hover:bg-zinc-900 hover:text-white hover:border-zinc-900 dark:hover:bg-zinc-800" },
  { name: "Reddit", icon: RedditIcon, href: "https://www.reddit.com/user/FamousSheamusAI/", color: "hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]" },
  { name: "YouTube", icon: YoutubeIcon, href: "https://www.youtube.com/@famoussheamusai", color: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]" },
];

export default function ContactPage() {
  const contactNodes = [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact/#webpage`,
      "name": "Contact Famous Sheamus | Worldwide AI Strategy Audits",
      "url": `${SITE_URL}/contact`,
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "mainEntity": { "@id": `${SITE_URL}/#organization` }
    },
    buildBreadcrumbs([
      { name: "Home", url: SITE_URL },
      { name: "Contact", url: `${SITE_URL}/contact` }
    ])
  ];

  return (
    <main className="relative min-h-screen pt-32 pb-48 overflow-hidden bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildGraphScript(contactNodes) }}
      />
      <TopNav />
      {/* Background Vignette */}
      <div className="vignette fixed inset-0 pointer-events-none" />

      <div className="container relative mx-auto px-6 max-w-5xl">
        {/* Header Section */}
        <section className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Let&apos;s <span className="text-accent underline decoration-4 underline-offset-8">Connect.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl leading-relaxed">
            Ready to audit your existing workflows and replace operational chaos with AI-driven precision?
          </p>
        </section>

        {/* Contact Info & Socials Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Quick Contact Card */}
          <div className="flex flex-col gap-6 p-8 rounded-3xl border border-border bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Contact Details</h2>
            <div className="space-y-6">
              <a href="mailto:sheamus@famoussheamus.com" className="group flex items-center gap-4 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email</p>
                  <p className="text-lg font-medium group-hover:text-accent transition-colors">sheamus@famoussheamus.com</p>
                </div>
              </a>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-500/10 text-zinc-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</p>
                  <p className="text-lg font-medium">Dallas-Based / Global Reach</p>
                  <p className="text-sm text-zinc-500 mt-1 max-w-[200px] leading-relaxed">
                    Available for worldwide travel for on-site AI audits, implementation, and executive strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Platforms Card */}
          <div className="flex flex-col gap-6 p-8 rounded-3xl border border-border bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Social Intelligence</h2>
            <div className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border border-border bg-background/50 transition-all hover:scale-[1.02] active:scale-[0.98] group",
                    social.color
                  )}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="font-bold tracking-tight">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Full-width TidyCal Embed Section */}
        <section className="rounded-3xl border border-border bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm p-2 md:p-8 overflow-hidden min-h-[600px]">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Schedule a Strategy Call</h2>
            <p className="text-zinc-500">Select a time below for a 30-minute discovery session.</p>
          </div>

          <div className="w-full">
            <TidyCalEmbed />
          </div>
        </section>
      </div>
    </main>
  );
}