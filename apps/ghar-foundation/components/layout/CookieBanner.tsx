"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

const content = {
  en: {
    message: "We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies.",
    accept: "Accept All",
    decline: "Decline",
    learnMore: "Privacy Policy",
  },
  ar: {
    message: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. بمواصلة التصفح، فإنك توافق على استخدامنا لملفات تعريف الارتباط.",
    accept: "قبول الكل",
    decline: "رفض",
    learnMore: "سياسة الخصوصية",
  },
  de: {
    message: "Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Durch weiteres Surfen stimmen Sie der Verwendung von Cookies zu.",
    accept: "Alle akzeptieren",
    decline: "Ablehnen",
    learnMore: "Datenschutzrichtlinie",
  },
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
        setTimeout(() => setVisible(true), 0);
    }
    }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark text-white px-4 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
          {t.message}{" "}
          <Link href={`/${locale}/privacy`} className="text-accent hover:underline font-medium">
            {t.learnMore}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-5 py-2 rounded-lg border border-white/30 text-white/70 hover:text-white text-sm transition-colors"
          >
            {t.decline}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-lg bg-secondary hover:bg-green-700 text-white text-sm font-semibold transition-colors"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}