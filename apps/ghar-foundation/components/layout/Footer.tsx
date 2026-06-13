"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type SiteSettings = {
  address: string;
  city: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  launchgoodUrl: string;
  bankIban: string;
  bankBic: string;
  bankName: string;
} | null;

type Project = {
  id: string;
  title: string;
  titleAr: string;
  titleDe: string;
};

export default function Footer({
  siteSettings,
  projects = [],
}: {
  siteSettings: SiteSettings;
  projects: Project[];
}) {
  const t = useTranslations("footer");
  const locale = useLocale();

  const email = siteSettings?.email || 'info@ghar-ngo.com';
  const address = siteSettings?.address || 'Kullenkampffallee 193';
  const city = siteSettings?.city || '28217 Bremen, Germany';
  const facebook = siteSettings?.facebook || `/${locale}/contact`;
const instagram = siteSettings?.instagram || `/${locale}/contact`;
const twitter = siteSettings?.twitter || `/${locale}/contact`;
const linkedin = siteSettings?.linkedin || `/${locale}/contact`;
const youtube = siteSettings?.youtube || `/${locale}/contact`;

  const getTitle = (p: Project) => locale === "ar" ? p.titleAr : locale === "de" ? p.titleDe : p.title;

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center md:justify-items-start">

          {/* Column 1: Logo + Description */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Image src="/images/GahrLogoW.svg" alt="GHAR Organization" width={100} height={50} />
            <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-[180px]">
              {t("description")}
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="md:pl-8">
            <ul className="space-y-2 mt-2">
              <li><Link href={`/${locale}/about`} className="text-white/80 hover:text-white text-sm transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href={`/${locale}/volunteer`} className="text-white/80 hover:text-white text-sm transition-colors">{t("volunteer")}</Link></li>
              <li><Link href={`/${locale}/jobs`} className="text-white/80 hover:text-white text-sm transition-colors">{t("jobs")}</Link></li>
              <li><Link href={`/${locale}/transparency`} className="text-white/80 hover:text-white text-sm transition-colors">{t("transparency")}</Link></li>
              <li><Link href={`/${locale}/news`} className="text-white/80 hover:text-white text-sm transition-colors">{t("pressRelease")}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="text-white/80 hover:text-white text-sm transition-colors">{t("privacy")}</Link></li>
              <li><Link href={`/${locale}/impressum`} className="text-white/80 hover:text-white text-sm transition-colors">{t("impressum")}</Link></li>
            </ul>
          </div>

          {/* Column 3: Projects */}
          <div>
            <ul className="space-y-2 mt-2">
              <li><Link href={`/${locale}/projects`} className="text-white font-medium text-sm">{t("ourProjects")}</Link></li>
              {projects.slice(0, 4).map((project) => (
                <li key={project.id}>
                  <Link href={`/${locale}/projects/${project.id}`} className="text-white/80 hover:text-white text-sm transition-colors">
                    {getTitle(project)}
                  </Link>
                </li>
              ))}
              <li><Link href={`/${locale}/projects`} className="text-white/80 hover:text-white text-sm transition-colors">{t("others")}</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">{t("contactUs")}</h3>
            <div className="flex items-start gap-2 mb-3">
              <MapPin size={16} className="text-white/70 mt-0.5 shrink-0" />
              <div>
                <p className="text-white/70 text-sm">{address}</p>
                <p className="text-white/70 text-sm">{city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Mail size={16} className="text-white/70 shrink-0" />
              <a href={`mailto:${email}`} className="text-white/70 hover:text-white text-sm transition-colors">
                {email}
              </a>
            </div>
            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              <a href={facebook} className="text-white hover:text-white/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={instagram} className="text-white hover:text-white/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={twitter} className="text-white hover:text-white/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={linkedin} className="text-white hover:text-white/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
              </a>
              <a href={youtube} className="text-white hover:text-white/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center items-center">
          <p className="text-white/60 text-xs">© 2026 GHAR - All Rights Reserved - Developed By IbrahimAbusaif</p>
        </div>
      </div>
    </footer>
  );
}