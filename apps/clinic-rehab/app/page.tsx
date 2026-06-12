"use client";

import { motion, Variants } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Імпортуємо ваші готові компоненти
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import Facts from "@/app/components/Facts";
import Directions from "@/app/components/Directions";
import Location from "@/app/components/Location";

// Імпортуємо базу новин
import { newsData } from "@/app/data/news"; 

export default function Home() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Беремо тільки 3 останні новини для головної сторінки
  const latestNews = newsData.slice(0, 3);

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН ДЛЯ ВСЬОГО САЙТУ */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/20 dark:bg-blue-700/20 blur-[120px]"></div>
         <div className="absolute left-[-10%] top-[20%] -z-10 h-[300px] w-[300px] rounded-full bg-emerald-500/20 dark:bg-emerald-700/20 blur-[100px]"></div>
      </div>

      <Header />

      <main className="relative z-10">
        
        {/* ВАШІ ГОТОВІ БЛОКИ */}
        <Hero />
        <Facts />
        <Directions />
        
        {/* ОСТАННІ НОВИНИ (Додані прямо сюди) */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Останні новини центру</h2>
              <p className="text-slate-600 dark:text-slate-400">Будьте в курсі наших подій, нових методів лікування та порад від спеціалістів.</p>
            </div>
            <Link href="/novyny" className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm text-slate-700 dark:text-slate-300 shrink-0">
              Всі новини
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <article key={news.slug} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col group">
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image src={news.image} alt={news.title} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                    <Calendar size={12} className="text-blue-600 dark:text-blue-400" />
                    {news.date}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={`/novyny/${news.slug}`}>{news.title}</Link>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{news.excerpt}</p>
                  <Link href={`/novyny/${news.slug}`} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-800 dark:hover:text-blue-300 transition-colors mt-auto group/btn">
                    Читати <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/novyny" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm text-slate-700 dark:text-slate-300">
              Всі новини
            </Link>
          </div>
        </section>

        {/* ВАШ БЛОК ЛОКАЦІЇ */}
        <Location />

        {/* ФІНАЛЬНИЙ ЗАКЛИК ДО ДІЇ (CTA) */}
        <section className="pb-24 px-6 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-blue-600 dark:bg-blue-600 text-white rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
            {/* Декор */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Готові розпочати реабілітацію?</h2>
              <p className="text-blue-100 text-lg mb-10">
                Запишіться на первинну консультацію. Наші спеціалісти проведуть огляд, встановлять діагноз та розроблять індивідуальну програму для вашої дитини.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/kontakty" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                  Заповнити анкету
                </Link>
                <a href="tel:+380674572828" className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white border border-blue-500 rounded-full font-bold hover:bg-blue-800 transition-colors">
                  Зателефонувати
                </a>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
}