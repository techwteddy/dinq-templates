"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

import { teamMembers } from "@/app/data/team";

// Категорії для фільтрації
const categories = ["Всі", "Лікарі", "Професіонали", "Фахівці з реабілітації", "Психологи та Логопеди", "Педагогічний персонал"];

export default function TeamPage() {
  const [activeCategory, setActiveCategory] = useState("Всі");

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const filteredTeam = teamMembers.filter(member => 
    activeCategory === "Всі" || member.category === activeCategory
  );

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <Header />

      <main className="py-16 md:py-24 relative z-10">
        
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
              Наша <span className="text-blue-600 dark:text-blue-400">команда</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Мультидисциплінарна команда спеціалістів, які щодня працюють заради здоров&apos;я, розвитку та посмішок наших пацієнтів.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredTeam.map((member, index) => (
                <motion.div
                  layout
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image src={member.image} alt={member.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" priority={index < 4} className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">{member.category}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredTeam.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              Спеціалістів у цій категорії не знайдено.
            </div>
          )}
        </div>

        {/* НОВА СЕКЦІЯ: ЗАКЛИК ДО РОБОТИ */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-10 md:p-14">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Ви молоді і амбітні, готові до навчання?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Чекаємо Вас в нашій команді! Надішліть свою анкету, і ми зв&apos;яжемося з вами для обговорення кар&apos;єрних можливостей.
            </p>
            <Link 
              href="/vakansiyi" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 group"
            >
              Заповнити анкету кандидата
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
}