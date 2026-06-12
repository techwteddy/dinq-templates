"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, CheckCircle, Info, Stethoscope, BriefcaseMedical, 
  Download, ExternalLink, Scale, Users, TrendingUp, ShieldAlert, X, Maximize2 
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<"how-to" | "public-info" | "rights">("how-to");
  const [isStructureOpen, setIsStructureOpen] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const financialData = [
    { metric: "Дохід", y2020: "26 560 000 ₴", y2021: "23 905 500 ₴", y2022: "33 353 000 ₴", y2023: "38 790 700 ₴", y2024: "54 918 500 ₴", y2025: "40 846 000 ₴" },
    { metric: "Чистий прибуток", y2020: "117 000 ₴", y2021: "383 300 ₴", y2022: "-247 700 ₴", y2023: "1 215 700 ₴", y2024: "1 191 500 ₴", y2025: "-1 169 000 ₴" },
    { metric: "Активи", y2020: "11 115 500 ₴", y2021: "12 011 500 ₴", y2022: "18 288 900 ₴", y2023: "48 603 000 ₴", y2024: "46 476 200 ₴", y2025: "19 997 600 ₴" },
    { metric: "Зобов'язання", y2020: "—", y2021: "11 628 100 ₴", y2022: "18 153 200 ₴", y2023: "10 323 500 ₴", y2024: "6 830 500 ₴", y2025: "11 290 800 ₴" },
    { metric: "Працівники", y2020: "—", y2021: "126", y2022: "122", y2023: "145", y2024: "149", y2025: "109" },
  ];

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <Header />

      <main className="py-20 max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Документи та публічна інформація</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Ознайомтеся з порядком направлення, офіційними звітами та статутними документами нашого Центру.
          </p>
        </motion.div>

        {/* Вкладки (Tabs) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            onClick={() => setActiveTab("how-to")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all text-sm md:text-base cursor-pointer ${
              activeTab === "how-to"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            Як отримати послуги
          </button>
          <button
            onClick={() => setActiveTab("public-info")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all text-sm md:text-base cursor-pointer ${
              activeTab === "public-info"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            Публічна інформація та звітність
          </button>
          <button
            onClick={() => setActiveTab("rights")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all text-sm md:text-base cursor-pointer ${
              activeTab === "rights"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            Права та обов’язки пацієнта
          </button>
        </div>

        {/* Контент вкладок */}
        <AnimatePresence mode="wait">
          {activeTab === "how-to" && (
            <motion.div
              key="how-to"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              {/* ШЛЯХ 1: Постанова КМУ 309 */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                    <BriefcaseMedical size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Через Фонд соц. захисту</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">За Постановою КМУ № 309</p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 p-4 rounded-r-lg mb-8">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Для отримання скерування ці документи слід подати до місцевого органу Фонду соціального захисту інвалідів.
                  </p>
                </div>

                <ul className="space-y-5">
                  {[
                    "Заява від батьків або законних представників дитини.",
                    "Копія свідоцтва про народження дитини.",
                    "Документ, що підтверджує інвалідність дитини.",
                    "Посвідчення дитини з інвалідністю.",
                    "Індивідуальна програма реабілітації (ІПР) із зазначеними видами реабілітації.",
                    "Паспорт одного з батьків (законного представника) та ідентифікаційний код."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ШЛЯХ 2: Програма НСЗУ */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-xl shadow-blue-200/50 dark:shadow-none border border-blue-100 dark:border-blue-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10"></div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Електронне направлення</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">За пакетами НСЗУ (№25, №53, №54)</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm">1</span> 
                      Е-направлення від лікаря:
                    </h3>
                    <ul className="space-y-3 ml-8 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong className="text-slate-800 dark:text-slate-200">Пакет № 25:</strong> Педіатр, сімейний лікар, вузький спеціаліст.</li>
                      <li><strong className="text-slate-800 dark:text-slate-200">Пакет № 53 та № 54:</strong> Дитячий невролог, лікар ФРМ, дитячий ортопед-травматолог.</li>
                    </ul>
                    <p className="text-xs text-slate-500 mt-2 ml-8 flex items-center gap-1"><Info size={14}/> У направленні має бути діагноз та вид реабілітації.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm">2</span> 
                      Медична документація:
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 ml-2"><CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={18} /> <span className="text-slate-700 dark:text-slate-300">Виписка з історії розвитку дитини (анамнез, патології).</span></li>
                      <li className="flex items-start gap-3 ml-2"><CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={18} /> <span className="text-slate-700 dark:text-slate-300">Результати обстежень (МРТ, КТ, УЗД тощо).</span></li>
                      <li className="flex items-start gap-3 ml-2"><CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={18} /> <span className="text-slate-700 dark:text-slate-300">Дані про щеплення дитини.</span></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm">3</span> 
                      Особисті документи:
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 ml-2"><CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={18} /> <span className="text-slate-700 dark:text-slate-300">Свідоцтво про народження дитини.</span></li>
                      <li className="flex items-start gap-3 ml-2"><CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={18} /> <span className="text-slate-700 dark:text-slate-300">Паспорт одного з батьків та ідентифікаційний код.</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "public-info" && (
            <motion.div
              key="public-info"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Верхній блок: Установчі документи, ліцензія та Prozorro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Статут */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between shadow-md">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Статут Центру</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Офіційний статут Комунального некомерційного підприємства «Центр медичної реабілітації та паліативної допомоги дітям» Житомирської обласної ради.
                    </p>
                  </div>
                  <a
                    href="/documents/statut.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Download size={14} />
                    Читати STATUT.PDF
                  </a>
                </div>

                {/* Prozorro */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between shadow-md">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Державні закупівлі</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Звітність про проведення тендерів, договорів та державних закупівель Центру в електронній системі Prozorro (ЄДРПОУ 05503562).
                    </p>
                  </div>
                  <a
                    href="https://prozorro.gov.ua/uk/search/tender?buyer=05503562&sort=auto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Перейти на Prozorro
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Структура та власність */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between shadow-md">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Структура та власність</h3>
                    
                    {/* Зменшене прев'ю схеми */}
                    <div 
                      onClick={() => setIsStructureOpen(true)}
                      className="relative h-36 rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 cursor-pointer group"
                    >
                      <img 
                        src="/images/structure.png" 
                        alt="Організаційна структура" 
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2">
                        <Maximize2 size={20} className="transform scale-90 group-hover:scale-100 transition-transform duration-300" />
                        <span className="text-xs font-semibold">Збільшити</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Дії та код ЄДРПОУ */}
                  <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-3">
                    <a
                      href="/images/structure.png"
                      download="Structure_Sails_of_Life.png"
                      className="flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <Download size={12} />
                      Завантажити схему (PNG)
                    </a>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Код ЄДРПОУ: 05503562
                    </div>
                  </div>
                </div>
              </div>

              {/* Ліцензія */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Stethoscope className="text-blue-600 dark:text-blue-400" size={22} />
                    Ліцензія на медичну практику
                  </h3>
                  <a
                    href="/documents/medlicense.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition cursor-pointer shadow-md shadow-blue-600/10"
                  >
                    <ExternalLink size={14} />
                    Читати витяг з реєстру (PDF)
                  </a>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Рішення Міністерства охорони здоров&apos;я України про видачу копії ліцензії від <strong>17.08.2020 року</strong> (філія здійснює медичну практику на базі Центру за адресою: Житомирська обл., м. Житомир, вул. Корабельна, буд. 8).
                </p>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 block">
                    Дозволені види медичної діяльності:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      "Фізична та реабілітаційна медицина",
                      "Фізична терапія",
                      "Ерготерапія",
                      "Клінічна психологія",
                      "Дитяча неврологія",
                      "Дитяча ортопедія і травматологія",
                      "Дитяча психіатрія",
                      "Дитяча анестезіологія",
                      "Дитяча хірургія",
                      "Педіатрія",
                      "Організація і управління охороною здоров'я",
                      "Ультразвукова діагностика",
                      "Функціональна діагностика",
                      "Рентгенологія",
                      "Сестринська справа",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle size={14} className="text-blue-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 shadow-md overflow-hidden">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={22} />
                  Фінансові показники Центру
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Офіційна фінансова звітність підприємства за минулі періоди.
                </p>

                <div className="overflow-x-auto -mx-8 px-8">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                        <th className="py-3 pr-4 font-semibold">Показник</th>
                        <th className="py-3 px-4 font-semibold">2020</th>
                        <th className="py-3 px-4 font-semibold">2021</th>
                        <th className="py-3 px-4 font-semibold">2022</th>
                        <th className="py-3 px-4 font-semibold">2023</th>
                        <th className="py-3 px-4 font-semibold">2024</th>
                        <th className="py-3 pl-4 font-semibold">2025</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300 font-medium">
                      {financialData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                          <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white">{row.metric}</td>
                          <td className="py-3.5 px-4">{row.y2020}</td>
                          <td className="py-3.5 px-4">{row.y2021}</td>
                          <td className="py-3.5 px-4">{row.y2022}</td>
                          <td className="py-3.5 px-4">{row.y2023}</td>
                          <td className="py-3.5 px-4">{row.y2024}</td>
                          <td className="py-3.5 pl-4">{row.y2025}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "rights" && (
            <motion.div
              key="rights"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              {/* Права пацієнта */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200/60 dark:border-slate-800 shadow-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Scale size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Права дитини-пацієнта та батьків</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Згідно зі ст. 6, 8, 34 Закону України «Основи законодавства України про охорону здоров&apos;я» та Конвенції ООН про права дитини, пацієнти мають право на:
                </p>
                <ul className="space-y-4">
                  {[
                    "Отримання кваліфікованої, своєчасної та безпечної медичної реабілітації та паліативної допомоги.",
                    "Повагу до своєї гідності, гуманне і шанобливе ставлення з боку медичного та обслуговуючого персоналу.",
                    "Конфіденційність та нерозголошення медичної таємниці, інформації про факт звернення та стан здоров'я.",
                    "Отримання повної, доступної та достовірної інформації про стан здоров'я дитини, тактику реабілітації та очікувані результати (для батьків або законних представників).",
                    "Свідому та добровільну згоду на проведення медичних втручань або право на відмову від лікування / окремих процедур у будь-який момент."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                      <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Обов'язки пацієнта */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200/60 dark:border-slate-800 shadow-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldAlert size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Обов’язки батьків та представників</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Для забезпечення ефективності терапевтичного процесу батьки або представники пацієнта зобов&apos;язані:
                </p>
                <ul className="space-y-4">
                  {[
                    "Надавати медичним працівникам повну та достовірну інформацію про історію розвитку дитини, перенесені захворювання та алергічні реакції.",
                    "Дотримуватися індивідуального плану реабілітації та виконувати рекомендації фахівців щодо домашніх занять.",
                    "Дотримуватися графіка відвідування занять, завчасно (мінімум за добу) попереджати персонал про неможливість візиту.",
                    "Неухильно дотримуватися правил внутрішнього розпорядку та санітарно-гігієнічних вимог Центру.",
                    "З повагою ставитися до працівників Центру, а також до інших пацієнтів та їхніх законних представників."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                      <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Модальне вікно структури */}
      <AnimatePresence>
        {isStructureOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsStructureOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative border border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Організаційна структура Центру</h3>
                <div className="flex items-center gap-2">
                  <a
                    href="/images/structure.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    title="Відкрити в новій вкладці"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <a
                    href="/images/structure.png"
                    download="Structure_Sails_of_Life.png"
                    className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    title="Завантажити схему"
                  >
                    <Download size={20} />
                  </a>
                  <button
                    onClick={() => setIsStructureOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Image container */}
              <div className="flex-1 overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950 p-2 flex items-center justify-center border border-slate-100 dark:border-slate-800 relative">
                <a 
                  href="/images/structure.png" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer group"
                >
                  <img
                    src="/images/structure.png"
                    alt="Організаційна структура Центру"
                    className="max-w-full max-h-[60vh] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/60 text-white text-[11px] px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-1.5 text-center transition-all duration-300 group-hover:bg-slate-900/80">
                    <ExternalLink size={12} />
                    <span>Натисніть на схему, щоб відкрити у повному розмірі</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}