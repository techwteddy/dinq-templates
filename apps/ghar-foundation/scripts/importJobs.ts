import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'eg9gx04a',
  dataset: 'ghar',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const jobs = [
  {
    _type: 'job',
    order: 1,
    isActive: true,
    slug: { _type: 'slug', current: 'field-coordinator' },
    title: { en: 'Field Coordinator', ar: 'منسق ميداني', de: 'Feldkoordinator' },
    type: 'full-time',
    location: 'Sudan / Yemen',
    desc: {
      en: 'Coordinate humanitarian aid distribution and manage relationships with local partners on the ground.',
      ar: 'تنسيق توزيع المساعدات الإنسانية وإدارة العلاقات مع الشركاء المحليين على أرض الواقع.',
      de: 'Koordinierung der humanitären Hilfsverteilung und Pflege der Beziehungen zu lokalen Partnern vor Ort.',
    },
    requirements: {
      en: 'Experience in humanitarian field work, Arabic or local language skills, ability to work in challenging environments.',
      ar: 'خبرة في العمل الميداني الإنساني، إجادة اللغة العربية أو اللغات المحلية، القدرة على العمل في بيئات صعبة.',
      de: 'Erfahrung in humanitärer Feldarbeit, Arabisch- oder lokale Sprachkenntnisse, Fähigkeit in herausfordernden Umgebungen zu arbeiten.',
    },
    applyEmail: 'jobs@ghar.de',
  },
  {
    _type: 'job',
    order: 2,
    isActive: true,
    slug: { _type: 'slug', current: 'medical-volunteer' },
    title: { en: 'Medical Volunteer', ar: 'متطوع طبي', de: 'Medizinischer Freiwilliger' },
    type: 'volunteer',
    location: 'Sudan',
    desc: {
      en: 'Provide medical care in mobile clinics and refugee camps. Doctors, nurses, and pharmacists welcome.',
      ar: 'تقديم الرعاية الطبية في العيادات المتنقلة ومخيمات اللاجئين. نرحب بالأطباء والممرضين والصيادلة.',
      de: 'Medizinische Versorgung in mobilen Kliniken und Flüchtlingslagern. Ärzte, Krankenpfleger und Apotheker willkommen.',
    },
    requirements: {
      en: 'Medical degree or nursing qualification, valid license to practice, ability to commit to minimum 3 months.',
      ar: 'شهادة طبية أو مؤهل تمريضي، ترخيص ساري للممارسة، القدرة على الالتزام لمدة 3 أشهر على الأقل.',
      de: 'Medizinischer Abschluss oder Pflegequalifikation, gültige Zulassung, Bereitschaft für mindestens 3 Monate.',
    },
    applyEmail: 'jobs@ghar.de',
  },
  {
    _type: 'job',
    order: 3,
    isActive: true,
    slug: { _type: 'slug', current: 'communications-officer' },
    title: { en: 'Communications Officer', ar: 'مسؤول الاتصالات', de: 'Kommunikationsbeauftragter' },
    type: 'part-time',
    location: 'Remote / Bremen',
    desc: {
      en: 'Manage social media, write reports, and communicate our impact to donors and the public.',
      ar: 'إدارة وسائل التواصل الاجتماعي وكتابة التقارير وإيصال تأثيرنا للمانحين والجمهور.',
      de: 'Verwaltung sozialer Medien, Verfassen von Berichten und Kommunikation unserer Wirkung an Spender und Öffentlichkeit.',
    },
    requirements: {
      en: 'Experience in communications or marketing, excellent Arabic and German writing skills, social media expertise.',
      ar: 'خبرة في الاتصالات أو التسويق، مهارات ممتازة في الكتابة بالعربية والألمانية، خبرة في وسائل التواصل الاجتماعي.',
      de: 'Erfahrung in Kommunikation oder Marketing, ausgezeichnete Arabisch- und Deutschkenntnisse, Social-Media-Expertise.',
    },
    applyEmail: 'jobs@ghar.de',
  },
  {
    _type: 'job',
    order: 4,
    isActive: true,
    slug: { _type: 'slug', current: 'finance-compliance-officer' },
    title: { en: 'Finance & Compliance Officer', ar: 'مسؤول المالية والامتثال', de: 'Finanz- und Compliance-Beauftragter' },
    type: 'full-time',
    location: 'Bremen, Germany',
    desc: {
      en: 'Oversee financial reporting, ensure compliance with German NGO regulations, and manage donor records.',
      ar: 'الإشراف على التقارير المالية وضمان الامتثال للوائح المنظمات غير الحكومية الألمانية وإدارة سجلات المانحين.',
      de: 'Überwachung der Finanzberichterstattung, Sicherstellung der Einhaltung deutscher NGO-Vorschriften und Verwaltung von Spenderdaten.',
    },
    requirements: {
      en: 'Degree in finance or accounting, knowledge of German NGO regulations, experience with financial reporting.',
      ar: 'درجة علمية في المالية أو المحاسبة، معرفة باللوائح الألمانية للمنظمات غير الحكومية، خبرة في التقارير المالية.',
      de: 'Abschluss in Finanzen oder Buchhaltung, Kenntnisse der deutschen NGO-Vorschriften, Erfahrung in der Finanzberichterstattung.',
    },
    applyEmail: 'jobs@ghar.de',
  },
];

async function importJobs() {
  console.log('Importing jobs...');
  for (const job of jobs) {
    const result = await client.create(job);
    console.log(`✅ Created: ${job.title.en} (${result._id})`);
  }
  console.log('✅ All jobs imported!');
}

importJobs().catch(console.error);