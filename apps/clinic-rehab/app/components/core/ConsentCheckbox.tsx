"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

export default function ConsentCheckbox({ checked, onChange, required = true }: ConsentCheckboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 mt-4 select-none text-left">
      <label className="flex items-start gap-3 cursor-pointer group text-left">
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            type="checkbox"
            required={required}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer appearance-none w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 checked:border-blue-500 checked:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all"
          />
          <svg
            className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm text-left text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          Я погоджуюся на{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            className="inline text-left text-blue-600 dark:text-blue-400 hover:underline font-semibold focus:outline-none cursor-pointer"
          >
            обробку моїх персональних даних
          </button>{" "}
          відповідно до законодавства України. *
        </span>
      </label>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl max-h-[85vh] md:max-h-[80vh] flex flex-col overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-slate-850 dark:text-slate-200"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl md:text-2xl font-bold mb-6 text-slate-900 dark:text-white pr-8 flex-shrink-0">
                Згода на обробку персональних даних
              </h3>

              <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-650 dark:text-slate-300 overflow-y-auto flex-1 pr-2">
                <p>
                  Надаючи свої персональні дані за допомогою онлайн форм на сайті Центру, я надаю згоду на обробку своїх персональних даних та підтверджую те, що ознайомлений (а) з метою обробки персональних даних та правами, наданими мені згідно ст. 8 Закону України &quot;Про захист персональних даних&quot;.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Метою обробки персональних даних користувача є забезпечення можливості:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>отримання консультацій щодо запиту користувача;</li>
                  <li>запису на прийом та отримання медичних послуг реабілітації та паліативної допомоги;</li>
                  <li>розгляду кандидатури на вакантні посади в Центрі;</li>
                  <li>розгляду заяви про волонтерську діяльність.</li>
                </ul>
                <p>
                  <strong>Обробка персональних даних</strong> — будь-яка дія або сукупність дій, таких як збирання, реєстрація, накопичення, зберігання, адаптування, зміна, поновлення, використання і поширення (розповсюдження, реалізація, передача), знеособлення, знищення персональних даних, у тому числі з використанням інформаційних (автоматизованих) систем (ст. 2 Закону України «Про захист персональних даних» від 01.06.2010 року № 2297-VI).
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Права суб’єкта персональних даних відповідно до ст. 8 Закону України «Про захист персональних даних» від 01.06.2010 року № 2297-VI:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Особисті немайнові права на персональні дані, які має кожна фізична особа, є невід&apos;ємними і непорушними.</li>
                  <li>
                    Суб&apos;єкт персональних даних має право:
                    <ul className="list-disc pl-5 mt-1.5 space-y-1.5">
                      <li>знати про джерела збирання, местознаходження своїх персональних даних, мету їх обробки, місцезнаходження або місце проживання (перебування) власника чи розпорядника персональних даних або дати відповідне доручення щодо отримання цієї інформації уповноваженим ним особам, крім випадків, встановлених законом;</li>
                      <li>отримувати інформацію про умови надання доступу до персональних даних, зокрема інформацію про третіх осіб, яким передаються його персональні дані;</li>
                      <li>на доступ до своїх персональних даних;</li>
                      <li>отримувати не пізніш як за тридцять календарних днів з дня надходження запиту, крім випадків, передбачених законом, відповідь про те, чи обробляються його персональні дані, а також отримувати зміст таких персональних даних;</li>
                      <li>пред&apos;являти вмотивовану вимогу власнику персональних даних із запереченням проти обробки своїх персональних даних;</li>
                      <li>пред&apos;являти вмотивовану вимогу щодо зміни або знищення своїх персональних даних будь-яким власником та розпорядником персональних даних, якщо ці дані обробляються незаконно чи є недостовірними;</li>
                      <li>на захист своїх персональних даних від незаконної обробки та випадкової втрати, знищення, пошкодження у зв&apos;язку з умисним приховуванням, ненаданням чи несвоєчасним їх наданням, а також на захист від надання відомостей, що є недостовірними чи ганьблять честь, гідність та ділову репутацію фізичної особи;</li>
                      <li>звертатися із скаргами на обробку своїх персональних даних до Уповноваженого Верховної Ради України з прав людини або до суду;</li>
                      <li>застосовувати засоби правового захисту в разі порушення законодавства про захист персональних даних;</li>
                      <li>вносити застереження стосовно обмеження права на обробку своїх персональних даних під час надання згоди;</li>
                      <li>відкликати згоду на обробку персональних даних;</li>
                      <li>знати механізм автоматичної обробки персональних даних;</li>
                      <li>на захист від автоматизованого рішення, яке має для нього правові наслідки.</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition cursor-pointer text-sm"
                >
                  Зрозуміло
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
