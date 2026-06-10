"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { reviewsData } from '@/lib/data';
import Review from '@/components/ui/review';
import { useSectionInView } from '@/lib/hooks';

export const Testimonials: React.FC = () => {
  const ref = useSectionInView("Reviews");

  return (
    <motion.section
      ref={ref}
      id="testimonials"
      className="scroll-mt-28 mb-8 w-full max-w-[1200px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileInView={{ opacity: 1 }}
      aria-labelledby="testimonials-heading"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.175 }}
        className="text-center mb-12"
      >
        <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
          What Clients Say
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Real results from real clients who trusted us with their vision
        </p>
      </motion.div>

      {/* Testimonials Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr"
        role="list"
        aria-label="Client testimonials"
      >
        {reviewsData.map((review, index) => (
          <motion.div
            key={index}
            role="listitem"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut"
            }}
            className="h-full"
          >
            <Review {...review} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Testimonials;
