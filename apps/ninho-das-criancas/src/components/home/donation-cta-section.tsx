"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

import { buttonVariants } from "@/components/ui/button";
import type { DonationCtaCopy } from "@/lib/data/home-page-content";
import { editorialEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function DonationCtaSection({ copy }: { copy: DonationCtaCopy }) {
  const reduce = useReducedMotion();

  const line = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduce ? 0 : 22 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduce ? 0.01 : 0.62,
          ease: editorialEase,
        },
      },
    }),
    [reduce]
  );

  const group = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduce ? 0 : 0.1,
          delayChildren: reduce ? 0 : 0.08,
        },
      },
    }),
    [reduce]
  );

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-muted/25 via-background to-muted/15 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-brand opacity-[0.42]"
        aria-hidden
      />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.h2
            variants={line}
            className="text-keep-words font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            {copy.donateCtaTitle}
          </motion.h2>
          <motion.p
            variants={line}
            className="mt-4 text-keep-words text-base leading-relaxed text-muted-foreground sm:text-lg whitespace-pre-line"
          >
            {copy.donateCtaBody}
          </motion.p>
          <motion.div
            variants={line}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/donate"
              className={cn(
                buttonVariants({ size: "lg" }),
                "shadow-glow-sm transition-[box-shadow,transform] duration-300 hover:scale-[1.03] hover:shadow-glow active:scale-[0.99]"
              )}
            >
              {copy.donateCtaPrimaryLabel}
            </Link>
            <Link
              href="/news"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary/30 bg-background/80 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99]"
              )}
            >
              {copy.donateCtaSecondaryLabel}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
