"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { motion, Variants } from "framer-motion";
import { MapPin, PhoneCall, Mail, Clock, Send, CheckCircle2, Loader2, Accessibility, Bus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import GoogleMap from "@/app/components/GoogleMap";
import Input from "@/app/components/core/Input";
import Textarea from "@/app/components/core/Textarea";
import ConsentCheckbox from "@/app/components/core/ConsentCheckbox";

function ContactsContent() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeForm, setActiveForm] = useState<'appointment' | 'feedback'>('appointment');

  // Стан для наявності електронного направлення
  const [hasReferral, setHasReferral] = useState<"yes" | "no" | "">("");
  const [consent, setConsent] = useState(false);

  interface SelectedService {
    code: string;
    name: string;
    price: string;
    quantity: number;
  }
  const [preselectedServices, setPreselectedServices] = useState<SelectedService[]>([]);

  // Стан для пре-філінгу результатів скринінгу
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Зчитування результатів скринінгу з URL параметрів
  useEffect(() => {
    const careType = searchParams.get("careType");
    const referral = searchParams.get("referral");
    const symptoms = searchParams.get("symptoms")?.split(",") || [];
    const needs = searchParams.get("needs");

    if (careType || referral || symptoms.length > 0 || needs) {
      // 1. Автоматично підбираємо тип направлення
      if (referral === "yes") {
        setHasReferral("yes");
      } else if (referral === "no_idea" || referral === "no") {
        setHasReferral("no");
      }

      // 2. Автоматично відмічаємо необхідних спеціалістів
      const docs: string[] = ["Лікар ФРМ"];
      if (careType === "palliative") {
        docs.push("Психолог");
        if (symptoms.includes("pain")) {
          docs.push("Невролог дитячий");
        }
      }
      if (needs === "child_neuro") {
        docs.push("Невролог дитячий", "Логопед/дефектолог", "Психолог");
      }
      if (symptoms.includes("mobility")) {
        docs.push("Фізичний терапевт", "Ерготерапевт");
      }
      if (symptoms.includes("care")) {
        docs.push("Ерготерапевт");
      }
      if (symptoms.includes("exhaustion")) {
        docs.push("Психолог");
      }
      setSelectedDocs(Array.from(new Set(docs)));

      // 3. Формуємо діагноз та додатковий опис
      if (careType === "palliative") {
        setDiagnosis("Паліативний статус (потребує симптоматичної опіки)");
      } else if (careType === "child_rehab") {
        if (needs === "child_neuro") {
          setDiagnosis("Неврологічні розлади / ДЦП");
        } else if (needs === "rehab_injury") {
          setDiagnosis("Наслідки травми чи операції");
        }
      }

      let info = "Результати первинного скринінгу на сайті:\n";
      if (careType === "palliative") {
        info += "- Рекомендовано: Паліативна медична допомога дітям\n";
      } else if (careType === "child_rehab") {
        info += "- Рекомендовано: Комплексна дитяча реабілітація\n";
      } else {
        info += "- Рекомендовано: Консультація лікаря ФРМ\n";
      }

      const symptomsMap: Record<string, string> = {
        pain: "Біль",
        care: "Потреба у догляді",
        dysphagia: "Порушення ковтання/дихання",
        mobility: "Обмежена мобільність",
        exhaustion: "Високий стрес у родині"
      };
      const activeSymptoms = symptoms.map(s => symptomsMap[s]).filter(Boolean);
      if (activeSymptoms.length > 0) {
        info += `- Виявлені особливості: ${activeSymptoms.join(", ")}`;
      }
      setAdditionalInfo(info);
    }
  }, [searchParams]);

  // Зчитування обраних платних послуг з localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("selected_services");
      if (saved) {
        const services = JSON.parse(saved);
        if (Array.isArray(services) && services.length > 0) {
          setPreselectedServices(services);
        }
        localStorage.removeItem("selected_services");
      }
    } catch (e) {
      console.error("Помилка зчитування обраних послуг:", e);
    }
  }, []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // МАГІЯ WEB3FORMS: Тиха та безпечна відправка без перезавантаження
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string | FormDataEntryValue[]> = {};

    // 1. Збираємо дані форми
    formData.forEach((value, key) => {
      if (key.endsWith('[]')) {
        const cleanKey = key.replace('[]', '');
        if (!data[cleanKey]) {
          data[cleanKey] = [];
        }
        (data[cleanKey] as FormDataEntryValue[]).push(value);
      } else {
        data[key] = value.toString();
      }
    });

    // 2. Об'єднуємо масиви (наприклад, обраних лікарів) через кому
    Object.keys(data).forEach((key) => {
      const val = data[key];
      if (Array.isArray(val)) {
        data[key] = val.join(', ');
      }
    });

    try {
      // 3. Відправляємо на наш власний безпечний API маршрут
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true); // Показуємо повідомлення про успіх
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

      <main className="py-16 md:py-24 relative z-10 max-w-7xl mx-auto px-6">
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
            Зв&apos;яжіться з <span className="text-blue-600 dark:text-blue-400">нами</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Ми завжди готові відповісти на ваші запитання, надати консультацію або допомогти з оформленням документів для реабілітації вашої дитини.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* ІНФОРМАЦІЯ ТА КАРТА */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-5 space-y-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Наші контакти</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Адреса</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">м. Житомир, вул. Корабельна, 8</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Телефон</p>
                    <a href="tel:+380674572828" className="text-slate-600 dark:text-slate-400 text-sm mt-1 hover:text-emerald-600 transition-colors block">(067) 457-28-28</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                    <a href="mailto:baby_house@ukr.net" className="text-slate-600 dark:text-slate-400 text-sm mt-1 hover:text-amber-600 transition-colors block">baby_house@ukr.net</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Графік роботи</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Пн-Пт: 08:00 - 17:30<br/>Сб-Нд: Вихідні (стаціонар цілодобово)</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Доступність та Громадський транспорт */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Accessibility className="text-blue-600 dark:text-blue-400" size={24} />
                  Доступність та безбар&apos;єрність
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Пандус / безбар&apos;єрний вхід:</strong> вільний доступ до будівлі для осіб з інвалідністю та дитячих візочків.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Вбиральня для дітей на кріслах колісних:</strong> спеціально обладнана та адаптована санітарна кімната.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Тактильна плитка:</strong> укладена в центрі для безпечного та зручного орієнтування осіб з порушеннями зору.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Шрифт Брайля:</strong> всі кабінети та вказівники продубльовані табличками зі шрифтом Брайля для незрячих пацієнтів.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Мова жестів:</strong> укладено договір з перекладачами мовою жестів для безперешкодного спілкування та обслуговування глухих пацієнтів.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Інклюзивність сайту:</strong> для зручності користувачів на сайті встановлено меню доступності (іконка ока праворуч), яке дозволяє налаштовувати розмір тексту, змінювати стиль шрифту на Arial, застосовувати колірні фільтри (чорно-білий, контрастний, інверсія) та вимикати анімації.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Безкоштовна парковка:</strong> облаштована паркувальна зона безпосередньо біля входу до закладу.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Bus className="text-blue-600 dark:text-blue-400" size={24} />
                  Громадський транспорт
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 shrink-0 font-bold">🚍</span>
                    <span><strong>Маршрутка №33:</strong> зупинка «Центр реабілітації» розташована безпосередньо навпроти центру.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 shrink-0 font-bold">🚎</span>
                    <span><strong>Тролейбуси №2, 3, 4, 10:</strong> кінцева зупинка тролейбусів у напрямку Богунії знаходиться трохи далі (кілька хвилин пішки).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Міні-карта */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800">
              <GoogleMap lang="uk" />
            </div>
          </motion.div>

          {/* ФОРМА ЗВОРОТНОГО ЗВ'ЯЗКУ */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-7">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 md:p-12 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-bl-full -z-10 pointer-events-none"></div>
              
              {isSubmitted ? (
                // СТАН УСПІШНОЇ ВІДПРАВКИ
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                    {activeForm === 'appointment' ? 'Анкету успішно відправлено!' : 'Відгук успішно відправлено!'}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                    {activeForm === 'appointment' 
                      ? 'Дякуємо за звернення. Наш адміністратор зв\'яжеться з вами найближчим часом для узгодження всіх деталей.'
                      : 'Дякуємо за ваш відгук! Ваша думка дуже важлива для нас.'}
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    {activeForm === 'appointment' ? 'Відправити ще одну анкету' : 'Надіслати ще один відгук'}
                  </button>
                </motion.div>
              ) : (
                // ФОРМИ
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        {activeForm === 'appointment' ? 'Запис на реабілітацію' : 'Залишити відгук'}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        {activeForm === 'appointment' 
                          ? 'Заповніть анкету, і наш адміністратор зв\'яжеться з вами для узгодження візиту.'
                          : 'Поділіться своїми враженнями від нашого центру.'}
                      </p>
                    </div>

                    {/* Перемикач */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 w-fit shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveForm('appointment')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                          activeForm === 'appointment'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Запис
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm('feedback')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                          activeForm === 'feedback'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Відгук
                      </button>
                    </div>
                  </div>
                  
                  {activeForm === 'appointment' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="Тип_форми" value="Запис на реабілітацію" />
                    {/* 🛡️ HONEYPOT (Пастка для спам-ботів) */}
                    <input type="text" name="bot_check" className="hidden" autoComplete="off" tabIndex={-1} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="ПІБ пацієнта *" type="text" name="ПІБ_пацієнта" required placeholder="Іваненко Іван Іванович" />
                      <Input
                        label="Дата народження *"
                        type="text" 
                        name="Дата_народження" 
                        required 
                        pattern="\d{2}\.\d{2}\.\d{4}"
                        title="Будь ласка, введіть дату у форматі ДД.ММ.РРРР (наприклад, 15.03.2020)"
                        placeholder="ДД.ММ.РРРР" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Телефон для зв'язку *" type="tel" name="Телефон" required placeholder="+38 (000) 000-00-00" />
                      <Input label="Електронна пошта (за бажанням)" type="email" name="Email" placeholder="mail@example.com" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Чи є у вас електронне направлення від лікаря? *
                        </label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 w-full sm:w-fit border border-slate-200/50 dark:border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => setHasReferral("yes")}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                              hasReferral === "yes"
                                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Так, є
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasReferral("no")}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                              hasReferral === "no"
                                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Ні, немає
                          </button>
                        </div>
                        <input type="hidden" name="Направлення" value={hasReferral === "yes" ? "Так" : hasReferral === "no" ? "Ні" : "Не вказано"} />
                      </div>

                      {hasReferral === "yes" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4"
                        >
                          <Input
                            label="Номер електронного направлення *"
                            type="text"
                            name="Номер_направлення"
                            required
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Обрані платні послуги */}
                    {preselectedServices.length > 0 && (
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-3">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Обрані послуги:</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {preselectedServices.map((service, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-700 dark:text-slate-300 font-medium">
                                {service.name} <span className="text-slate-400">({service.code})</span> x{service.quantity}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {parseInt(service.price.replace(/[^\d]/g, "")) * service.quantity} ₴
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-sm font-bold text-slate-900 dark:text-white">
                          <span>Загальна сума:</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            {preselectedServices.reduce((sum, s) => sum + parseInt(s.price.replace(/[^\d]/g, "")) * s.quantity, 0)} ₴
                          </span>
                        </div>
                        <input 
                          type="hidden" 
                          name="Обрані_платні_послуги" 
                          value={preselectedServices.map(s => `${s.name} (${s.code}) x${s.quantity} - ${parseInt(s.price.replace(/[^\d]/g, "")) * s.quantity} грн`).join("; ")} 
                        />
                      </div>
                    )}

                    <Input label="Місто проживання *" type="text" name="Адреса" required placeholder="Наприклад: Житомир" />

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Потреба в консультації спеціалістів:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        {[
                          "Лікар ФРМ", "Фізичний терапевт", "Ерготерапевт", 
                          "Логопед/дефектолог", "Психолог", "Невролог", 
                          "Терапевт", "Ортопед-травматолог"
                        ].map((doc) => (
                          <label key={doc} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              name="Потрібна_консультація[]" 
                              value={doc} 
                              checked={selectedDocs.includes(doc)}
                              onChange={() => {
                                setSelectedDocs(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]);
                              }}
                              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc}</span>
                          </label>
                        ))}
                        <div className="sm:col-span-2 mt-2">
                           <input type="text" name="Консультація_Інше" className="w-full px-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400" placeholder="Інше (вкажіть спеціаліста)..." />
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Діагноз (за бажанням)"
                      type="text" 
                      name="Діагноз" 
                      value={diagnosis} 
                      onChange={(e) => setDiagnosis(e.target.value)} 
                      placeholder="Вкажіть діагноз..." 
                    />

                    <Textarea
                      label="Додаткова інформація"
                      name="Додаткова_інформація" 
                      value={additionalInfo} 
                      onChange={(e) => setAdditionalInfo(e.target.value)} 
                      rows={3} 
                      placeholder="Додайте будь-яку інформацію, яку вважаєте важливою..."
                    />

                    <ConsentCheckbox checked={consent} onChange={setConsent} />

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group mt-8 cursor-pointer"
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
                  ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="Тип_форми" value="Відгук" />
                    {/* 🛡️ HONEYPOT */}
                    <input type="text" name="bot_check" className="hidden" autoComplete="off" tabIndex={-1} />

                    <Textarea label="Ваш відгук *" name="Відгук" required rows={5} placeholder="Поділіться вашими враженнями..." />

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group mt-8"
                    >
                      {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Надіслати відгук
                        </>
                      )}
                    </button>
                  </form>
                  )}
                </>
              )}

            </div>
          </motion.div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={32} />
      </div>
    }>
      <ContactsContent />
    </Suspense>
  );
}