"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, RefreshCw, Shield, Globe, Building2, CreditCard, CheckCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const STRIPE_ENABLED = false;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── كشف In-App Browser ────────────────────────────────
const isInAppBrowser = (): boolean => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    /FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Telegram|Line\/|MicroMessenger/i.test(ua) ||
    (ua.includes("wv") && ua.includes("Android"))
  );
};

const amounts = [10, 25, 50, 100];

const PAYPAL_PLANS: Record<number, string> = {
  10: process.env.NEXT_PUBLIC_PAYPAL_PLAN_10 || '',
  25: process.env.NEXT_PUBLIC_PAYPAL_PLAN_25 || '',
  50: process.env.NEXT_PUBLIC_PAYPAL_PLAN_50 || '',
  100: process.env.NEXT_PUBLIC_PAYPAL_PLAN_100 || '',
};

type Project = {
  id: string;
  title: string;
  titleAr: string;
  titleDe: string;
};

type SiteSettings = {
  bankIban: string;
  bankBic: string;
  bankName: string;
  email: string;
} | null;

// ─── فاصل "أو" ─────────────────────────────────────────
function OrDivider({ locale }: { locale: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-gray-400 text-sm font-medium">
        {locale === "ar" ? "أو" : locale === "de" ? "oder" : "or"}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ─── نموذج Stripe ───────────────────────────────────────
function StripePaymentForm({
  onSuccess,
  onError,
  locale,
  donationType,
}: {
  onSuccess: (type: "once" | "monthly") => void;
  onError: () => void;
  locale: string;
  donationType: "once" | "monthly";
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });
    if (error) {
      onError();
    } else {
      onSuccess(donationType);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <PaymentElement options={{ wallets: { googlePay: "auto", applePay: "auto" } }} />
      <button
        onClick={handleSubmit}
        disabled={loading || !stripe}
        className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? <RefreshCw size={20} className="animate-spin" /> : <CreditCard size={20} />}
        {locale === "ar" ? "ادفع الآن" : locale === "de" ? "Jetzt bezahlen" : "Pay Now"}
      </button>
    </div>
  );
}

export default function DonateClient({
  projects,
  siteSettings,
}: {
  projects: Project[];
  siteSettings: SiteSettings;
}) {
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState<"once" | "monthly">("once");
  const [selectedProject, setSelectedProject] = useState(() => {
    return searchParams.get("project") || "general";
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success_paypal" | "success_bank" | "success_subscription" | "success_stripe" | "error">("idle");
  const [geoData, setGeoData] = useState<{ country: string; city: string } | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [donorId, setDonorId] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const t = useTranslations("donate");
  const locale = useLocale();

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const fullName = `${firstName} ${lastName}`.trim();
  const isFormValid = !!(firstName && lastName && email && finalAmount);

  const isMonthly = donationType === "monthly";

  const monthlyPlanId = selectedAmount ? PAYPAL_PLANS[selectedAmount] : null;
  const hasMonthlyPlan = isMonthly && !!monthlyPlanId;

  const getTitle = (p: Project) => locale === "ar" ? p.titleAr : locale === "de" ? p.titleDe : p.title;

  const projectOptions = [
    { id: "general", label: t("generalDonation") },
    { id: "zakat", label: t("zakat") },
    ...projects.map((p) => ({ id: p.id, label: getTitle(p) })),
  ];

  const paypalEmail = siteSettings?.email || 'info@ghar-ngo.com';
  const bankIban = siteSettings?.bankIban || 'BE88 9053 4986 3041';
  const bankBic = siteSettings?.bankBic || 'TRWIBEB1XXX';
  const bankName = siteSettings?.bankName || 'Wise';

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setGeoData({
        country: data.country_name || '',
        city: data.city || '',
      }))
      .catch(() => null);
  }, []);

  // ─── EPC QR Code ───────────────────────────────────────
  useEffect(() => {
    if (status === "success_bank" && qrCanvasRef.current) {
      const epcData = [
        'BCD', '002', '1', 'SCT',
        bankBic,
        'German Humanitarian Relief Organization e.V.',
        bankIban.replace(/\s/g, ''),
        `EUR${(finalAmount || 0).toFixed(2)}`,
        '',
        `${fullName} - ${selectedProject}`,
        '',
      ].join('\n');

      QRCode.toCanvas(qrCanvasRef.current, epcData, {
        width: 180, margin: 1,
        color: { dark: '#1A6FA0', light: '#FFFFFF' },
      });
    }
  }, [status, bankBic, bankIban, finalAmount, fullName, selectedProject]);

  // ─── Payment Intent تلقائي عند اكتمال البيانات ─────────
  useEffect(() => {
    if (!STRIPE_ENABLED || !isFormValid || stripeLoading || donationType !== "once") return;

    let cancelled = false;

    const run = async () => {
      setStripeLoading(true);
      setStripeClientSecret(null);

      let currentDonorId = donorId;

      if (currentDonorId) {
        await supabase.from("donors").update({
          amount: finalAmount,
          donation_type: donationType,
        }).eq("id", currentDonorId);
      } else {
        const { data, error } = await supabase.from("donors").insert([{
          name: fullName,
          email: email.toLowerCase(),
          amount: finalAmount,
          donation_type: donationType,
          project: selectedProject,
          payment_method: "card",
          status: "abandoned",
          country: geoData?.country || '',
          city: geoData?.city || '',
        }]).select().single();

        if (cancelled || error || !data) {
          if (!cancelled) setStripeLoading(false);
          return;
        }
        currentDonorId = data.id;
        if (!cancelled) setDonorId(data.id);
      }

      const res = await fetch("/api/stripe-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, email: email.toLowerCase(), name: fullName, donorId: currentDonorId }),
      });

      const { clientSecret } = await res.json();
      if (!cancelled) {
        setStripeClientSecret(clientSecret);
        setStripeLoading(false);
      }
    };

    run();
    return () => { cancelled = true; setStripeClientSecret(null); };
  }, [isFormValid, finalAmount, donationType]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── حفظ abandoned للاشتراك الشهري ────────────────────
  useEffect(() => {
    if (!isFormValid || donationType !== "monthly") return;
    if (donorId) return;

    let cancelled = false;

    const run = async () => {
      const { data, error } = await supabase.from("donors").insert([{
        name: fullName,
        email: email.toLowerCase(),
        amount: finalAmount,
        donation_type: donationType,
        project: selectedProject,
        payment_method: "paypal",
        status: "abandoned",
        country: geoData?.country || '',
        city: geoData?.city || '',
      }]).select().single();

      if (!cancelled && !error && data) {
        setDonorId(data.id);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [isFormValid, donationType]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveDonorToSupabase = async (method: string) => {
    if (donorId) {
      const { error } = await supabase.from("donors").update({
        payment_method: method,
        status: "abandoned",
      }).eq("id", donorId);
      return !error;
    }
    const { error } = await supabase.from("donors").insert([{
      name: fullName,
      email: email.toLowerCase(),
      amount: finalAmount,
      donation_type: donationType,
      project: selectedProject,
      payment_method: method,
      status: "abandoned",
      country: geoData?.country || '',
      city: geoData?.city || '',
    }]);
    return !error;
  };

  const handlePayPalOnce = async () => {
    if (!isFormValid) return;
    setStatus("loading");
    const saved = await saveDonorToSupabase("paypal");
    if (!saved) { setStatus("error"); return; }
    setStatus("success_paypal");
    const paypalUrl = `https://www.paypal.com/donate?business=${paypalEmail}&amount=${finalAmount}&currency_code=EUR`;
    if (isInAppBrowser()) {
      window.location.href = paypalUrl;
    } else {
      window.open(paypalUrl, "_blank");
    }
  };

  const handleBankTransfer = async () => {
    if (!isFormValid) return;
    setStatus("loading");
    const saved = await saveDonorToSupabase("bank");
    if (!saved) { setStatus("error"); return; }
    setStatus("success_bank");
  };

  // ─── Success Screens ───────────────────────────────────

  if (status === "success_subscription") {
    return (
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <CheckCircle size={64} className="text-secondary mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-dark mb-3">
            {locale === "ar" ? "تم تفعيل اشتراكك الشهري!" : locale === "de" ? "Ihr monatliches Abonnement ist aktiv!" : "Monthly Subscription Active!"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {locale === "ar"
              ? `شكراً ${fullName}! سيتم خصم €${finalAmount} شهرياً تلقائياً من حسابك. يمكنك إلغاء الاشتراك في أي وقت من حساب PayPal الخاص بك.`
              : locale === "de"
              ? `Vielen Dank ${fullName}! €${finalAmount} werden monatlich automatisch von Ihrem Konto abgebucht. Sie können das Abonnement jederzeit über Ihr PayPal-Konto kündigen.`
              : `Thank you ${fullName}! €${finalAmount} will be automatically charged monthly. You can cancel anytime from your PayPal account.`}
          </p>
        </div>
      </section>
    );
  }

  if (status === "success_stripe") {
    return (
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <CheckCircle size={64} className="text-secondary mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-dark mb-3">
            {locale === "ar" ? "شكراً لك!" : locale === "de" ? "Vielen Dank!" : "Thank You!"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {locale === "ar"
              ? `شكراً ${fullName}! تم استلام تبرعك بمبلغ €${finalAmount} بنجاح. سيتم إرسال إيصال إلى ${email}.`
              : locale === "de"
              ? `Vielen Dank ${fullName}! Ihre Spende von €${finalAmount} wurde erfolgreich bearbeitet. Eine Quittung wird an ${email} gesendet.`
              : `Thank you ${fullName}! Your donation of €${finalAmount} was successfully processed. A receipt will be sent to ${email}.`}
          </p>
        </div>
      </section>
    );
  }

  if (status === "success_bank") {
    return (
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <CheckCircle size={64} className="text-secondary mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-dark mb-3">
            {locale === "ar" ? "شكراً لك!" : locale === "de" ? "Vielen Dank!" : "Thank You!"}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {isMonthly
              ? (locale === "ar"
                ? "لإتمام التبرع الشهري، يرجى إنشاء أمر دائم (Dauerauftrag) في تطبيق بنكك باستخدام البيانات التالية."
                : locale === "de"
                ? "Um die monatliche Spende abzuschließen, richten Sie bitte einen Dauerauftrag in Ihrer Banking-App mit den folgenden Daten ein."
                : "To complete your monthly donation, please set up a standing order (Dauerauftrag) in your banking app using the details below.")
              : (locale === "ar"
                ? "لقد تلقينا طلب تبرعك. يرجى إتمام التحويل البنكي باستخدام البيانات التالية."
                : locale === "de"
                ? "Wir haben Ihre Spendenanfrage erhalten. Bitte führen Sie die Banküberweisung mit den folgenden Daten durch."
                : "We have received your donation request. Please complete the bank transfer using the details below.")}
          </p>

          {isMonthly && (
            <div className="bg-secondary/10 rounded-xl p-4 mb-6 text-left">
              <h4 className="text-secondary font-bold text-sm mb-2">
                {locale === "ar" ? "كيف تنشئ أمر دائم؟" : locale === "de" ? "Wie richte ich einen Dauerauftrag ein?" : "How to set up a standing order?"}
              </h4>
              <ol className="text-gray-600 text-xs space-y-1 list-decimal list-inside">
                {locale === "ar" ? (
                  <>
                    <li>افتح تطبيق بنكك</li>
                    <li>اختر &quot;تحويل&quot; ثم &quot;أمر دائم&quot;</li>
                    <li>أدخل البيانات أدناه</li>
                    <li>اختر التكرار: شهري</li>
                    <li>حدد تاريخ البدء واترك تاريخ الانتهاء مفتوحاً</li>
                  </>
                ) : locale === "de" ? (
                  <>
                    <li>Öffnen Sie Ihre Banking-App</li>
                    <li>Wählen Sie &quot;Überweisung&quot; dann &quot;Dauerauftrag&quot;</li>
                    <li>Geben Sie die unten stehenden Daten ein</li>
                    <li>Wählen Sie Rhythmus: Monatlich</li>
                    <li>Startdatum festlegen, Enddatum offen lassen</li>
                  </>
                ) : (
                  <>
                    <li>Open your banking app</li>
                    <li>Select &quot;Transfer&quot; then &quot;Standing Order&quot;</li>
                    <li>Enter the details below</li>
                    <li>Set frequency: Monthly</li>
                    <li>Set start date, leave end date open</li>
                  </>
                )}
              </ol>
            </div>
          )}

          <div className="bg-primary/5 rounded-xl p-6 text-left mb-6">
            <h3 className="text-dark font-bold text-base mb-4">
              {locale === "ar" ? "بيانات التحويل البنكي" : locale === "de" ? "Bankverbindung" : "Bank Transfer Details"}
            </h3>
            <div className="flex gap-6 items-start">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Bank:</span>
                  <span className="text-dark font-medium text-sm">{bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">IBAN:</span>
                  <span className="text-dark font-medium text-sm font-mono">{bankIban}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">BIC:</span>
                  <span className="text-dark font-medium text-sm font-mono">{bankBic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">
                    {locale === "ar" ? "المبلغ:" : locale === "de" ? "Betrag:" : "Amount:"}
                  </span>
                  <span className="text-primary font-bold text-lg">€{finalAmount}</span>
                </div>
                {isMonthly && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">
                      {locale === "ar" ? "التكرار:" : locale === "de" ? "Rhythmus:" : "Frequency:"}
                    </span>
                    <span className="text-secondary font-bold text-sm">
                      {locale === "ar" ? "شهري" : locale === "de" ? "Monatlich" : "Monthly"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">
                    {locale === "ar" ? "المرجع:" : locale === "de" ? "Verwendungszweck:" : "Reference:"}
                  </span>
                  <span className="text-dark font-medium text-sm">{fullName} — {selectedProject}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <canvas ref={qrCanvasRef} className="rounded-lg" />
                <p className="text-xs text-gray-400 text-center max-w-[120px]">
                  {locale === "ar" ? "امسح للدفع" : locale === "de" ? "QR scannen" : "Scan to pay"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-xs">
            {locale === "ar"
              ? `سيتم إرسال تأكيد إلى ${email}`
              : locale === "de"
              ? `Eine Bestätigung wird an ${email} gesendet`
              : `A confirmation will be sent to ${email}`}
          </p>
        </div>
      </section>
    );
  }

  // ─── Main Form ─────────────────────────────────────────

  return (
    <PayPalScriptProvider
      key={donationType}
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        currency: "EUR",
        intent: donationType === "monthly" ? "subscription" : "capture",
        vault: donationType === "monthly",
        components: "buttons",
      }}
    >
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

              {/* Donation Type */}
              <div className="mb-8">
                <h3 className="text-dark font-bold text-lg mb-4">{t("donationType")}</h3>
                <div className="flex gap-3">
                  <button onClick={() => setDonationType("once")}
                    className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${donationType === "once" ? "bg-primary text-white" : "border border-gray-200 text-dark hover:border-primary hover:text-primary"}`}>
                    <Heart size={16} className="inline mr-2" />{t("oneTime")}
                  </button>
                  <button onClick={() => setDonationType("monthly")}
                    className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${donationType === "monthly" ? "bg-primary text-white" : "border border-gray-200 text-dark hover:border-primary hover:text-primary"}`}>
                    <RefreshCw size={16} className="inline mr-2" />{t("monthly")}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-8">
                <h3 className="text-dark font-bold text-lg mb-4">{t("selectAmount")}</h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {amounts.map((amount) => (
                    <button key={amount} onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                      className={`py-3 rounded-lg font-semibold text-sm transition-colors ${selectedAmount === amount && !customAmount ? "bg-secondary text-white" : "border border-gray-200 text-dark hover:border-secondary hover:text-secondary"}`}>
                      €{amount}
                    </button>
                  ))}
                </div>
                <input type="number" placeholder={t("customAmount")} value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
              </div>

              {/* Project */}
              <div className="mb-8">
                <h3 className="text-dark font-bold text-lg mb-4">{t("selectProject")}</h3>
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors">
                  {projectOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Personal Info */}
              <div className="mb-8">
                <h3 className="text-dark font-bold text-lg mb-4">{t("yourInfo")}</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" placeholder={t("firstNamePlaceholder")} value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
                    <input type="text" placeholder={t("lastNamePlaceholder")} value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <input type="email" placeholder={t("emailPlaceholder")} value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-primary/5 rounded-xl p-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-dark font-medium text-sm">{t("summaryDonation")}</span>
                  <span className="text-primary font-bold text-xl">€{finalAmount || 0}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500 text-xs">{t("summaryType")}</span>
                  <span className="text-gray-500 text-xs capitalize">{donationType}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500 text-xs">{t("summaryProject")}</span>
                  <span className="text-gray-500 text-xs">{projectOptions.find(p => p.id === selectedProject)?.label}</span>
                </div>
              </div>

              {/* ─── Payment Methods ─────────────────────────── */}
              <h3 className="text-dark font-bold text-lg mb-6">
                {locale === "ar" ? "طريقة الدفع" : locale === "de" ? "Zahlungsmethode" : "Payment Method"}
              </h3>

              {status === "error" && (
                <p className="text-amber-600 text-sm text-center mb-4">{t("errorMessage")}</p>
              )}

              {/* 1. نموذج البطاقة (Stripe) — مخفي مؤقتاً */}
              {STRIPE_ENABLED ? (
                donationType === "once" ? (
                  <div>
                    {stripeLoading && (
                      <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
                        <RefreshCw size={18} className="animate-spin" />
                        <span className="text-sm">
                          {locale === "ar" ? "جاري التحضير..." : locale === "de" ? "Wird vorbereitet..." : "Preparing..."}
                        </span>
                      </div>
                    )}
                    {stripeClientSecret && !stripeLoading && (
                      <Elements
                        stripe={stripePromise}
                        options={{ clientSecret: stripeClientSecret }}
                      >
                        <StripePaymentForm
                          locale={locale}
                          donationType={donationType}
                          onSuccess={(type) => setStatus(type === "monthly" ? "success_subscription" : "success_stripe")}
                          onError={() => setStatus("error")}
                        />
                      </Elements>
                    )}
                    {!stripeClientSecret && !stripeLoading && !isFormValid && (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <CreditCard size={32} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          {locale === "ar"
                            ? "أكمل بياناتك أعلاه لتظهر خيارات الدفع"
                            : locale === "de"
                            ? "Füllen Sie Ihre Daten aus, um die Zahlungsoptionen anzuzeigen"
                            : "Complete your details above to see payment options"}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Monthly — PayPal Subscription */
                  <div>
                    {isFormValid && hasMonthlyPlan ? (
                      <PayPalButtons
                        style={{ layout: "vertical", color: "blue", shape: "rect" }}
                        createSubscription={(_data, actions) => {
                          return actions.subscription.create({ plan_id: monthlyPlanId! });
                        }}
                        onApprove={async () => {
                          await saveDonorToSupabase("paypal");
                          setStatus("success_subscription");
                        }}
                        onError={() => setStatus("error")}
                      />
                    ) : isFormValid && !hasMonthlyPlan ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                        <p className="text-amber-700 text-sm">
                          {locale === "ar" ? "يرجى اختيار أحد المبالغ المحددة للاشتراك الشهري" : locale === "de" ? "Bitte wählen Sie einen der festgelegten Beträge für das monatliche Abonnement" : "Please select one of the fixed amounts for monthly subscription"}
                        </p>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <RefreshCw size={32} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          {locale === "ar"
                            ? "أكمل بياناتك أعلاه لتظهر خيارات الدفع"
                            : locale === "de"
                            ? "Füllen Sie Ihre Daten aus, um die Zahlungsoptionen anzuzeigen"
                            : "Complete your details above to see payment options"}
                        </p>
                      </div>
                    )}
                  </div>
                )
              ) : (
                /* Stripe معطل — نعرض PayPal Subscription فقط للـ monthly */
                donationType === "monthly" && (
                  <div>
                    {isFormValid && hasMonthlyPlan ? (
                      <PayPalButtons
                        style={{ layout: "vertical", color: "blue", shape: "rect" }}
                        createSubscription={(_data, actions) => {
                          return actions.subscription.create({ plan_id: monthlyPlanId! });
                        }}
                        onApprove={async () => {
                          await saveDonorToSupabase("paypal");
                          setStatus("success_subscription");
                        }}
                        onError={() => setStatus("error")}
                      />
                    ) : isFormValid && !hasMonthlyPlan ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                        <p className="text-amber-700 text-sm">
                          {locale === "ar" ? "يرجى اختيار أحد المبالغ المحددة للاشتراك الشهري" : locale === "de" ? "Bitte wählen Sie einen der festgelegten Beträge für das monatliche Abonnement" : "Please select one of the fixed amounts for monthly subscription"}
                        </p>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <RefreshCw size={32} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          {locale === "ar"
                            ? "أكمل بياناتك أعلاه لتظهر خيارات الدفع"
                            : locale === "de"
                            ? "Füllen Sie Ihre Daten aus, um die Zahlungsoptionen anzuzeigen"
                            : "Complete your details above to see payment options"}
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}

              {/* ─── أو ─── — يظهر فقط مع Stripe أو Monthly */}
              {(STRIPE_ENABLED || donationType === "monthly") && <OrDivider locale={locale} />}

              {/* 2. PayPal One-time (للدفع مرة واحدة فقط) */}
              {donationType === "once" && (
                <>
                  {/* In-App Browser Warning */}
                  {isInAppBrowser() && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex gap-3 items-start">
                      <span className="text-amber-500 text-lg shrink-0">⚠️</span>
                      <div>
                        <p className="text-amber-800 font-semibold text-sm mb-1">
                          {locale === "ar" ? "لإتمام الدفع عبر PayPal" : locale === "de" ? "Um mit PayPal zu bezahlen" : "To complete payment via PayPal"}
                        </p>
                        <p className="text-amber-700 text-xs leading-relaxed">
                          {locale === "ar"
                            ? "يرجى فتح الموقع في متصفح Chrome أو Safari خارج هذا التطبيق."
                            : locale === "de"
                            ? "Bitte öffnen Sie die Website in Chrome oder Safari außerhalb dieser App."
                            : "Please open the website in Chrome or Safari outside of this app."}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handlePayPalOnce}
                    disabled={status === "loading" || !isFormValid}
                    className="w-full bg-[#0070BA] hover:bg-[#005EA6] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.72a.641.641 0 0 1 .633-.537h7.66c2.589 0 4.377.592 5.314 1.76.434.548.712 1.12.825 1.699.118.61.098 1.32-.064 2.11l-.007.038v.52l.233.132c.196.108.376.234.537.374.292.252.509.567.641.933.136.38.18.826.135 1.323-.055.611-.229 1.163-.514 1.638-.258.434-.594.8-.998 1.084-.388.274-.843.48-1.353.613-.493.13-1.053.196-1.664.196h-.396c-.283 0-.557.102-.773.286a1.154 1.154 0 0 0-.39.726l-.03.159-.476 3.02-.022.11a.641.641 0 0 1-.632.537H7.076z" />
                        </svg>
                        {t("donatePayPal")}
                      </>
                    )}
                  </button>
                  {status === "success_paypal" && (
                    <p className="text-secondary text-sm text-center mt-3">{t("successMessage")}</p>
                  )}
                  <p className="text-center text-gray-400 text-xs mt-2">{t("redirectMessage")}</p>

                  <OrDivider locale={locale} />
                </>
              )}

              {/* 3. تحويل بنكي */}
              <button
                onClick={handleBankTransfer}
                disabled={status === "loading" || !isFormValid}
                className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <>
                    <Building2 size={20} />
                    {locale === "ar" ? "تأكيد التبرع بالتحويل البنكي" : locale === "de" ? "Spende per Banküberweisung bestätigen" : "Confirm Bank Transfer Donation"}
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-dark font-bold text-lg mb-4">{t("whyTitle")}</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-dark font-medium text-sm">{t("transparent")}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{t("transparentDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-dark font-medium text-sm">{t("directImpact")}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{t("directImpactDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-dark font-medium text-sm">{t("zakatEligible")}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{t("zakatDesc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PayPalScriptProvider>
  );
}