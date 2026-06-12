"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Shield,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { editorialEase } from "@/lib/motion";

const icons = [Shield, UtensilsCrossed, BookOpen, Sparkles, Heart] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: editorialEase },
  },
};

function Card({
  title,
  body,
  icon: Icon,
  reduce,
}: {
  title: string;
  body: string;
  icon: (typeof icons)[number];
  reduce: boolean;
}) {
  return (
    <motion.div
      className="flex h-full flex-col rounded-xl border border-border/70 bg-card/90 p-5 shadow-sm ring-1 ring-foreground/5"
      whileHover={
        reduce ? undefined : { y: -5, transition: { duration: 0.28, ease: editorialEase } }
      }
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}

export function ProvideSection() {
  const reduce = useReducedMotion() === true;
  const { t } = useLocale();

  const cards = t.provide.cards.map((c, i) => ({
    ...c,
    icon: icons[i]!,
  }));

  if (reduce) {
    return (
      <section className="border-y border-border/60 bg-muted/25 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t.provide.kicker}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t.provide.title}
            </h2>
            <p className="mt-4 whitespace-pre-line text-keep-words text-muted-foreground">{t.provide.subtitleReduce}</p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((entry, idx) => (
              <li key={idx}>
                <Card {...entry} reduce={reduce} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-border/60 bg-muted/25 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t.provide.kicker}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.provide.title}
          </h2>
          <p className="mt-4 whitespace-pre-line text-keep-words text-muted-foreground">{t.provide.subtitle}</p>
        </div>

        <motion.ul
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px", amount: 0.2 }}
        >
          {cards.map((entry, idx) => (
            <motion.li
              key={idx}
              variants={item}
              className="h-full [list-style:none]"
            >
              <Card {...entry} reduce={reduce} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
