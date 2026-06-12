"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { ReactNode } from "react";

type SectionVariant = "fadeUp" | "stagger" | "launch" | "reveal" | "flip";

const variants: Record<SectionVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  stagger: {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.08 },
    },
  },
  launch: {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  },
  reveal: {
    hidden: { opacity: 0, x: -40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  },
  flip: {
    hidden: { opacity: 0, rotateX: 12, y: 30 },
    show: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
};

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: SectionVariant;
}

export default function AnimatedSection({
  children,
  delay = 0,
  className,
  variant = "fadeUp",
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const v = variants[variant];

  return (
    <motion.div
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
      style={variant === "flip" ? { perspective: 800 } : undefined}
    >
      {children}
    </motion.div>
  );
}
