"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Copy, Check, Gift, Users, CreditCard, Send, ArrowRight, Loader2 } from "lucide-react";
import HeaderEn from "@/app/components/HeaderEn";
import FooterEn from "@/app/components/FooterEn";
import Input from "@/app/components/core/Input";
import Select from "@/app/components/core/Select";
import Textarea from "@/app/components/core/Textarea";
import ConsentCheckboxEn from "@/app/components/core/ConsentCheckboxEn";

import { bankDetails, materialNeeds } from "@/app/data/helpEn";

export default function HelpPageEn() {
  const [activeTab, setActiveTab] = useState<"financial" | "material" | "volunteer">("financial");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Volunteer Form
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    phone: "",
    email: "",
    direction: "children",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const textToCopy = bankDetails.map(d => `${d.label}: ${d.value}`).join("\n");
    navigator.clipboard.writeText(textToCopy);
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Тип_форми: "Заявка волонтера (EN)",
          Ім_я: volunteerForm.name,
          Телефон: volunteerForm.phone,
          Email: volunteerForm.email,
          Напрямок: volunteerForm.direction,
          Повідомлення: volunteerForm.message,
        }),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setConsent(false);
      } else {
        alert("An error occurred during submission. Please try again.");
      }
    } catch {
      alert("Connection error. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <HeaderEn />

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">

        {/* Page Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-455 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <Heart size={14} className="fill-current" /> Help Us
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">
            Your Support Saves Lives
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Every donation, every package of wipes, or hour of your time spent volunteering aids children&apos;s recovery and eases the status of little palliative patients.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl mx-auto mb-12 shadow-inner">
          <button
            onClick={() => setActiveTab("financial")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === "financial"
                ? "bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
          >
            <CreditCard size={16} /> Financial Support
          </button>
          <button
            onClick={() => setActiveTab("material")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === "material"
                ? "bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
          >
            <Gift size={16} /> Material Needs
          </button>
          <button
            onClick={() => setActiveTab("volunteer")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === "volunteer"
                ? "bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
          >
            <Users size={16} /> Become a Volunteer
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl transition-colors duration-500">
          <AnimatePresence mode="wait">

            {activeTab === "financial" && (
              <motion.div
                key="financial"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <CreditCard className="text-blue-600 dark:text-blue-400" />
                    Charity Bank Accounts
                  </h2>
                  <p className="text-sm font-medium text-slate-550 dark:text-slate-400 mt-2">
                    You can make a direct bank transfer via any mobile banking app or bank counter. Official details are listed below.
                  </p>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                  {bankDetails.map((detail) => (
                    <div
                      key={detail.field}
                      className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-slate-200 dark:hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                          {detail.label}
                        </span>
                        <p className="text-sm md:text-base font-semibold text-slate-800 dark:text-white leading-relaxed">
                          {detail.value}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(detail.value, detail.field)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer ${copiedField === detail.field
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50"
                            : "bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-700"
                          }`}
                      >
                        {copiedField === detail.field ? (
                          <>
                            <Check size={14} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={handleCopyAll}
                    className={`w-full py-3.5 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2 border shadow-sm cursor-pointer ${copiedField === "all"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50"
                        : "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30"
                      }`}
                  >
                    {copiedField === "all" ? (
                      <>
                        <Check size={16} /> All details copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy all details together
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "material" && (
              <motion.div
                key="material"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Gift className="text-blue-600 dark:text-blue-400" />
                    Urgent Material Needs
                  </h2>
                  <p className="text-sm font-medium text-slate-550 dark:text-slate-400 mt-2">
                    If you prefer to purchase and ship or deliver items directly, these are the categories of items we require the most.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {materialNeeds.map((category, catIdx) => (
                    <div
                      key={catIdx}
                      className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 text-lg">
                          {category.category}
                        </h3>
                        <ul className="mt-4 space-y-4">
                          {category.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2.5">
                              <span
                                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.status === "critical"
                                    ? "bg-red-500"
                                    : item.status === "always"
                                      ? "bg-blue-500"
                                      : "bg-slate-400"
                                  }`}
                              />
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-slate-850 dark:text-slate-300 leading-tight">
                                  {item.name}
                                </p>
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                  {item.status === "critical" && (
                                    <span className="text-red-500 dark:text-red-400">Urgent</span>
                                  )}
                                  {item.status === "always" && (
                                    <span className="text-blue-500 dark:text-blue-400">Always needed</span>
                                  )}
                                  {item.status === "normal" && (
                                    <span className="text-slate-400 dark:text-slate-500">As needed</span>
                                  )}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-350">
                  Before purchasing or sending large batches of items, we recommend contacting the administration at <a href="tel:+380671234567" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors cursor-pointer">+38 (067) 123-45-67</a> to coordinate logistics.
                </div>
              </motion.div>
            )}

            {activeTab === "volunteer" && (
              <motion.div
                key="volunteer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white flex items-center justify-center gap-2.5">
                    <Users className="text-blue-600 dark:text-blue-400" />
                    Join Us as a Volunteer
                  </h2>
                  <p className="text-sm md:text-base font-medium text-slate-550 dark:text-slate-400 mt-3 leading-relaxed">
                    We welcome all kinds of support: conducting art sessions with children, organizing events, landscaping, or providing professional assistance.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none max-w-2xl mx-auto">
                  {!formSubmitted ? (
                    <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Your Name"
                          type="text"
                          required
                          value={volunteerForm.name}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                          placeholder="John Doe"
                        />
                        <Input
                          label="Phone Number"
                          type="tel"
                          required
                          value={volunteerForm.phone}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                          placeholder="+380..."
                        />
                      </div>

                      <Input
                        label="Email Address"
                        type="email"
                        required
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                        placeholder="example@mail.com"
                      />

                      <Select
                        label="Volunteering Direction"
                        value={
                          volunteerForm.direction === "children"
                            ? "Activities & leisure with children"
                            : volunteerForm.direction === "events"
                              ? "Charity event organization"
                              : volunteerForm.direction === "repair"
                                ? "Landscaping & minor repairs"
                                : volunteerForm.direction === "professional"
                                  ? "Professional support (IT, design, legal)"
                                  : "Other"
                        }
                        onChange={(val) => {
                          const dirMap: Record<string, string> = {
                            "Activities & leisure with children": "children",
                            "Charity event organization": "events",
                            "Landscaping & minor repairs": "repair",
                            "Professional support (IT, design, legal)": "professional",
                            "Other": "other",
                          };
                          setVolunteerForm({ ...volunteerForm, direction: dirMap[val] || "other" });
                        }}
                        options={[
                          "Activities & leisure with children",
                          "Charity event organization",
                          "Landscaping & minor repairs",
                          "Professional support (IT, design, legal)",
                          "Other",
                        ]}
                      />

                      <Textarea
                        label="How exactly would you like to help?"
                        rows={4}
                        value={volunteerForm.message}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, message: e.target.value })}
                        placeholder="Tell us about your ideas or skills..."
                      />

                      <ConsentCheckboxEn checked={consent} onChange={setConsent} />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                        Send Volunteer Request
                      </button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6 space-y-4"
                    >
                      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <Check size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Request Received!</h3>
                        <p className="text-sm font-medium text-slate-550 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                          Thank you for your generous heart. Our volunteer coordinator will contact you shortly.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setFormSubmitted(false);
                          setVolunteerForm({ name: "", phone: "", email: "", direction: "children", message: "" });
                          setConsent(false);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-450 transition cursor-pointer"
                      >
                        Fill in again <ArrowRight size={12} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      <FooterEn />
    </div>
  );
}
