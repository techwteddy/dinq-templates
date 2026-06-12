import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Shield, Eye, Lock, FileText, Globe, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Політика конфіденційності | Вітрила Життя",
  description: "Політика конфіденційності та захисту персональних даних Центру медичної реабілітації дітей 'Вітрила Життя'. Дізнайтеся, як ми обробляємо та захищаємо ваші дані.",
  alternates: {
    canonical: "https://vitrylazhyttia.com.ua/privacy-policy",
    languages: {
      "uk-UA": "https://vitrylazhyttia.com.ua/privacy-policy",
      "en-US": "https://vitrylazhyttia.com.ua/en/privacy-policy",
    },
  },
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Shield className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "1. Загальні положення",
      content: "КНП «Центр медичної реабілітації та паліативної допомоги дітям» Житомирської обласної ради (далі — Центр) з повагою ставиться до конфіденційної інформації будь-якої особи, яка відвідує наш сайт. Ця Політика конфіденційності розроблена з метою захисту персональних даних відповідно до чинного законодавства України, зокрема Закону України «Про захист персональних даних»."
    },
    {
      icon: <FileText className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "2. Збір персональних даних",
      content: "Ми можемо збирати та обробляти інформацію, яку ви добровільно надаєте при заповненні контактних форм, анкет на реабілітацію, волонтерство чи вакансії на нашому сайті (наприклад: ПІБ, номер телефону, адреса електронної пошти, дані про медичні потреби дитини чи освіту та досвід кандидата)."
    },
    {
      icon: <Globe className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "3. Автоматичний збір технічних даних",
      content: "Під час відвідування нашого сайту деякі технічні дані збираються автоматично за допомогою аналітичних інструментів. Ми використовуємо Google Analytics, Microsoft Clarity та Cloudflare Analytics. Зібрана інформація може включати вашу IP-адресу, тип браузера, мову інтерфейсу, операційну систему, час перебування на сайті, переглянуті сторінки, а також взаємодію з інтерфейсом (кліки, прокрутка, рухи миші). Ці дані є знеособленими та використовуються виключно для технічного моніторингу, теплового аналізу поведінки та покращення роботи сайту."
    },
    {
      icon: <Lock className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "4. Мета обробки та використання даних",
      content: "Персональні дані використовуються виключно для: опрацювання надісланих вами заявок на реабілітацію, записів на прийом, повідомлень про волонтерство, резюме кандидатів; забезпечення якісного зворотного зв'язку; аналізу поведінки користувачів для покращення структури та контенту нашого вебресурсу."
    },
    {
      icon: <Server className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "5. Захист та нерозголошення даних",
      content: "Ми впроваджуємо надійні адміністративні та технічні заходи безпеки для захисту ваших даних від втрати, крадіжки чи несанкціонованого доступу. Центр гарантує, що отримані персональні дані не продаються, не здаються в оренду та не передаються третім особам. Передача даних можлива лише у виняткових випадках, прямо передбачених чинним законодавством України (наприклад, на вимогу суду)."
    },
    {
      icon: <Eye className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "6. Файли cookie (Куки)",
      content: "Для підвищення зручності користування сайтом ми використовуємо файли cookie. Вони допомагають нам зберігати ваші налаштування (наприклад, тему оформлення) та збирати аналітику відвідуваності. Ви можете змінити налаштування свого браузера, щоб заблокувати cookie або отримувати попередження про їх надсилання, однак це може вплинути на коректність роботи деяких функцій сайту."
    },
    {
      icon: <Shield className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "7. Права користувачів",
      content: "Ви маєте право в будь-який момент отримати інформацію про те, які ваші персональні дані збережені в наших системах, а також вимагати їх виправлення або повного видалення. Для цього надішліть письмовий запит на нашу офіційну електронну пошту: baby_house@ukr.net."
    }
  ];

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <Header />

      <main className="py-16 md:py-24 relative z-10 max-w-4xl mx-auto px-6">
        
        {/* ШАПКА СТОРІНКИ */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Політика <span className="text-blue-600 dark:text-blue-400">конфіденційності</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Ознайомтеся з правилами збору, використання та захисту вашої персональної інформації на нашому сайті.
          </p>
        </div>

        {/* ОСНОВНИЙ КОНТЕНТ */}
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
            Остання зміна: 5 червня 2026 року
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
