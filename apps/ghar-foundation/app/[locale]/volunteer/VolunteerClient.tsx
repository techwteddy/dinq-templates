"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Globe, Users, MapPin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useTranslations, useLocale } from "next-intl";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const specialties = [
  "Medical / Healthcare", "Education / Teaching", "Engineering / Technical",
  "Legal / Compliance", "Finance / Accounting", "Marketing / Communications",
  "Logistics / Operations", "Social Work / Counseling", "Translation / Languages",
  "IT / Software Development", "Other",
];

const availabilities = [
  "Full-time (on-site)", "Part-time (on-site)", "Remote only", "Weekends only", "Flexible",
];

type Job = {
  id: string;
  title: string;
  titleAr: string;
  titleDe: string;
  desc: string;
  descAr: string;
  descDe: string;
  type: string;
  location: string;
};

const typeColors: Record<string, string> = {
  'full-time': 'bg-primary/10 text-primary',
  'part-time': 'bg-accent/10 text-accent',
  'volunteer': 'bg-secondary/10 text-secondary',
};

const typeLabels: Record<string, Record<string, string>> = {
  'full-time': { en: 'Full-time', ar: 'دوام كامل', de: 'Vollzeit' },
  'part-time': { en: 'Part-time', ar: 'دوام جزئي', de: 'Teilzeit' },
  'volunteer': { en: 'Volunteer', ar: 'تطوع', de: 'Freiwillig' },
};

export default function VolunteerClient({ jobs }: { jobs: Job[] }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", country: "", specialty: "", availability: "", message: "", linkedin_url: "" });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = useTranslations("volunteer");
  const locale = useLocale();

  const reasons = [
    { icon: <Heart size={28} className="text-primary" />, title: t("reason1Title"), desc: t("reason1Desc") },
    { icon: <Globe size={28} className="text-primary" />, title: t("reason2Title"), desc: t("reason2Desc") },
    { icon: <Users size={28} className="text-primary" />, title: t("reason3Title"), desc: t("reason3Desc") },
  ];

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.country || !form.specialty || !form.availability) return;
    setStatus("loading");

    let cv_url = "";

    if (cvFile) {
      const fileExt = cvFile.name.split(".").pop();
      const fileName = `${Date.now()}-${form.email}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("volunteer-cvs")
        .upload(fileName, cvFile);
      if (!uploadError) {
        const { data } = supabase.storage.from("volunteer-cvs").getPublicUrl(fileName);
        cv_url = data.publicUrl;
      }
    }

    const { error } = await supabase.from("volunteers").insert([{
      ...form,
      cv_url,
      status: "pending",
    }]);

    if (error) { setStatus("error"); return; }

    await fetch("/api/send-volunteer-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email }),
    });

    setStatus("success");
    setForm({ name: "", phone: "", email: "", country: "", specialty: "", availability: "", message: "", linkedin_url: "" });
    setCvFile(null);
  };

  const getTitle = (job: Job) => locale === "ar" ? job.titleAr : locale === "de" ? job.titleDe : job.title;
  const getDesc = (job: Job) => locale === "ar" ? job.descAr : locale === "de" ? job.descDe : job.desc;

  return (
    <>
      {/* Why Volunteer */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-dark mb-10 text-center">{t("whyTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="mb-4">{reason.icon}</div>
              <h3 className="text-dark font-bold text-lg mb-2">{reason.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer Form */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark mb-2 text-center">{t("formTitle")}</h2>
          <p className="text-gray-500 text-center mb-10">{t("formSubtitle")}</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder={t("namePlaceholder")} value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
                <input type="tel" placeholder={t("phonePlaceholder")} value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
              </div>
              <input type="email" placeholder={t("emailPlaceholder")} value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder={t("countryPlaceholder")} value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
              <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors">
                <option value="">{t("specialtyPlaceholder")}</option>
                {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors">
                <option value="">{t("availabilityPlaceholder")}</option>
                {availabilities.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <textarea placeholder={t("messagePlaceholder")} rows={4} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors resize-none" />
              <input
                type="url"
                placeholder={locale === "ar" ? "رابط LinkedIn أو Xing (اختياري)" : locale === "de" ? "LinkedIn oder Xing Profil (optional)" : "LinkedIn or Xing Profile URL (optional)"}
                value={form.linkedin_url}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
              />
              <div className="border border-gray-200 rounded-lg px-4 py-3">
                <label className="text-sm text-gray-500 block mb-2">
                  {locale === "ar" ? "السيرة الذاتية PDF (اختياري)" : locale === "de" ? "Lebenslauf PDF (optional)" : "CV / Resume PDF (optional)"}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-600 w-full"
                />
                {cvFile && <p className="text-xs text-secondary mt-1">✅ {cvFile.name}</p>}
              </div>
              {status === "success" && <p className="text-secondary text-sm text-center">{t("successMessage")}</p>}
              {status === "error" && <p className="text-red-500 text-sm text-center">{t("errorMessage")}</p>}
              <button onClick={handleSubmit}
                disabled={status === "loading" || !form.name || !form.email || !form.country || !form.specialty || !form.availability}
                className="bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {status === "loading" ? t("submitting") : t("submitApplication")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      {jobs.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-dark mb-10 text-center">{t("openPositions")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-dark font-bold text-lg">{getTitle(job)}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${typeColors[job.type] || 'bg-gray-100 text-gray-500'}`}>
                    {typeLabels[job.type]?.[locale] || job.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                  <MapPin size={12} />
                  <span>{job.location}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{getDesc(job)}</p>
                <Link href={`/${locale}/jobs/${job.id}`} className="text-primary text-sm font-medium hover:underline">
                  {t("applyNow")} →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/80 mb-8 text-lg">{t("ctaSubtitle")}</p>
          <Link href={`/${locale}/donate`} className="bg-secondary hover:bg-green-700 text-white px-12 py-3 rounded font-semibold text-lg transition-colors">
            {t("donateNow")}
          </Link>
        </div>
      </section>
    </>
  );
}