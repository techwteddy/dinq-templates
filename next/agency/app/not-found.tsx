"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* 404 Number */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-7xl sm:text-8xl font-bold text-gray-900 dark:text-white mb-2"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-3"
        >
          Page not found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
        >
          <Link
            href="/"
            className="px-6 py-3 bg-stone-100/95 border border-white/40 hover:bg-stone-200/95 dark:bg-gray-950/75 dark:border-black/40 dark:hover:bg-gray-950/85 backdrop-blur-[0.5rem] shadow-lg shadow-black/[0.03] dark:text-white text-gray-800 font-semibold rounded-full transition-all hover:scale-105 active:scale-95"
          >
            Go to homepage
          </Link>

          <Link
            href="/#contact-us"
            className="px-6 py-3 bg-transparent border-2 border-gray-800/40 hover:border-gray-800/60 dark:border-white/40 dark:hover:border-white/60 backdrop-blur-[0.5rem] dark:text-white text-gray-800 font-semibold rounded-full transition-all hover:scale-105 active:scale-95"
          >
            Contact us
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/#packages"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Our Packages
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link
              href="/#work"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Selected Work
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link
              href="/#about-us"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              About Us
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
