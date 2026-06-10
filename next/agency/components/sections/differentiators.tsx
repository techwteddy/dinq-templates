"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { differentiators } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import OptimizedImage from "@/components/ui/optimized-image";

type DifferentiatorProps = (typeof differentiators)[number] & { index: number };

function Differentiator({
  title,
  description,
  icon,
  supportingSignal,
  index,
}: DifferentiatorProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="group"
    >
      <div className="bg-gray-100 h-full border border-black/5 rounded-lg overflow-hidden relative hover:bg-gray-200 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        <div className="p-4 flex flex-col h-full">
          <div className="mt-3 flex-grow flex items-center justify-center">
            <OptimizedImage
              src={icon}
              alt={`${title} icon`}
              width={48}
              height={48}
              belowFold={true}
              className="transition-transform duration-300 group-hover:scale-110 mb-2 dark:brightness-0 dark:invert"
            />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          {supportingSignal && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
              {supportingSignal}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Differentiators() {
  const ref = useSectionInView("About Us");

  return null;
}
