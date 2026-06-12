"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, FileText, HeartPulse, ShieldCheck, History, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
  const [showFullHistory, setShowFullHistory] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const nszuPackages = [
    { 
      id: "23", 
      title: "Стаціонарна паліативна медична допомога",
      description: "Комплексний медичний догляд, знеболення та цілодобова підтримка в умовах стаціонару для пацієнтів із важкими захворюваннями."
    },
    { 
      id: "24", 
      title: "Мобільна паліативна медична допомога",
      description: "Виїзна медична, соціальна та психологічна допомога пацієнтам безпосередньо за місцем їхнього перебування (вдома)."
    },
    { 
      id: "25", 
      title: "Медична реабілітація немовлят (до 3 років)",
      description: "Раннє втручання та реабілітаційні заходи для малюків, які народилися передчасно або мають вроджені/набуті вади."
    },
    { 
      id: "53", 
      title: "Реабілітаційна допомога у стаціонарних умовах",
      description: "Інтенсивна комплексна реабілітація під спостереженням мультидисциплінарної команди з цілодобовим перебуванням."
    },
    { 
      id: "54", 
      title: "Реабілітаційна допомога в амбулаторних умовах",
      description: "Реабілітаційні заняття та процедури за графіком, без необхідності цілодобового перебування в нашому центрі."
    },
    { 
      id: "86", 
      title: "Медична допомога дітям, які потребують лікування та постійного спостереження",
      description: "Передбачає цілодобовий медсестринський догляд, лікарське спостереження, забезпечення ліками та харчуванням для дітей, зокрема до 4 років, у вразливих станах."
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН (Такий самий як на головній) */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <Header />

      {/* HERO СЕКЦІЯ */}
      <section className="pt-20 pb-16 bg-transparent border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Від історії до <span className="text-blue-600 dark:text-blue-400">сучасних стандартів</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              «Вітрила Життя» — це результат понад столітньої трансформації. Від будинку немовлят, заснованого у 1919 році, до сучасного Центру медичної реабілітації та паліативної допомоги дітям.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ДІЯЛЬНІСТЬ ТА АУДИТОРІЯ */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <HeartPulse size={24} />
              </div>
              <h2 className="text-3xl font-bold">Кого ми обслуговуємо</h2>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                <p className="text-slate-700 dark:text-slate-300">Діти від народження до 3 років (включно), які потребують послуг раннього втручання або медичної реабілітації.</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                <p className="text-slate-700 dark:text-slate-300">Діти до 14 років, які належать до груп ризику щодо отримання інвалідності, та діти зі складними (паліативними) діагнозами, які потребують мобільної паліативної допомоги.</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                <p className="text-slate-700 dark:text-slate-300">Діти з інвалідністю (до 14 років включно) та їх законні представники.</p>
              </div>
            </div>
          </motion.div>

          {/* ІСТОРІЯ (Інтерактивний таймлайн) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                <History size={24} />
              </div>
              <h2 className="text-3xl font-bold">Наша спадщина</h2>
            </div>
            
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6 space-y-8 pb-4">
               {/* Базові етапи (завжди видимі) */}
               <div className="relative">
                 <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                 <h3 className="font-bold text-lg">1919 рік</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Заснування Житомирського будинку немовлят №1.</p>
               </div>

               {/* Розгорнута історія (анімована поява) */}
               <AnimatePresence>
                 {showFullHistory && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }} 
                     animate={{ height: "auto", opacity: 1 }} 
                     exit={{ height: 0, opacity: 0 }}
                     className="space-y-8 overflow-hidden"
                   >
                     <div className="relative pt-8">
                       <div className="absolute -left-[31px] top-9 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                       <h3 className="font-bold text-lg">1945 - 1973 роки</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Перші головні лікарі: Г.Я. Садова (до 1966) та М.А. Бобоха (до 1973).</p>
                     </div>
                     <div className="relative">
                       <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                       <h3 className="font-bold text-lg">1973 - 1995 роки</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Період змін керівництва. Закладом керували: Л.В. Крилова, С.С. Свиридов, В.Ф. Калинюк, Д.Д. Ярмолюк, В.Ф. Волошин, А.І. Мірошниченко, В.О. Марюнін.</p>
                     </div>
                     <div className="relative">
                       <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                       <h3 className="font-bold text-lg">1980 рік</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Переїзд Будинку дитини в нове приміщення по вул. Корабельній, 8.</p>
                     </div>
                     <div className="relative">
                       <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-950"></div>
                       <h3 className="font-bold text-lg">1995 - 2025 роки</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Директором працює С.В. Урсуленко — Заслужений лікар України. Початок реорганізації підприємства відповідно до Національної стратегії реформування.</p>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Сьогодення (завжди видиме в кінці) */}
               <div className="relative">
                 <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-50 dark:border-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                 <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">Сьогодення</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                   З квітня 2025 р. В.о директора — Тетяна Шевченко. Заклад є сучасним Центром медичної реабілітації та паліативної допомоги.
                 </p>
               </div>
            </div>

            {/* Кнопка розгортання/згортання */}
            <button 
              onClick={() => setShowFullHistory(!showFullHistory)}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              {showFullHistory ? "Згорнути історію" : "Розгорнути історію"}
              {showFullHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ПАКЕТИ НСЗУ */}
      <section className="py-20 bg-blue-50/80 dark:bg-slate-900/40 backdrop-blur border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Державні гарантії та ліцензії</h2>
            <p className="text-slate-650 dark:text-slate-350">
                Підприємство є медичним закладом вищого рівня акредитації та надає <span className="font-bold text-blue-600 dark:text-blue-400">безкоштовні</span> послуги за договорами з Національною службою здоров'я України.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {nszuPackages.map((pkg, idx) => (
                <motion.div 
                  key={pkg.id}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex flex-col gap-3.5 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-extrabold px-3 py-1.5 rounded-xl shrink-0">
                      №{pkg.id}
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-sm leading-snug">{pkg.title}</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed pl-1">{pkg.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Сертифікат ISO 9001:2015</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Відповідає національним стандартам управління якістю.</p>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Освітня ліцензія</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Організація освітнього процесу.</p>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Спеціальні ліцензії</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Медична практика, використання джерел іонізуючого випромінювання.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ГАЛЕРЕЯ */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Життя нашого центру</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative h-80 rounded-3xl overflow-hidden group">
              <Image src="/images/news/visiv1.webp" alt="Команда Реабілітації" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium text-lg">Наша команда</p>
            </div>
            <div className="relative h-80 rounded-3xl overflow-hidden group">
              <Image src="/images/pro-nas/image1.webp" alt="Центральний вхід" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium">Центральний вхід</p>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group">
              <Image src="/images/pro-nas/image3.webp" alt="Дитячий майданчик" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium">Дитячий майданчик</p>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group">
              <Image src="/images/pro-nas/image4.webp" alt="Зал фізичної терапії" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium">Зал фізичної терапії</p>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group">
              <Image src="/images/pro-nas/image7.webp" alt="Акваріум" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 text-white font-medium">Улюбленці наших пацієнтів</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}