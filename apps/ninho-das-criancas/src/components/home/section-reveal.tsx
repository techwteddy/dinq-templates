"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { editorialDuration, editorialEase } from "@/lib/motion";

type SectionRevealProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function SectionReveal({ id, className, children }: SectionRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32, filter: "blur(8px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px", amount: 0.15 }}
      transition={{
        duration: reduce ? 0.01 : editorialDuration.section,
        ease: editorialEase,
      }}
    >
      {children}
    </motion.section>
  );
}
