"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/heading";
import { reviewsData } from "@/lib/data";
import Review from "@/components/ui/review";
import { useSectionInView } from "@/lib/hooks";

export default function Reviews() {
  const ref = useSectionInView("Reviews", 0.3);

  return (
    <motion.section
      ref={ref}
      id="reviews"
      className="scroll-mt-28 mb-28 px-4 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      aria-labelledby="reviews-heading"
    >
      {/* Background blobs */}
      <div className="absolute top-[-10rem] -z-10 right-[10rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] bg-[#fce4ec] dark:bg-[#4a3540] sm:w-[68.75rem]"></div>
      <div className="absolute top-[10rem] -z-10 left-[-30rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] bg-[#e8eaf6] dark:bg-[#353d52] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-16"
      >
        <SectionHeading size="large" id="reviews-heading">
          Our Reviews
        </SectionHeading>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mt-4">
          Hear what our clients have to say about working with us
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto auto-rows-fr">
        {reviewsData.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            role="listitem"
            className="h-full"
          >
            <Review {...review} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
