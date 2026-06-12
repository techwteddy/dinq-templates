"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

export default function ConsentCheckboxEn({ checked, onChange, required = true }: ConsentCheckboxProps) {
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
          I agree to the{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            className="inline text-left text-blue-600 dark:text-blue-400 hover:underline font-semibold focus:outline-none cursor-pointer"
          >
            processing of my personal data
          </button>{" "}
          in accordance with the legislation of Ukraine. *
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
                Consent to the Processing of Personal Data
              </h3>

              <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-650 dark:text-slate-300 overflow-y-auto flex-1 pr-2">
                <p>
                  By providing my personal data through online forms on the Center&apos;s website, I consent to the processing of my personal data and confirm that I am familiar with the purpose of personal data processing and the rights granted to me in accordance with Art. 8 of the Law of Ukraine &quot;On Protection of Personal Data&quot;.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  The purpose of processing the user&apos;s personal data is to ensure:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>receiving consultations regarding the user&apos;s request;</li>
                  <li>booking appointments and receiving child medical rehabilitation and palliative care services;</li>
                  <li>considering candidacy for vacant positions in the Center;</li>
                  <li>considering applications for volunteering.</li>
                </ul>
                <p>
                  <strong>Processing of personal data</strong> — any action or set of actions, such as collection, registration, accumulation, storage, adaptation, modification, renewal, use, and dissemination (distribution, realization, transfer), depersonalization, destruction of personal data, including with the use of information (automated) systems (Art. 2 of the Law of Ukraine «On Protection of Personal Data» of 01.06.2010 № 2297-VI).
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Rights of the subject of personal data in accordance with Art. 8 of the Law of Ukraine «On Protection of Personal Data» of 01.06.2010 № 2297-VI:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Personal non-proprietary rights to personal data, which every physical person possesses, are inalienable and inviolable.</li>
                  <li>
                    The subject of personal data has the right:
                    <ul className="list-disc pl-5 mt-1.5 space-y-1.5">
                      <li>to know about the sources of collection, location of their personal data, the purpose of their processing, location or place of residence (stay) of the owner or controller of personal data, or to give an appropriate instructions for obtaining this information to persons authorized by them, except in cases established by law;</li>
                      <li>to receive information about the conditions for providing access to personal data, in particular information about third parties to whom their personal data are transferred;</li>
                      <li>to access their personal data;</li>
                      <li>to receive, no later than thirty calendar days from the date of receipt of the request, except in cases provided by law, a response on whether their personal data are being processed, as well as to receive the content of such personal data;</li>
                      <li>to submit a reasoned request to the owner of personal data objecting to the processing of their personal data;</li>
                      <li>to submit a reasoned request for modification or destruction of their personal data by any owner and controller of personal data, if these data are processed illegally or are unreliable;</li>
                      <li>to protect their personal data from illegal processing and accidental loss, destruction, damage due to intentional concealment, failure to provide or untimely provision, as well as to protect against the provision of information that is unreliable or harms the honor, dignity, and business reputation of a physical person;</li>
                      <li>to appeal to the Commissioner for Human Rights of the Verkhovna Rada of Ukraine or to a court regarding the processing of their personal data;</li>
                      <li>to apply legal remedies in case of violation of legislation on personal data protection;</li>
                      <li>to enter reservations regarding the limitation of the right to process their personal data when giving consent;</li>
                      <li>to withdraw consent to the processing of personal data;</li>
                      <li>to know the mechanism of automatic processing of personal data;</li>
                      <li>to be protected against an automated decision that has legal consequences for them.</li>
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
                  Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
