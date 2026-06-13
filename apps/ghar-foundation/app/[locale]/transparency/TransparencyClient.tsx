"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, FileText, PieChart, Users, Award, Download } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type Allocation = {
  label: string; labelAr: string; labelDe: string;
  percentage: number; color: string;
};

type Report = {
  year: string;
  title: string; titleAr: string; titleDe: string;
  fileUrl: string; size: string;
};

type GovernanceMember = {
  role: string; roleAr: string; roleDe: string;
  name: string;
  responsibility: string; responsibilityAr: string; responsibilityDe: string;
};

type Certification = {
  name: string; nameAr: string; nameDe: string;
  body: string; year: string;
};

type TransparencyContent = {
  allocations: Allocation[];
  reports: Report[];
  governance: GovernanceMember[];
  certifications: Certification[];
  efficiencyPercentage: number;
} | null;

const defaultAllocations = [
  { label: 'Direct Aid & Projects', labelAr: 'الإغاثة المباشرة والمشاريع', labelDe: 'Direkte Hilfe & Projekte', percentage: 75, color: '#1A6FA0' },
  { label: 'Operations & Admin', labelAr: 'العمليات والإدارة', labelDe: 'Betrieb & Verwaltung', percentage: 15, color: '#2D8F16' },
  { label: 'Fundraising', labelAr: 'جمع التبرعات', labelDe: 'Spendenakquise', percentage: 7, color: '#EF8800' },
  { label: 'Reserve Fund', labelAr: 'صندوق الاحتياطي', labelDe: 'Reservefonds', percentage: 3, color: '#2A2A2A' },
];

const defaultReports = [
  { year: '2025', title: 'Annual Financial Report 2025', titleAr: 'التقرير المالي السنوي 2025', titleDe: 'Jahresfinanzbericht 2025', fileUrl: '', size: '2.4 MB' },
  { year: '2024', title: 'Annual Financial Report 2024', titleAr: 'التقرير المالي السنوي 2024', titleDe: 'Jahresfinanzbericht 2024', fileUrl: '', size: '1.8 MB' },
  { year: '2023', title: 'Annual Financial Report 2023', titleAr: 'التقرير المالي السنوي 2023', titleDe: 'Jahresfinanzbericht 2023', fileUrl: '', size: '1.2 MB' },
];

const defaultGovernance = [
  { role: 'Executive Director', roleAr: 'المدير التنفيذي', roleDe: 'Geschäftsführer', name: 'Ahmed Al-Rashid', responsibility: 'Overall leadership and strategic direction', responsibilityAr: 'القيادة العامة والتوجه الاستراتيجي', responsibilityDe: 'Gesamtleitung und strategische Ausrichtung' },
  { role: 'Finance Director', roleAr: 'مديرة المالية', roleDe: 'Finanzleiterin', name: 'Lena Weber', responsibility: 'Financial oversight and compliance', responsibilityAr: 'الإشراف المالي والامتثال', responsibilityDe: 'Finanzaufsicht und Compliance' },
  { role: 'Program Manager', roleAr: 'مديرة البرامج', roleDe: 'Programmleiterin', name: 'Sara Müller', responsibility: 'Project implementation and monitoring', responsibilityAr: 'تنفيذ المشاريع ومتابعتها', responsibilityDe: 'Projektdurchführung und Monitoring' },
  { role: 'Field Coordinator', roleAr: 'منسق ميداني', roleDe: 'Feldkoordinator', name: 'Omar Hassan', responsibility: 'On-ground operations in Sudan & Yemen', responsibilityAr: 'العمليات الميدانية في السودان واليمن', responsibilityDe: 'Vor-Ort-Operationen in Sudan und Jemen' },
];

const defaultCertifications = [
  { name: 'Registered NGO in Germany', nameAr: 'منظمة غير حكومية مسجلة في ألمانيا', nameDe: 'Eingetragene NGO in Deutschland', body: 'Amtsgericht Bremen', year: '2024' },
  { name: 'Tax-Exempt Status', nameAr: 'الإعفاء الضريبي', nameDe: 'Steuerbefreiung', body: 'Finanzamt Bremen', year: '2024' },
  { name: 'DZI Certification (Pending)', nameAr: 'شهادة DZI (قيد الانتظار)', nameDe: 'DZI-Zertifizierung (ausstehend)', body: 'Deutsches Zentralinstitut für soziale Fragen', year: '2026' },
];

export default function TransparencyClient({
  heroImage,
  heroTitle,
  heroSubtitle,
  transparencyContent,
}: {
  heroImage: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  transparencyContent: TransparencyContent;
}) {
  const t = useTranslations("transparency");
  const locale = useLocale();

  const allocations = transparencyContent?.allocations?.length ? transparencyContent.allocations : defaultAllocations;
  const reports = transparencyContent?.reports?.length ? transparencyContent.reports : [];
  const governance = transparencyContent?.governance?.length ? transparencyContent.governance : defaultGovernance;
  const certifications = transparencyContent?.certifications?.length ? transparencyContent.certifications : defaultCertifications;
  const efficiencyPercentage = transparencyContent?.efficiencyPercentage || [];

  const getAllocationLabel = (a: Allocation) => locale === "ar" ? a.labelAr : locale === "de" ? a.labelDe : a.label;
  const getReportTitle = (r: Report) => locale === "ar" ? r.titleAr : locale === "de" ? r.titleDe : r.title;
  const getRole = (g: GovernanceMember) => locale === "ar" ? g.roleAr : locale === "de" ? g.roleDe : g.role;
  const getResponsibility = (g: GovernanceMember) => locale === "ar" ? g.responsibilityAr : locale === "de" ? g.responsibilityDe : g.responsibility;
  const getCertName = (c: Certification) => locale === "ar" ? c.nameAr : locale === "de" ? c.nameDe : c.name;

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative h-[40vh]">
        {heroImage ? (
          <Image src={heroImage} alt="Transparency" fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <Shield size={48} className="text-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{heroTitle || t("heroTitle")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{heroSubtitle || t("heroSubtitle")}</p>
        </div>
      </section>

      {/* Financial Reports */}
      {reports.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <FileText size={28} className="text-primary" />
            <h2 className="text-3xl font-bold text-dark">{t("reportsTitle")}</h2>
          </div>
          <div className="flex flex-col gap-4">
            {reports.map((report, i) => (
            <div key={i} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-lg">{report.year}</div>
                <div>
                  <p className="text-dark font-semibold text-sm">{getReportTitle(report)}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{report.size}</p>
                </div>
              </div>
              {report.fileUrl ? (
                <a href={report.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-white hover:bg-primary border border-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Download size={14} />
                  {t("download")}
                </a>
              ) : (
                <span className="flex items-center gap-2 text-gray-400 border border-gray-200 px-4 py-2 rounded-lg text-sm">
                  <Download size={14} />
                  {t("available")}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
      )}
      {/* How We Use Donations */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <PieChart size={28} className="text-primary" />
            <h2 className="text-3xl font-bold text-dark">{t("donationsTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-4">
              {allocations.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-dark text-sm font-medium">{getAllocationLabel(item)}</span>
                    <span className="text-dark font-bold text-sm">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4">
                    <div className="h-4 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark mb-4">{t("efficiencyTitle")}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{t("efficiencyText1")}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{t("efficiencyText2")}</p>
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-primary font-bold text-2xl">{efficiencyPercentage}%</p>
                <p className="text-gray-500 text-sm">{t("efficiencyHighlight")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Users size={28} className="text-primary" />
          <h2 className="text-3xl font-bold text-dark">{t("governanceTitle")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {governance.map((member, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-primary font-semibold uppercase mb-1">{getRole(member)}</p>
              <p className="text-dark font-bold text-base mb-1">{member.name}</p>
              <p className="text-gray-500 text-sm">{getResponsibility(member)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <Award size={28} className="text-primary" />
            <h2 className="text-3xl font-bold text-dark">{t("certificationsTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
                <Award size={32} className="text-primary mx-auto mb-3" />
                <p className="text-dark font-bold text-base mb-1">{getCertName(cert)}</p>
                <p className="text-gray-500 text-xs mb-1">{cert.body}</p>
                <p className="text-primary text-xs font-semibold">{cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/80 mb-8 text-lg">{t("ctaSubtitle")}</p>
          <Link href={`/${locale}/contact`} className="bg-secondary hover:bg-green-700 text-white px-12 py-3 rounded font-semibold text-lg transition-colors">
            {t("contactUs")}
          </Link>
        </div>
      </section>

    </div>
  );
}