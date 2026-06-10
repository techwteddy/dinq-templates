"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do you design both websites and marketing materials?",
    answer:
      "Yes! We craft everything from stunning websites to digital posters, booklets, and certificates — all tailored to your needs.",
  },
  {
    question: "Can I get custom branding for my business?",
    answer:
      "Absolutely. We create complete brand identities — including logos, brand kits, and cohesive visual elements that reflect your vision.",
  },
  {
    question:
      "Do you handle data entry and booklet formatting for schools or institutions?",
    answer:
      "Yes, we specialize in academic content like syllabus layouts, exam booklets, certificates, and structured data formatting.",
  },
  {
    question: "What’s your usual project delivery time?",
    answer:
      "Most designs are delivered within 48–72 hours, depending on the project size. We prioritize fast delivery without compromising quality.",
  },
  {
    question: "Can I combine multiple services into one project?",
    answer:
      "Definitely. Whether it's branding, web development, or creative content — we offer bundled solutions tailored to your goals.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="relative py-28 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-green-800 mb-6"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-xl mx-auto mb-16"
        >
          Answers to common questions about working with DtPix Studios.
        </motion.p>

        {/* Accordion */}
        <div className="space-y-6 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-green-100 rounded-xl p-5 hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left group"
              >
                <span className="text-green-700 font-medium text-base sm:text-lg">
                  {faq.question}
                </span>
                <motion.span
                  animate={{
                    rotate: activeIndex === index ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-green-500 group-hover:text-green-700" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-3 text-gray-600 text-sm sm:text-base"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
