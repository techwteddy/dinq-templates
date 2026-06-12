"use client";

import { motion, Variants } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Імпортуємо англійські копії компонентів
// ВАЖЛИВО: Вам потрібно створити ці файли в папці components, просто скопіювавши оригінали
import HeaderEn from "@/app/components/HeaderEn";
import FooterEn from "@/app/components/FooterEn";
import HeroEn from "@/app/components/HeroEn";
import FactsEn from "@/app/components/FactsEn";
import DirectionsEn from "@/app/components/DirectionsEn";
import LocationEn from "@/app/components/LocationEn";

import { newsDataEn } from "@/app/data/newsEn"; 

export default function HomeEn() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Беремо останні 3 новини
  const latestNews = newsDataEn.slice(0, 3);

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* Використовуємо англійський хедер */}
      <HeaderEn />

      <main>
        {/* Секції головної сторінки (тепер це окремі англійські файли) */}
        <HeroEn />
        <FactsEn />
        <DirectionsEn />

        {/* Секція новин (вона прямо тут, тому перекладаємо на місці) */}
        <section className="py-20 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  Latest <span className="text-blue-600">News</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                  Keep up with our latest events, professional achievements, and important center announcements.
                </p>
              </motion.div>
              <Link href="/en/news" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                All News <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news, index) => (
                <motion.article 
                  key={news.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } }
                  }}
                  className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-bold uppercase tracking-wider">
                      <Calendar size={14} className="text-blue-500" />
                      {news.date}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {/* Посилання веде на англійську версію новини */}
                      <Link href={`/en/news/${news.slug}`}>{news.title}</Link>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">{news.excerpt}</p>
                    <Link href={`/en/news/${news.slug}`} className="text-blue-600 font-bold text-sm inline-flex items-center gap-1 group/btn">
                      Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Англійська локація */}
        <LocationEn />

        {/* CTA Section (Заклик до дії) */}
        <section className="py-20 md:py-32 px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-blue-600 dark:bg-blue-600 text-white rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start rehabilitation?</h2>
              <p className="text-blue-100 text-lg mb-10">
                Book an initial consultation today. Our specialists will conduct an assessment and develop a personalized program for your child.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/en/contacts" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                  Fill Application Form
                </Link>
                <a href="tel:+380674110331" className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white rounded-full font-bold hover:bg-blue-800 transition-colors">
                  Call Us Now
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Використовуємо англійський футер */}
      <FooterEn />
    </div>
  );
}