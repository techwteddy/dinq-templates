"use client";

import React from "react";
import { motion } from "framer-motion";
import { packageData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

export default function Packages() {
  const ref = useSectionInView("Packages", 0.3);

  console.log("Package data:", packageData);
  console.log("Package data length:", packageData.length);

  return (
    <section
      ref={ref}
      id="packages"
      className="scroll-mt-28 mb-28 w-full max-w-[70rem]"
    >
      <h2 className="text-3xl font-medium capitalize mb-8 text-center">
        Our Packages
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr">
        {packageData && packageData.length > 0 ? (
          packageData.map((pkg, index) => (
            <motion.div
              key={index}
              className="group h-full"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-stone-100/95 h-full border border-black/5 rounded-lg overflow-hidden relative hover:bg-stone-200/95 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20 p-7 backdrop-blur-sm shadow-sm">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {pkg.title}
                </h3>
                <p className="text-gray-600 dark:text-white/70 mb-4 text-sm leading-relaxed">
                  {pkg.description}
                </p>
                <div className="mb-5">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pkg.price}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white/60 mt-1">
                    {pkg.duration}
                  </p>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-gray-700 dark:text-white/80 text-sm"
                    >
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center text-red-500">
            No package data available
          </div>
        )}
      </div>
    </section>
  );
}
