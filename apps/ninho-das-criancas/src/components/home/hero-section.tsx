"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import type { HeroSectionCopy } from "@/lib/data/home-page-content";
import { editorialDuration, editorialEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** 헤더 바로 아래 히어로 슬라이드 높이 (px) */
const HERO_HEIGHT_PX = 780;

const SLIDE_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1587654780293-953cf1bc64b5?w=1600&q=80",
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80",
  "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=1600&q=80",
  "https://images.unsplash.com/photo-1491013516836-7db643ee448a?w=1600&q=80",
] as const;

const AUTOPLAY_MS = 6000;

export function HeroSection({ copy }: { copy: HeroSectionCopy }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const overlayItem = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: reduceMotion ? 0 : 28,
      },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduceMotion ? 0.01 : 0.72,
          ease: editorialEase,
        },
      },
    }),
    [reduceMotion]
  );

  const overlayContainerDyn = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.11,
          delayChildren: reduceMotion ? 0 : 0.15,
        },
      },
    }),
    [reduceMotion]
  );

  const go = useCallback((dir: -1 | 1) => {
    setIndex((i) => {
      const n = SLIDE_IMAGE_URLS.length;
      return (i + dir + n) % n;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [go, reduceMotion]);

  const slideTransition = reduceMotion
    ? { duration: 0.2 }
    : { duration: editorialDuration.heroSlide, ease: editorialEase };

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-neutral-900"
      style={{ height: HERO_HEIGHT_PX }}
      aria-roledescription="carousel"
      aria-label="메인 비주얼"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${SLIDE_IMAGE_URLS[index]})`,
            }}
            initial={
              reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.05 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={slideTransition}
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/45 via-black/20 to-black/75" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[3] flex items-end"
        aria-live="polite"
        aria-atomic="true"
      >
        <motion.div
          className="pointer-events-auto mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-8 pt-16 text-white sm:gap-6 sm:px-6 sm:pb-10"
          variants={overlayContainerDyn}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={overlayItem}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90"
          >
            {copy.heroKicker}
          </motion.p>
          <motion.h1
            variants={overlayItem}
            id="hero-heading"
            className="max-w-[22ch] text-keep-words font-heading text-2xl font-semibold leading-[1.38] tracking-tight sm:max-w-[30ch] sm:text-4xl sm:leading-[1.32] md:max-w-[38ch] md:text-5xl md:leading-[1.28] lg:max-w-[44ch]"
          >
            {copy.heroHeadingMain}
            <span className="whitespace-nowrap text-primary drop-shadow-sm">
              {copy.heroHeadingAccent}
            </span>
          </motion.h1>
          <motion.p
            variants={overlayItem}
            className="max-w-[46ch] whitespace-pre-line text-keep-words text-sm leading-[1.8] text-white/90 sm:max-w-[58ch] sm:text-base sm:leading-[1.78] md:max-w-[64ch]"
          >
            {copy.heroBody}
          </motion.p>
          <motion.div
            variants={overlayItem}
            className="mt-2 flex flex-wrap gap-3"
          >
            <Link
              href={copy.heroCtaSecondaryHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/50 bg-white/10 text-white backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] hover:bg-white/20 hover:text-white active:scale-[0.99]"
              )}
            >
              {copy.heroCtaSecondaryLabel}
            </Link>
            <Link
              href={copy.heroCtaPrimaryHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "shadow-glow-sm transition-[box-shadow,transform] duration-300 hover:scale-[1.02] hover:shadow-glow active:scale-[0.99]"
              )}
            >
              {copy.heroCtaPrimaryLabel}
            </Link>
          </motion.div>

          <motion.div
            variants={overlayItem}
            className="mt-4 flex justify-center gap-2 sm:mt-6"
            role="tablist"
            aria-label="슬라이드 선택"
          >
            {SLIDE_IMAGE_URLS.map((_, i) => (
              <motion.button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`슬라이드 ${i + 1} / ${SLIDE_IMAGE_URLS.length}`}
                className={cn(
                  "h-2 rounded-full",
                  i === index ? "bg-white" : "bg-white/45 hover:bg-white/70"
                )}
                animate={{ width: i === index ? 32 : 8 }}
                onClick={() => setIndex(i)}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        className="absolute left-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm sm:left-4 sm:size-11"
        aria-label="이전 이미지"
        onClick={() => go(-1)}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <ChevronLeft className="size-6" strokeWidth={1.75} />
      </motion.button>
      <motion.button
        type="button"
        className="absolute right-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm sm:right-4 sm:size-11"
        aria-label="다음 이미지"
        onClick={() => go(1)}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <ChevronRight className="size-6" strokeWidth={1.75} />
      </motion.button>
    </section>
  );
}
