"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/heading";
import { expertiseAreas } from "@/lib/data";
import Service from "@/components/ui/service";
import { useSectionInView } from "@/lib/hooks";

export default function Services() {
  const ref = useSectionInView("About Us", 0.1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1250); // 1.25s delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section
      ref={ref}
      id="services"
      className={`scroll-mt-20 mb-4 sm:mb-6 transition-opacity duration-1000 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileInView={{ opacity: 1 }}
      aria-labelledby="services-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.175 }}
      >
        <SectionHeading size="medium" id="services-heading">Our expertise</SectionHeading>
      </motion.div>
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto"
        role="list"
        aria-label="Service offerings"
      >
        {expertiseAreas.map((area, index) => (
          <div key={index} role="listitem" className="flex">
            <Service {...area} index={index} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
