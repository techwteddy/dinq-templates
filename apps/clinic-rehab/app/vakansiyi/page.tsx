"use client";

import { useState, FormEvent } from "react";
import { motion, Variants } from "framer-motion";
import { Briefcase, Send, CheckCircle2, Loader2, Search } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ConsentCheckbox from "@/app/components/core/ConsentCheckbox";
import Input from "@/app/components/core/Input";

import { activeVacancies } from "@/app/data/vacancies";

export default function VacancyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [experience, setExperience] = useState("");
  const [consent, setConsent] = useState(false);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, FormDataEntryValue> = {};

    data["ТИП_АНКЕТИ"] = "💼 КАНДИДАТ НА РОБОТУ";

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setConsent(false);
      } else {
        alert("Сталася помилка при відправці. Спробуйте ще раз.");
      }
    } catch {
      alert("Помилка з'єднання. Перевірте підключення до інтернету.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <Header />

      <main className="py-16 md:py-24 relative z-10 max-w-4xl mx-auto px-6">
        
        {/* ШАПКА */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Робота у <span className="text-blue-600 dark:text-blue-400">Вітрилах Життя</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Заповніть анкету кандидата, і ми обов&apos;язково розглянемо вашу кандидатуру!
          </p>
        </motion.div>

        {/* НОВИЙ БЛОК: АКТИВНІ ВАКАНСІЇ */}
        {!isSubmitted && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="mb-10">
            <div className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-100 dark:border-blue-800/50 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-slate-900 dark:text-white">
                <Search size={22} className="text-blue-600 dark:text-blue-400" />
                Зараз ми активно шукаємо:
              </h2>
              <div className="flex flex-wrap gap-3">
                {activeVacancies.map((vacancy, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
                  >
                    {vacancy}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-blue-200/50 dark:border-blue-800/50 pt-4">
                Не знайшли свою спеціальність у списку, але маєте бажання працювати та розвиватися разом із нами? <strong>Все одно заповнюйте анкету!</strong> Ми завжди раді талановитим фахівцям і формуємо кадровий резерв.
              </p>
            </div>
          </motion.div>
        )}

        {/* ФОРМА */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 md:p-12 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Анкету успішно відправлено!</h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                  Дякуємо за інтерес до нашого центру. Керівництво розгляне вашу анкету і зв&apos;яжеться з вами.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)} 
                  className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Заповнити ще одну анкету
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* 🛡️ HONEYPOT (Пастка для спам-ботів) */}
                <input type="text" name="bot_check" className="hidden" autoComplete="off" tabIndex={-1} />

                {/* ПІБ */}
                <Input label="Ваше ПІБ *" type="text" name="ПІБ" required placeholder="Іваненко Іван Іванович" />

                {/* Освіта */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Маєте вищу медичну освіту? *</label>
                  <div className="flex gap-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="Вища_медична_освіта" value="Так" required className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200 font-medium">Так</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="Вища_медична_освіта" value="Ні" required className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200 font-medium">Ні</span>
                    </label>
                  </div>
                </div>

                {/* Спеціальність */}
                <Input label="Спеціальність *" type="text" name="Спеціальність" required placeholder="Наприклад: Фізичний терапевт, Педіатр..." />

                {/* Досвід */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Досвід в медичній сфері *</label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="Досвід" value="Більше 2х років" required onChange={(e) => setExperience(e.target.value)} className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200">Більше 2х років</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="Досвід" value="До 2х років" required onChange={(e) => setExperience(e.target.value)} className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200">До 2х років</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="Досвід" value="Немає досвіду, але маю бажання навчатися" required onChange={(e) => setExperience(e.target.value)} className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200">Немає досвіду, але маю бажання навчатися</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="Досвід" value="Інше" required onChange={(e) => setExperience(e.target.value)} className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200 font-medium">Інше</span>
                    </label>
                  </div>
                  
                  {experience === "Інше" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                      <Input type="text" name="Досвід_Інше" required placeholder="Вкажіть ваш варіант..." />
                    </motion.div>
                  )}
                </div>

                {/* Контакти */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Input label="Телефон для контактів *" type="tel" name="Телефон" required placeholder="+38 (000) 000-00-00" />
                  <Input label="Ваш Email (необов'язково)" type="email" name="Email" placeholder="mail@example.com" />
                </div>

                <ConsentCheckbox checked={consent} onChange={setConsent} />

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Відправити анкету
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}