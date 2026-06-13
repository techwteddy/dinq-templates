"use client";

import { useState } from "react";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SiteSettings = {
  address: string;
  city: string;
  email: string;
  phone: string;
} | null;

export default function ContactClient({ siteSettings }: { siteSettings: SiteSettings }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = useTranslations("contact");

  const address = siteSettings?.address || "Kullenkampffallee 193";
  const city = siteSettings?.city || "28217 Bremen, Germany";
  const email = siteSettings?.email || "info@ghar-ngo.com";
  const phone = siteSettings?.phone || "";

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    const { error } = await supabase.from("contact_messages").insert([form]);
    if (error) { setStatus("error"); return; }
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Contact Info + Map */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">{t("infoTitle")}</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-dark font-medium text-sm">{t("address")}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{address}</p>
                  <p className="text-gray-500 text-sm">{city}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-dark font-medium text-sm">{t("email")}</p>
                  <a href={`mailto:${email}`} className="text-primary text-sm mt-0.5 hover:underline">{email}</a>
                </div>
              </div>
              {phone && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-dark font-medium text-sm">{t("phone")}</p>
                    <a href={`tel:${phone}`} className="text-primary text-sm mt-0.5 hover:underline">{phone}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Google Maps */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-72">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2395.857660382198!2d8.84675367674478!3d53.094791272217435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b127cfefd7a38d%3A0x526630d02a29c625!2sKulenkampffallee%20193%2C%2028213%20Bremen%2C%20Germany!5e0!3m2!1sen!2sus!4v1775471603321!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-dark mb-6">{t("formTitle")}</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col gap-4">
              <input type="text" placeholder={t("namePlaceholder")} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
              <input type="email" placeholder={t("emailPlaceholder")} value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
              <textarea placeholder={t("messagePlaceholder")} rows={6} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors resize-none" />
              {status === "success" && <p className="text-secondary text-sm text-center">{t("successMessage")}</p>}
              {status === "error" && <p className="text-red-500 text-sm text-center">{t("errorMessage")}</p>}
              <button onClick={handleSubmit}
                disabled={status === "loading" || !form.name || !form.email || !form.message}
                className="bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Send size={16} />
                {status === "loading" ? t("sending") : t("sendMessage")}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}