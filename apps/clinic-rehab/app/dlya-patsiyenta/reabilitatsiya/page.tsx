"use client";

import { motion, Variants } from "framer-motion";
import { Quote, CheckCircle2, Activity, Brain, Users, BookOpen } from "lucide-react";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function RehabilitationArticlePage() {
  
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН ІЗ СІТКОЮ ТА СВІТІННЯМ */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <Header />

      <main className="py-16 md:py-24 relative z-10">
        <article className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4 block">
              Слово керівника
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.15]">
              Дитяча реабілітація: <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Інвестиція в майбутнє
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                <Image src="/images/shevckenko.webp" alt="Тетяна Шевченко" fill className="object-cover" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">Тетяна Шевченко</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">В.о. директора, дитячий психіатр, дитячий невролог</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-8">
            
            <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-10">
              Дитяча реабілітація – це комплекс медичних, психологічних, педагогічних та соціальних заходів, спрямованих на відновлення або розвиток втрачених чи ще не сформованих функцій у дітей. Її головне завдання - допомогти дитині максимально реалізувати свій потенціал, підготуватись до навчання, соціалізації та самостійного життя.
            </p>

            {/* Замінили фони на напівпрозорі, щоб сітка просвічувалась */}
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-800 my-12 shadow-sm">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Виклики сьогодення</h3>
                <p>
                  В Україні ця тема набуває особливої актуальності. За даними ЮНІСЕФ, близько 1,5 млн. дітей в Україні мають ризик розвитку проблем психічного здоров’я, таких як депресія, тривожність та ПТСР. Крім того, щороку тисячі дітей народжуються із вродженими захворюваннями чи отримують травми, що потребують довготривалої підтримки.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white">Основні групи ризику:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} /> <span>Діти з інвалідністю (руховою, сенсорною, інтелектуальною).</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} /> <span>Діти після важких захворювань чи травм.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} /> <span>Діти з розладами спектра аутизму та гіперактивністю.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} /> <span>Діти, які зазнали психологічних травм.</span></li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">Статистика та проблема ДЦП</h2>
            <p>
              В структурі інвалідності дитячого населення Житомирської області розлади психіки та поведінки займають ІІ рейтингове місце (20,8%), це 1260 дітей. На третьому місці хвороби центральної нервової системи – 792 дитини (13,1%). Кількість дітей з інвалідністю щорічно зростає.
            </p>
            <p>
              Дитячий церебральний параліч (ДЦП) є найпоширенішою причиною інвалідності. Показники в Україні (2,11 на 1000) та Житомирській області (2,09 на 1000) залишаються стабільними, проте спостерігається їх різке зростання у дітей з дуже низькою масою тіла при народженні.
            </p>

            <div className="my-12">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">5 категорій факторів ризику ДЦП:</h3>
              <div className="space-y-4">
                {[
                  { title: "Передзачаття", desc: "Епілептичні судоми у матері, захворювання щитоподібної залози, вік понад 40 років тощо." },
                  { title: "Допологовий період", desc: "Вроджені дефекти, низька маса тіла при народженні, захворювання матері (респіраторні, серцеві), прееклампсія." },
                  { title: "Під час пологів", desc: "Пологова гіпоксія, аспірація меконію, аномальна тривалість пологів." },
                  { title: "Неонатальний період", desc: "Судоми, респіраторний дистрес, гіпоглікемія, інфекції та жовтяниця." },
                  { title: "Після пологів", desc: "Інсульт, травма голови, бактеріальний менінгіт, ДТП." }
                ].map((factor, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{factor.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{factor.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p>
              Робота Мольнара в 1970-х роках заклала основу розуміння: якщо дитина здатна самостійно сидіти у віці до 2-х років — це позитивний прогноз для пересування. Для лікування потрібна <strong>мультидисциплінарна команда</strong>. Важливо, щоб сім’я і дитина були активними членами команди у процесі встановлення цілей. Кінцевою метою є сприяння максимальному розвитку потенціалу дитини в моторній, когнітивній та соціальній сферах.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-16 mb-8">Напрями дитячої реабілітації</h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <Activity className="text-blue-500 mb-4" size={32} />
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Медична реабілітація</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Фізіотерапія, лікувальна фізкультура, ерготерапія, логопедичні заняття.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <Brain className="text-amber-500 mb-4" size={32} />
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Психологічна підтримка</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Індивідуальні та групові консультації, арт-терапія, казкотерапія, робота з травмою.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <Users className="text-emerald-500 mb-4" size={32} />
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Соціальна адаптація</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Інтеграція в освітній простір, розвиток комунікативних навичок, інклюзія.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <BookOpen className="text-purple-500 mb-4" size={32} />
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Освітня допомога</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Корекційно-розвивальні заняття, підтримка сімей, раннє втручання.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">Майбутнє: Створення Child Центру</h2>
            <p>
              Наразі в Житомирській області проводиться ряд заходів щодо створення сучасного клієнтоорієнтованого, сімейно-центричного <strong>Child Центру</strong>. Він стане правонаступником обласного будинку дитини, де ще в 1996 році (під керівництвом С.В. Урсуленко) вперше в Україні було впроваджено ранню медико-соціальну реабілітацію.
            </p>
            <p>
              В планах: будівництво стаціонарного басейну зі стельовою підвісною системою, створення кабінету гідрокінезотерапії, будівництво арт-студії та спортивного майданчика для альтернативних видів спорту. За підтримки ОДА йде активний пошук фінансування.
            </p>

            <blockquote className="mt-16 p-8 md:p-12 bg-blue-600 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
              <Quote className="absolute top-4 right-4 text-blue-500 opacity-50 rotate-180" size={120} />
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-semibold leading-snug mb-8">
                  "Дитяча реабілітація в Україні сьогодні – це не лише медичне питання, а й стратегічне завдання для суспільства. Підтримка кожної дитини означає інвестицію в майбутнє країни."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur overflow-hidden relative border border-white/30">
                    <Image src="/images/shevckenko.webp" alt="Тетяна Шевченко" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Тетяна Шевченко</p>
                    <p className="text-blue-200 text-sm">В.о. директора Центру</p>
                  </div>
                </div>
              </div>
            </blockquote>

          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}