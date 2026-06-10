"use client";

import React from "react";

const items = [
  "AI Strategy",
  "Fractional CTO",
  "Process Automation",
  "Voice AI Receptionist",
  "N8N Workflows",
  "Custom LLM Chatbots",
  "System Architecture",
  "Data Visualization",
  "CRM Integration",
  "Lead Qualification",
];

export function RollingMarquee() {
  return (
    <div className="relative flex w-full overflow-hidden bg-white/50 dark:bg-zinc-900/50 py-3 border-y border-border backdrop-blur-sm">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span 
            key={i} 
            className="mx-8 text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase hover:text-accent transition-colors cursor-default"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
