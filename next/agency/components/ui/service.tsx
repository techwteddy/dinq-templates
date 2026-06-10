
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { expertiseAreas } from "@/lib/data";

type ServiceProps = (typeof expertiseAreas)[number] & { index: number };

export default function Service({
  title,
  description,
  services,
  technologies,
  index,
}: ServiceProps) {
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
      className="group h-full"
    >
      <div className="bg-stone-100/95 h-full border border-black/5 rounded-lg overflow-hidden relative hover:bg-stone-200/95 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20 flex flex-col backdrop-blur-sm shadow-sm">
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-xs leading-relaxed text-gray-700 dark:text-white/70 mb-3">
            {description}
          </p>
          
          {/* Services - show first 3 */}
          <div className="mb-3">
            <h4 className="text-xs font-semibold mb-1 text-gray-800 dark:text-gray-200">
              Services
            </h4>
            <ul className="space-y-0.5">
              {services.slice(0, 3).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-xs text-gray-700 dark:text-white/70"
                >
                  <span className="mr-1.5 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies - show first 6 */}
          <div className="mt-auto">
            <h4 className="text-xs font-semibold mb-1 text-gray-800 dark:text-gray-200">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-1">
              {technologies.slice(0, 6).map((item, idx) => (
                <span
                  key={idx}
                  className="bg-black/[0.7] px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
