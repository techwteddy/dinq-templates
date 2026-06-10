"use client";

import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const messages = [
  "Web Designs that Convert & Engage",
  "Powerful Branding for Bold Businesses",
  "Posters that Capture Every Eye",
  "Smart Layouts for Smarter Content",
  "Booklets Built for Impact & Clarity",
  "Clean Data Entry with Creative Precision",
  "From Idea to Identity — We Design It All",
  "Your Brand, Designed to Impress",
];

export default function ScrollingBanner() {
  return (
    <div className="relative w-full overflow-hidden py-2 bg-green-600 -skew-y-3 shadow-inner">
      <motion.div
        className="flex whitespace-nowrap gap-10 px-6 skew-y-3"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {[...messages, ...messages].map((msg, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-white text-sm sm:text-lg font-semibold uppercase tracking-wider opacity-90 hover:opacity-100 transition-opacity"
          >
            <span className="text-yellow-300 animate-pulse">
              <FaStar className="text-xs sm:text-base" />
            </span>
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {msg}
            </motion.span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
