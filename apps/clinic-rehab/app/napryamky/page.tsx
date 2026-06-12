"use client";

import { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Activity, Speech, HandMetal, Waves, Stethoscope, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import Header from "@/app/components/Header"; 
import Footer from "@/app/components/Footer";

import { directionsData, DirectionItem } from "@/app/data/directions";

export default function DirectionsPage() {
  const [selectedItem, setSelectedItem] = useState<DirectionItem | null>(null);

  // Блокуємо скрол основної сторінки, коли відкрито модальне вікно
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedItem]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <Header />

      <main className="py-16 md:py-24 relative z-10">
        
        {/* ШАПКА СТОРІНКИ */}
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
              Напрямки та <span className="text-blue-600 dark:text-blue-400">методи реабілітації</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Комплексні реабілітаційні заходи для дітей з інвалідністю та ризиком її отримання. Програма призначається індивідуально мультидисциплінарною командою.
            </p>
          </motion.div>
        </div>

        {/* СЕКЦІЯ 1: ПОКАЗАННЯ */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl font-bold mb-10 text-center">
            З чим ми працюємо
          </motion.h2>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-stretch">
            {directionsData.map((item) => (
              <motion.div
                variants={fadeUp}
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`${item.colSpanClass} bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <item.icon className={`${item.colorClass} mb-4 shrink-0 group-hover:scale-110 transition-transform duration-300`} size={36} />
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{item.shortDesc}</p>
                </div>
                
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  Детальніше <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* МОДАЛЬНЕ ВІКНО */}
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              
              {/* Затемнений фон */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
              />

              {/* Контент модального вікна */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] p-8 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-100 dark:border-slate-800"
              >
                <button 
                  onClick={() => setSelectedItem(null)} 
                  className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={20} className="text-slate-600 dark:text-slate-300" />
                </button>

                <selectedItem.icon className={`${selectedItem.colorClass} mb-6`} size={48} />
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">{selectedItem.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {selectedItem.expandedDesc}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Приклади захворювань:</span>
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {selectedItem.examples}
                  </p>
                </div>
              </motion.div>

            </div>
          )}
        </AnimatePresence>

        {/* СЕКЦІЯ 2: МЕТОДИ ЛІКУВАННЯ */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-slate-900 dark:bg-slate-950 text-white rounded-[40px] p-8 md:p-16 overflow-hidden relative shadow-2xl shadow-slate-300 dark:shadow-none border border-transparent dark:border-slate-800">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-12 relative z-10">Сучасні методи реабілітації</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 relative z-10">
              {/* Фізична терапія */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <Activity size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Фізична терапія</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div><span>Кінезотерапія, активні та пасивні вправи.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div><span>Мобілізація суглобів та пасивне розтягування.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div><span>Тренування мобільності (хода), рівноваги та координації.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div><span>Використання підвісної реабілітаційної системи.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div><span>Постуральна стабілізація та вертикалізація.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div><span>Механотерапія та лікувальний масаж.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div><span>Підбір технічних засобів компенсації.</span></li>
                </ul>
              </div>

              {/* Ерготерапія та Сенсорика */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <HandMetal size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Ерготерапія та Сенсорика</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div><span>Тренування навичок самообслуговування.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div><span>Відновлення участі в повсякденних активностях.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div><span>Заняття в сенсорній кімнаті (сенсорна стимуляція).</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div><span>Розвиток рухових функцій верхніх кінцівок.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div><span>Тренування навичок та консультування батьків.</span></li>
                </ul>
              </div>

              {/* Логопедична корекція */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <Speech size={24} className="text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Логопедична корекція</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0"></div><span>Розвиток соціально-комунікативних навичок (зокрема при РАС).</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0"></div><span>Корекція порушень звуковимови.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0"></div><span>Розвиток фонематичних процесів та лексики.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0"></div><span>Корекція розладів шкільних навичок.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0"></div><span>Логопедичний масаж та розвиток дрібної моторики.</span></li>
                </ul>
              </div>

              {/* Апаратна фізіотерапія */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <Waves size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Апаратна фізіотерапія</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div><span><strong>Теплова терапія:</strong> інфрачервоне випромінювання.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div><span><strong>Стимулююча терапія:</strong> ампліпульстерапія.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div><span>Магнітотерапія та магнітолазерна терапія.</span></li>
                  <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div><span>УВЧ-терапія та ультразвукова терапія.</span></li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* СЕКЦІЯ 3: ЗАКЛИК ДО ДІЇ */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30">
              <Stethoscope size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">Мультидисциплінарний підхід</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Всі реабілітаційні заходи призначаються виключно після консультацій з нашими спеціалістами: лікарем ФРМ, неврологом, ортопедом, психіатром, психологом та логопедом.
            </p>
            <Link 
              href="/komanda" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 group"
            >
              Познайомитись з нашою командою
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
}