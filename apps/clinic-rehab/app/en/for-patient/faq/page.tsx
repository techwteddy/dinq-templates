"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import HeaderEn from "@/app/components/HeaderEn";
import FooterEn from "@/app/components/FooterEn";

import { faqData, categories } from "@/app/data/faqEn";

export default function FAQPageEn() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <HeaderEn />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative z-10">
        
        {/* Header Banner */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
            Information Center
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white mt-4 tracking-tight leading-none">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-base md:text-lg max-w-xl mx-auto font-medium">
            Find quick answers to questions regarding admission of children, free services funded by NHSU, and rehabilitation pathways.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-10 shadow-lg rounded-2xl overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by keywords..."
            className="w-full pl-12 pr-4 py-4.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base transition"
          />
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenId(null);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs md:text-sm font-bold transition shadow-sm cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-slate-105 dark:bg-slate-900 text-slate-650 dark:text-slate-350 border border-slate-150 dark:border-slate-800"
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredFAQ.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredFAQ.map((item) => {
                  const isOpen = openId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/85 dark:border-slate-800/85 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none group cursor-pointer"
                      >
                        <span className="font-bold text-slate-900 dark:text-white text-base md:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {item.question}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-5 pt-1 text-sm md:text-base text-slate-600 dark:text-slate-350 leading-relaxed font-medium border-t border-dashed border-slate-100 dark:border-slate-800">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-150 dark:border-slate-800"
              >
                <p className="text-slate-500 dark:text-slate-400 font-medium">No results found for your query. Try changing search keywords.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      <FooterEn />
    </div>
  );
}
