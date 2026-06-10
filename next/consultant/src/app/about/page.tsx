import type { Metadata } from "next";
import React from "react";
import { SITE_URL, buildBreadcrumbs, buildGraphScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Sheamus | Global Fractional CTO & AI Architect",
  description: "Learn about Sheamus, a Fractional CTO and AI Architect. Decades of experience in technology leadership and AI integration for global enterprises worldwide.",
  alternates: {
    canonical: '/about',
  },
};

import { TopNav } from "@/components/TopNav";
import { ContactBadge } from "@/components/ContactBadge";
import AboutCarousel from "@/components/AboutCarousel";
import { TrustStack } from "@/components/TrustStack";

export default function AboutPage() {
  const aboutNodes = [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about/#webpage`,
      "name": "About Sheamus | Global Fractional CTO & AI Architect",
      "description": "Professional background, philosophy, and core expertise of Sheamus, a Fractional CTO specializing in AI implementation and business process automation.",
      "url": `${SITE_URL}/about`,
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "mainEntity": { "@id": `${SITE_URL}/#sheamus` },
      "significantLink": [
        "https://www.linkedin.com/in/sheamus-byrne/",
        "https://github.com/famousshea",
        "https://x.com/famousshea"
      ],
      "knowsAbout": [
        { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q11660", "name": "Artificial Intelligence" },
        { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5001911", "name": "Business Process Automation" },
        { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q5287861", "name": "Chief Technology Officer" },
        { "@type": "Thing", "@id": "https://www.wikidata.org/wiki/Q179012", "name": "Project Management" }
      ]
    },
    buildBreadcrumbs([
      { name: "Home", url: SITE_URL },
      { name: "About", url: `${SITE_URL}/about` }
    ])
  ];

  return (
    <main className="relative min-h-screen pt-32 pb-48 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildGraphScript(aboutNodes) }}
      />
      <TopNav />
      <ContactBadge />

      <div className="vignette fixed inset-0 pointer-events-none" />

      <div className="container relative mx-auto px-6 max-w-4xl">

        {/* Header Row: Title + Carousel */}
        <header className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              About <span className="text-accent underline decoration-4 underline-offset-8">Sheamus</span>
            </h1>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Fractional CTO. AI Architect with Global Capability.
            </p>
          </div>

          {/* Rotating Photo Carousel */}
          <div className="flex items-center justify-center w-full relative">
            <AboutCarousel />
          </div>
        </header>

        {/* Philosophy + Core Skills Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <article className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 p-6 backdrop-blur-md">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider mb-4">Philosophy</span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              My approach is simple: No new software to learn, just pure efficiency. I specialize in building unseen, resilient architectures that work invisibly in the background.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 p-6 backdrop-blur-md">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider mb-4">Core Skills</span>
            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent"></span> Technology Leadership</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent"></span> System Architecture Design</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent"></span> N8N Automation</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent"></span> LLM &amp; AI integrations</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent"></span> Voice AI</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent"></span> Process Analysis &amp; Optimization</li>
            </ul>
          </article>
        </section>

        {/* Full-Width Background Section */}
        <section className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 p-8 backdrop-blur-md mb-8">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider mb-4">Background</span>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            With over a decade of experience in the technology sector, my journey has evolved from foundational roles in IT support and systems engineering to leading strategic software initiatives and implementation of automated systems. I&apos;ve spent years building robust infrastructures and managing complex operations for companies like prototype:IT and Makeready, eventually specializing in AI-driven automation to bridge the gap between technical complexity and scalable business growth.
          </p>
        </section>

        {/* Full-Width Personal Life Section */}
        <section className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 p-8 backdrop-blur-md">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider mb-4">Personal Life</span>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
            Outside of the keyboard, I&apos;m driven by the same spirit of exploration that defines my work. I&apos;m an avid traveler with a deep passion for experiencing new cultures, cuisines, and landscapes — the world is too vast to see from a desk. I love cooking for others, treating the kitchen as another system to master and a way to bring people together. When I&apos;m not at sea, you&apos;ll find me in the outdoors — hiking, camping, and generally embracing whatever terrain is available. Video games are a constant companion, equal parts creative outlet and competitive arena. But the north star of it all is sailing. My ultimate ambition is to circumnavigate the globe on my own vessel — the most demanding and rewarding systems challenge I can imagine.
          </p>

          {/* Interest Icon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { emoji: "✈️", label: "Travel" },
              { emoji: "🌍", label: "Exploring" },
              { emoji: "⛵", label: "Sailing" },
              { emoji: "🏕️", label: "Outdoors" },
              { emoji: "🍳", label: "Cooking" },
              { emoji: "🎮", label: "Gaming" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-background/50 hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{item.emoji}</span>
                <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Global Trust Stack */}
        <section className="mt-24">
          <TrustStack />
        </section>

      </div>
    </main>
  );
}