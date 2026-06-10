"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { caseStudies } from "#site/content";

type CaseStudy = (typeof caseStudies)[0];

export function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative h-full flex flex-col rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/60 overflow-hidden backdrop-blur-md transition-all hover:shadow-xl hover:border-accent/30"
    >
      <Link href={cs.permalink} className="flex flex-col h-full">
        {/* Watercolor splash background for logo */}
        <div 
          className="relative h-48 w-full flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: cs.brandColor }}
        >
          <div 
            className="absolute inset-0 opacity-20 blur-3xl transition-transform duration-700 group-hover:scale-110"
            style={{ 
              backgroundImage: `radial-gradient(circle at center, ${cs.brandColor} 0%, transparent 70%)`
            }} 
          />
          {cs.logoPath ? (
            <div className="absolute inset-0 z-10 transition-transform duration-500 group-hover:scale-105">
              <Image
                src={cs.logoPath}
                alt={cs.companyName}
                fill
                className="object-contain object-right-top"
              />
            </div>
          ) : (
            <div className="relative z-10 p-8 transition-transform duration-500 group-hover:scale-110">
              <span className="text-2xl font-bold">{cs.companyName}</span>
            </div>
          )}
        </div>

        <div className="flex-grow p-6 flex flex-col">
          <div className="mb-4">
             <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md" style={{ backgroundColor: `${cs.brandColor}20`, color: cs.brandColor }}>
                {cs.companyName}
             </span>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
            {cs.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6">
            {cs.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {cs.stats?.slice(0, 2).map((stat: string, i: number) => (
                <span key={i} className="text-[10px] font-medium bg-accent/5 text-accent px-2 py-0.5 rounded-full border border-accent/10">
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
