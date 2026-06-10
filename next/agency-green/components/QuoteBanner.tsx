"use client";

import { motion } from "framer-motion";

export default function QuoteBanner() {
  return (
    <section className="relative bg-gradient-to-r from-green-50 via-white to-green-100 py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <blockquote className="text-xl sm:text-2xl md:text-3xl text-green-900 italic font-medium leading-relaxed relative">
          “Great design isn’t just what it looks like — it’s how it feels,
          speaks, and builds trust. That’s what we craft at DtPix Studios.”
        </blockquote>
        <div className="mt-6 text-sm text-green-600">— DtPix Studios Team</div>
      </motion.div>
    </section>
  );
}
