"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionReveal } from "@/components/home/section-reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { editorialEase } from "@/lib/motion";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.48, ease: editorialEase },
  },
};

export function DailyFlowSection() {
  const reduce = useReducedMotion();
  const { t } = useLocale();

  return (
    <SectionReveal className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {t.dailyFlow.kicker}
      </p>
      <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {t.dailyFlow.title}
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t.dailyFlow.lead}</p>

      <motion.ol
        className="relative mt-12 space-y-0 border-l border-primary/25 pl-8 sm:pl-10"
        variants={reduce ? undefined : listVariants}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, margin: "-50px" }}
      >
        {t.dailyFlow.steps.map((step, i) => (
          <motion.li
            key={i}
            className="relative pb-12 last:pb-0"
            variants={reduce ? undefined : itemVariants}
          >
            <span
              className="absolute -left-[21px] top-1 flex size-3 rounded-full border-2 border-background bg-primary sm:-left-[25px] sm:size-3.5"
              aria-hidden
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/90">
              Step {i + 1}
            </span>
            <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </SectionReveal>
  );
}
