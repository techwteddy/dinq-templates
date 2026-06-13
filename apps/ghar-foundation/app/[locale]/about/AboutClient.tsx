"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Target, Heart, Shield, Award, Handshake, Star, Globe, Home, Leaf, Scale, Smile, Lightbulb, Users, Zap, Lock, ClipboardList } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useTranslations, useLocale } from "next-intl";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type TeamMember = {
  name: string;
  role: string;
  roleAr: string;
  roleDe: string;
  image: string;
};

type Partner = {
  name: string;
  image: string;
  website: string;
};

type AboutContent = {
  heroImage?: string;
  storyImage?: string;
  story1: string; story1Ar: string; story1De: string;
  story2: string; story2Ar: string; story2De: string;
  story3: string; story3Ar: string; story3De: string;
  mission: string; missionAr: string; missionDe: string;
  vision: string; visionAr: string; visionDe: string;
  values: Array<{
    icon: string;
    title: { en: string; ar: string; de: string };
    desc: { en: string; ar: string; de: string };
  }>;
};

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart size={28} className="text-primary" />,
  Shield: <Shield size={28} className="text-primary" />,
  Target: <Target size={28} className="text-primary" />,
  Award: <Award size={28} className="text-primary" />,
  Eye: <Eye size={28} className="text-primary" />,
  Handshake: <Handshake size={28} className="text-primary" />,
  Star: <Star size={28} className="text-primary" />,
  Globe: <Globe size={28} className="text-primary" />,
  Home: <Home size={28} className="text-primary" />,
  Leaf: <Leaf size={28} className="text-primary" />,
  Scale: <Scale size={28} className="text-primary" />,
  Smile: <Smile size={28} className="text-primary" />,
  Lightbulb: <Lightbulb size={28} className="text-primary" />,
  Users: <Users size={28} className="text-primary" />,
  Zap: <Zap size={28} className="text-primary" />,
  Lock: <Lock size={28} className="text-primary" />,
  ClipboardList: <ClipboardList size={28} className="text-primary" />,
};

export default function AboutClient({
  team,
  partners,
  aboutContent,
}: {
  team: TeamMember[];
  partners: Partner[];
  aboutContent: AboutContent | null;
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = useTranslations("about");
  const locale = useLocale();

  const getText = (en: string, ar: string, de: string) =>
    locale === "ar" ? ar : locale === "de" ? de : en;

  const values = aboutContent?.values?.map((v) => ({
    icon: iconMap[v.icon] || <Heart size={28} className="text-primary" />,
    title: getText(v.title.en, v.title.ar, v.title.de),
    desc: getText(v.desc.en, v.desc.ar, v.desc.de),
  })) || [
    { icon: <Heart size={28} className="text-primary" />, title: t("values.humanity.title"), desc: t("values.humanity.desc") },
    { icon: <Shield size={28} className="text-primary" />, title: t("values.transparency.title"), desc: t("values.transparency.desc") },
    { icon: <Target size={28} className="text-primary" />, title: t("values.impact.title"), desc: t("values.impact.desc") },
    { icon: <Award size={28} className="text-primary" />, title: t("values.accountability.title"), desc: t("values.accountability.desc") },
  ];

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    const { error } = await supabase.from("contact_messages").insert([form]);
    if (error) { setStatus("error"); return; }
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
  };

  const story1 = aboutContent ? getText(aboutContent.story1, aboutContent.story1Ar, aboutContent.story1De) : t("story1");
  const story2 = aboutContent ? getText(aboutContent.story2, aboutContent.story2Ar, aboutContent.story2De) : t("story2");
  const story3 = aboutContent ? getText(aboutContent.story3, aboutContent.story3Ar, aboutContent.story3De) : t("story3");
  const mission = aboutContent ? getText(aboutContent.mission, aboutContent.missionAr, aboutContent.missionDe) : t("missionDesc");
  const vision = aboutContent ? getText(aboutContent.vision, aboutContent.visionAr, aboutContent.visionDe) : t("visionDesc");

  return (
    <div className="bg-background">

      {/* Our Story */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-dark mb-6">{t("storyTitle")}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{story1}</p>
            <p className="text-gray-600 leading-relaxed mb-4">{story2}</p>
            <p className="text-gray-600 leading-relaxed">{story3}</p>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image src={aboutContent?.storyImage || "/images/HeroImage2.png"} alt="Our Story" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Target size={32} className="text-primary" />
                <h3 className="text-2xl font-bold text-dark">{t("missionTitle")}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{mission}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Eye size={32} className="text-secondary" />
                <h3 className="text-2xl font-bold text-dark">{t("visionTitle")}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-dark mb-10 text-center">{t("valuesTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-dark font-bold text-lg mb-2">{value.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark mb-10 text-center">{t("teamTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 shadow-md">
                  <Image
                    src={member.image || "/images/HeroImage1.png"}
                    alt={member.name} fill className="object-cover"
                  />
                </div>
                <h3 className="text-dark font-bold text-base">{member.name}</h3>
                <p className="text-primary text-sm mt-1">
                  {locale === "ar" ? member.roleAr : locale === "de" ? member.roleDe : member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-dark mb-10 text-center">{t("partnersTitle")}</h2>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {partners.map((partner, i) => (
              <div key={i} className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <Image src={partner.image || "/images/GahrLogo.svg"} alt={partner.name} width={120} height={60} className="object-contain" />
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/donate`} className="bg-secondary hover:bg-green-700 text-white px-10 py-3 rounded font-semibold text-lg transition-colors">
              {t("donateNow")}
            </Link>
            <Link href={`/volunteer`} className="bg-white hover:bg-gray-100 text-primary px-10 py-3 rounded font-semibold text-lg transition-colors">
              {t("volunteerWithUs")}
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-dark mb-2 text-center">{t("contactTitle")}</h2>
        <p className="text-gray-500 text-center mb-10">{t("contactSubtitle")}</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col gap-4">
            <input type="text" placeholder={t("namePlaceholder")} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder={t("emailPlaceholder")} value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
            <textarea placeholder={t("messagePlaceholder")} rows={5} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors resize-none" />
            {status === "success" && <p className="text-secondary text-sm text-center">{t("successMessage")}</p>}
            {status === "error" && <p className="text-red-500 text-sm text-center">{t("errorMessage")}</p>}
            <button onClick={handleSubmit} disabled={status === "loading"}
              className="bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {status === "loading" ? t("sending") : t("sendMessage")}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}