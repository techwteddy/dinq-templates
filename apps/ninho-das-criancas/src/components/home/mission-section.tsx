"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { useLocale } from "@/components/i18n/locale-provider";
import { SectionReveal } from "@/components/home/section-reveal";
import type { MissionSectionCopy } from "@/lib/data/home-page-content";
import { editorialDuration, editorialEase } from "@/lib/motion";

export function MissionSection({ copy }: { copy: MissionSectionCopy }) {
  const reduce = useReducedMotion();
  const { t } = useLocale();

  return (
    <SectionReveal id="mission" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-2 space-y-6 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {copy.missionKicker}
          </p>
          <h2 className="text-keep-words font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {copy.missionTitle}
          </h2>
          <p className="text-keep-words text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
            {copy.missionP1}
          </p>
          <p className="text-keep-words text-base leading-relaxed text-muted-foreground whitespace-pre-line">
            {copy.missionP2}
          </p>
        </div>
        <motion.div
          className="order-1 lg:order-2"
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px", amount: 0.25 }}
          transition={{ duration: editorialDuration.section, ease: editorialEase }}
        >
          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/50 shadow-soft ring-1 ring-foreground/[0.06]"
            whileHover={reduce ? undefined : { scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=900&q=80"
              alt={t.missionImageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </motion.div>
        </motion.div>
      </div>
    </SectionReveal>
  );
}
