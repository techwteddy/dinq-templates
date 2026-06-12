"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/lib/translations";

interface CardConfig {
  icon: IconDefinition;
  iconBg: string;
  key: keyof typeof t.en.contact.cards;
  href: string;
  linkColor: string;
  external?: boolean;
}

const cardConfigs: CardConfig[] = [
  { icon: faEnvelope,  iconBg: "bg-blue-500",  key: "email",    href: "mailto:ghiberti85@gmail.com", linkColor: "hover:text-blue-400" },
  { icon: faWhatsapp,  iconBg: "bg-teal-400",  key: "whatsapp", href: "https://wa.me/5511996186115?text=Hello%20Fernando,%20I%20found%20your%20portfolio%20and%20I'd%20like%20to%20talk!", linkColor: "hover:text-teal-400", external: true },
  { icon: faLinkedin,  iconBg: "bg-blue-500",  key: "linkedin", href: "https://www.linkedin.com/in/ghiberti85/", linkColor: "hover:text-blue-400", external: true },
  { icon: faGithub,    iconBg: "bg-teal-400",  key: "github",   href: "https://github.com/ghiberti85", linkColor: "hover:text-teal-400", external: true },
];

export default function Contact() {
  const { lang } = useLanguage();
  const tr = t[lang].contact;

  return (
    <section id="contact" className="py-20 px-4">
      <h2 className="text-4xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        {tr.title}
      </h2>

      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Text column */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h3 className="text-2xl font-semibold mb-3" style={{ color: "var(--color-heading)" }}>
            {tr.collabTitle}
          </h3>
          <p className="mb-6 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {tr.collabText}
          </p>
          <h3 className="text-2xl font-semibold mb-3" style={{ color: "var(--color-heading)" }}>
            {tr.workTitle}
          </h3>
          <p className="leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {tr.workText}
          </p>
        </div>

        {/* Cards grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cardConfigs.map(({ icon, iconBg, key, href, linkColor, external }) => {
            const card = tr.cards[key];
            return (
              <div
                key={key}
                className="flex flex-col items-center p-6 rounded-lg shadow-lg hover:scale-105 transition-transform text-center glass-card"
              >
                <div className="flex justify-center mb-4">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-full ${iconBg}`}>
                    <FontAwesomeIcon icon={icon} className="text-2xl text-white" />
                  </div>
                </div>
                <h4 className="text-base font-semibold mb-1" style={{ color: "var(--color-heading)" }}>
                  {card.title}
                </h4>
                <p className="text-sm mb-4 flex-1" style={{ color: "var(--color-text-muted)" }}>
                  {card.desc}
                </p>
                <div className="text-center">
                  <a
                    href={href}
                    className={`text-sm transition-colors ${linkColor}`}
                    style={{ color: "var(--color-text-muted)" }}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {card.link}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
