import type { Metadata } from "next";
import HeaderEn from "@/app/components/HeaderEn";
import FooterEn from "@/app/components/FooterEn";
import { Shield, Eye, Lock, FileText, Globe, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Sails of Life",
  description: "Privacy and personal data protection policy of 'Sails of Life' Children's Medical Rehabilitation Center. Find out how we process and protect your data.",
  alternates: {
    canonical: "https://vitrylazhyttia.com.ua/en/privacy-policy",
    languages: {
      "uk-UA": "https://vitrylazhyttia.com.ua/privacy-policy",
      "en-US": "https://vitrylazhyttia.com.ua/en/privacy-policy",
    },
  },
};

export default function PrivacyPolicyPageEn() {
  const sections = [
    {
      icon: <Shield className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "1. General Provisions",
      content: "The Communal Non-Profit Enterprise 'Center of Medical Rehabilitation and Palliative Care for Children' of the Zhytomyr Regional Council (hereinafter — the Center) respects the confidential information of any person visiting our website. This Privacy Policy is developed to protect personal data in accordance with the current legislation of Ukraine, in particular the Law of Ukraine 'On Protection of Personal Data'."
    },
    {
      icon: <FileText className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "2. Collection of Personal Data",
      content: "We may collect and process information that you voluntarily provide when filling out contact forms, application forms for rehabilitation, volunteering, or vacancies on our website (for example: full name, phone number, email address, details of a child's medical needs, or a candidate's education and experience)."
    },
    {
      icon: <Globe className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "3. Automatic Technical Data Collection",
      content: "When visiting our website, certain technical data is collected automatically using analytical tools. We use Google Analytics, Microsoft Clarity, and Cloudflare Analytics. The collected information may include your IP address, browser type, interface language, operating system, time spent on the site, pages viewed, and user interaction details (clicks, scrolls, mouse movements). This data is anonymous and is used solely for technical monitoring, heat map behavior analysis, and improving site performance."
    },
    {
      icon: <Lock className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "4. Purpose of Data Processing and Use",
      content: "Personal data is used exclusively to: process your applications for rehabilitation, appointments, volunteering notifications, or job candidate resumes; provide quality feedback; analyze user behavior to improve the structure and content of our web resource."
    },
    {
      icon: <Server className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "5. Security and Non-Disclosure of Data",
      content: "We implement robust administrative and technical security measures to protect your data from loss, theft, or unauthorized access. The Center guarantees that the received personal data is not sold, rented, or transferred to third parties. Data transfer is possible only in exceptional cases directly provided for by the current legislation of Ukraine (for example, at the request of a court)."
    },
    {
      icon: <Eye className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "6. Cookies",
      content: "To improve the usability of the site, we use cookies. They help us save your settings (for example, the design theme) and collect analytical metrics. You can change your browser settings to block cookies or receive alerts about their transmission, but this may affect the correct operation of some site functions."
    },
    {
      icon: <Shield className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "7. User Rights",
      content: "You have the right at any time to obtain information about what personal data is stored in our systems, as well as to request its correction or complete deletion. To do this, please send a written request to our official email: baby_house@ukr.net."
    }
  ];

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <HeaderEn />

      <main className="py-16 md:py-24 relative z-10 max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Privacy <span className="text-blue-600 dark:text-blue-400">Policy</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Please read the rules on how we collect, use, and protect your personal information on our website.
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div 
              key={idx}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition duration-300"
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-slate-650 dark:text-slate-300 leading-relaxed text-sm md:text-base font-medium">
                {section.content}
              </p>
            </div>
          ))}
          
          <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-3xl text-sm font-semibold text-slate-700 dark:text-slate-350 text-center">
            Last updated: June 5, 2026
          </div>
        </div>

      </main>

      <FooterEn />
    </div>
  );
}
