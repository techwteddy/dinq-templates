import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'eg9gx04a',
  dataset: 'ghar',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const transparencyContent = {
  _type: 'transparencyContent',
  _id: 'transparencyContent',
  efficiencyPercentage: 75,
  allocations: [
    { label: { en: 'Direct Aid & Projects', ar: 'الإغاثة المباشرة والمشاريع', de: 'Direkte Hilfe & Projekte' }, percentage: 75, color: '#1A6FA0' },
    { label: { en: 'Operations & Admin', ar: 'العمليات والإدارة', de: 'Betrieb & Verwaltung' }, percentage: 15, color: '#2D8F16' },
    { label: { en: 'Fundraising', ar: 'جمع التبرعات', de: 'Spendenakquise' }, percentage: 7, color: '#EF8800' },
    { label: { en: 'Reserve Fund', ar: 'صندوق الاحتياطي', de: 'Reservefonds' }, percentage: 3, color: '#2A2A2A' },
  ],
  reports: [
    { year: '2025', title: { en: 'Annual Financial Report 2025', ar: 'التقرير المالي السنوي 2025', de: 'Jahresfinanzbericht 2025' }, size: '2.4 MB' },
    { year: '2024', title: { en: 'Annual Financial Report 2024', ar: 'التقرير المالي السنوي 2024', de: 'Jahresfinanzbericht 2024' }, size: '1.8 MB' },
    { year: '2023', title: { en: 'Annual Financial Report 2023', ar: 'التقرير المالي السنوي 2023', de: 'Jahresfinanzbericht 2023' }, size: '1.2 MB' },
  ],
  governance: [
    { role: { en: 'Executive Director', ar: 'المدير التنفيذي', de: 'Geschäftsführer' }, name: 'Ahmed Al-Rashid', responsibility: { en: 'Overall leadership and strategic direction', ar: 'القيادة العامة والتوجه الاستراتيجي', de: 'Gesamtleitung und strategische Ausrichtung' } },
    { role: { en: 'Finance Director', ar: 'مديرة المالية', de: 'Finanzleiterin' }, name: 'Lena Weber', responsibility: { en: 'Financial oversight and compliance', ar: 'الإشراف المالي والامتثال', de: 'Finanzaufsicht und Compliance' } },
    { role: { en: 'Program Manager', ar: 'مديرة البرامج', de: 'Programmleiterin' }, name: 'Sara Müller', responsibility: { en: 'Project implementation and monitoring', ar: 'تنفيذ المشاريع ومتابعتها', de: 'Projektdurchführung und Monitoring' } },
    { role: { en: 'Field Coordinator', ar: 'منسق ميداني', de: 'Feldkoordinator' }, name: 'Omar Hassan', responsibility: { en: 'On-ground operations in Sudan & Yemen', ar: 'العمليات الميدانية في السودان واليمن', de: 'Vor-Ort-Operationen in Sudan und Jemen' } },
  ],
  certifications: [
    { name: { en: 'Registered NGO in Germany', ar: 'منظمة غير حكومية مسجلة في ألمانيا', de: 'Eingetragene NGO in Deutschland' }, body: 'Amtsgericht Bremen', year: '2024' },
    { name: { en: 'Tax-Exempt Status', ar: 'الإعفاء الضريبي', de: 'Steuerbefreiung' }, body: 'Finanzamt Bremen', year: '2024' },
    { name: { en: 'DZI Certification (Pending)', ar: 'شهادة DZI (قيد الانتظار)', de: 'DZI-Zertifizierung (ausstehend)' }, body: 'Deutsches Zentralinstitut für soziale Fragen', year: '2026' },
  ],
};

async function importTransparency() {
  console.log('Importing transparency content...');
  await client.createOrReplace(transparencyContent);
  console.log('✅ Transparency content imported!');
}

importTransparency().catch(console.error);