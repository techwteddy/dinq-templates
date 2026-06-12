"use client";

import { motion, Variants } from "framer-motion";
import { Activity, HeartHandshake, Users, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Directions() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <section className="py-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">Напрямки нашої допомоги</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-lg leading-relaxed transition-colors">Комплексний підхід до здоров'я дитини. Від інтенсивної реабілітації до соціальної адаптації та підтримки всієї родини.</p>
        </div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Картка 1 */}
          <motion.div variants={fadeUp} className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/30 grid grid-cols-1 md:grid-cols-12 overflow-hidden hover:shadow-xl dark:hover:shadow-blue-900/20 transition-all duration-500">
              <div className="md:col-span-7 p-10">
                  <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md">
                          <Activity size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Медична реабілітація</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 transition-colors">
                      Сучасне обладнання та індивідуальні програми для кожної дитини. З нами працюють кращі лікарі, реабілітологи та логопеди для досягнення максимального результату відновлення.
                  </p>
                  <Link href="napryamky" className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition">
                      Дізнатися більше <ArrowRight size={16} />
                  </Link>
              </div>
              <div className="md:col-span-5 relative min-h-[200px] md:min-h-0 order-first md:order-last">
                  <Image src="/images/fact4.webp" alt="Сучасне обладнання" fill className="object-cover object-center" />
              </div>
          </motion.div>

          {/* Картка 2 */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col hover:shadow-lg">
            <div className="relative h-48 w-full"><Image src="/images/fact5.webp" alt="Паліативна допомога" fill className="object-cover object-center" /></div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <HeartHandshake size={20} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Паліативна допомога</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">Забезпечення гідної якості життя. Медичне спостереження, знеболення та цілодобовий комфортний догляд у стаціонарі.</p>
            </div>
          </motion.div>

          {/* Картка 3 */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col hover:shadow-lg">
            <div className="relative h-48 w-full"><Image src="/images/fact9.webp" alt="Підтримка родини" fill className="object-cover object-center" /></div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users size={20} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Підтримка родини</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">Психологічна допомога батькам, братам і сестрам. Навчальні програми для догляду за дитиною вдома.</p>
            </div>
          </motion.div>

          {/* Картка 4 (Залишаємо темною завжди, бо вона і так має темний дизайн) */}
          <motion.div variants={fadeUp} className="lg:col-span-2 bg-slate-900 dark:bg-slate-950 text-white rounded-3xl grid grid-cols-1 md:grid-cols-12 overflow-hidden hover:shadow-2xl transition-all duration-500 shadow-slate-300 dark:shadow-none dark:border dark:border-slate-800">
            <div className="md:col-span-5 relative min-h-[200px] md:min-h-0">
                <Image src="/images/fact7.webp" alt="Дружні умови" fill className="object-cover object-center opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-slate-900 dark:to-slate-950"></div>
            </div>
            <div className="md:col-span-7 p-10 relative z-10 flex flex-col justify-between">
              <div>
                  <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm"><Stethoscope size={24} /></div>
                      <h3 className="text-2xl font-bold mb-1 tracking-tight">Мультидисциплінарна команда</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed max-w-lg mb-8">Ми об'єднали вузькопрофільних спеціалістів, щоб дитина отримувала комплексну допомогу в одному місці.</p>
              </div>
              <Link href="komanda" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition group">
                Познайомитись з командою <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}