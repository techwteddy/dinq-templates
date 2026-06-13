import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'eg9gx04a',
  dataset: 'ghar',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ===== HERO SLIDES =====
const heroSlides = [
  {
    _type: 'heroSlide',
    order: 1,
    title: { en: 'Sheltering Lives,\nRestoring Hope', ar: 'إيواء الأرواح،\naستعادة الأمل', de: 'Leben schützen,\nHoffnung wiederherstellen' },
    subtitle: { en: 'German Humanitarian Relief Organization providing aid to crisis-affected regions', ar: 'منظمة إنسانية ألمانية تقدم المساعدة للمناطق المتضررة من الأزمات', de: 'Deutsche humanitäre Hilfsorganisation für Krisenregionen' },
  },
  {
    _type: 'heroSlide',
    order: 2,
    title: { en: 'Clean Water\nFor All', ar: 'مياه نظيفة\nللجميع', de: 'Sauberes Wasser\nFür Alle' },
    subtitle: { en: 'Bringing safe drinking water to thousands of families in Sudan', ar: 'توفير مياه شرب آمنة لآلاف الأسر في السودان', de: 'Sauberes Trinkwasser für Tausende von Familien im Sudan' },
  },
  {
    _type: 'heroSlide',
    order: 3,
    title: { en: 'Fighting Hunger\nTogether', ar: 'محاربة الجوع\nمعاً', de: 'Hunger bekämpfen\nGemeinsam' },
    subtitle: { en: 'Delivering food aid to vulnerable families across Yemen', ar: 'تقديم المساعدات الغذائية للأسر الضعيفة في اليمن', de: 'Nahrungsmittelhilfe für gefährdete Familien im Jemen' },
  },
  {
    _type: 'heroSlide',
    order: 4,
    title: { en: 'Education\nChanges Lives', ar: 'التعليم\nيغير الحياة', de: 'Bildung\nVerändert Leben' },
    subtitle: { en: 'Supporting children\'s right to learn in conflict zones', ar: 'دعم حق الأطفال في التعلم في مناطق النزاع', de: 'Das Recht der Kinder auf Bildung in Konfliktgebieten' },
  },
];

// ===== STATS =====
const stats = [
  { _type: 'stat', order: 1, number: 5100, label: { en: 'Families Supported', ar: 'عائلة مستفيدة', de: 'Unterstützte Familien' } },
  { _type: 'stat', order: 2, number: 2100, label: { en: 'Donations Received', ar: 'تبرع مستلم', de: 'Erhaltene Spenden' } },
  { _type: 'stat', order: 3, number: 12, label: { en: 'Countries Reached', ar: 'دولة نصلها', de: 'Erreichte Länder' } },
];

// ===== SITE SETTINGS =====
const siteSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  address: 'Kullenkampffallee 193',
  city: '28217 Bremen, Germany',
  email: 'info@ghar-ngo.com',
  phone: '',
  bankIban: 'DE00 0000 0000 0000 0000 00',
  bankBic: 'XXXXXXXX',
  bankName: 'Sparkasse Bremen',
  launchgoodUrl: 'https://www.launchgood.com',
};

// ===== TEAM MEMBERS =====
const teamMembers = [
  { _type: 'teamMember', order: 1, name: 'Ahmed Al-Rashid', role: { en: 'Executive Director', ar: 'المدير التنفيذي', de: 'Geschäftsführer' } },
  { _type: 'teamMember', order: 2, name: 'Sara Müller', role: { en: 'Program Manager', ar: 'مديرة البرامج', de: 'Programmleiterin' } },
  { _type: 'teamMember', order: 3, name: 'Omar Hassan', role: { en: 'Field Coordinator', ar: 'منسق ميداني', de: 'Feldkoordinator' } },
  { _type: 'teamMember', order: 4, name: 'Lena Weber', role: { en: 'Finance Director', ar: 'مديرة المالية', de: 'Finanzleiterin' } },
];

// ===== ABOUT CONTENT =====
const aboutContent = {
  _type: 'aboutContent',
  _id: 'aboutContent',
  story1: {
    en: 'GHAR Organization was established in Bremen, Germany, by a group of dedicated individuals who witnessed firsthand the devastating humanitarian crises in Sudan and Yemen. Driven by compassion and a sense of responsibility, they came together to create an organization that bridges the gap between those who want to help and those who need it most.',
    ar: 'تأسست مؤسسة غار في بريمن، ألمانيا، على يد مجموعة من الأفراد المتفانين الذين شهدوا عن كثب الأزمات الإنسانية المدمرة في السودان واليمن.',
    de: 'Die GHAR Organization wurde in Bremen, Deutschland, von einer Gruppe engagierter Menschen gegründet, die die verheerenden humanitären Krisen in Sudan und Jemen hautnah miterlebt haben.',
  },
  story2: {
    en: 'The name "GHAR" — meaning "cave" in Arabic — symbolizes shelter and protection, reflecting our core mission to provide refuge and hope to those displaced by conflict and disaster.',
    ar: 'اسم «غار» يرمز إلى الملجأ والحماية، مما يعكس مهمتنا الأساسية في توفير الملاذ والأمل لمن هجّرهم الصراع والكوارث.',
    de: 'Der Name „GHAR" — arabisch für „Höhle" — symbolisiert Schutz und Zuflucht.',
  },
  story3: {
    en: 'Since our founding, we have grown into a trusted humanitarian organization serving thousands of families across multiple crisis zones, while maintaining the highest standards of transparency and accountability.',
    ar: 'منذ تأسيسنا، نمونا لنصبح منظمة إنسانية موثوقة تخدم آلاف الأسر عبر مناطق أزمات متعددة.',
    de: 'Seit unserer Gründung sind wir zu einer vertrauenswürdigen humanitären Organisation gewachsen.',
  },
  mission: {
    en: 'To provide immediate and sustainable humanitarian aid to crisis-affected communities in Sudan, Yemen, and beyond — delivering clean water, food, medical care, and education while upholding human dignity.',
    ar: 'تقديم مساعدات إنسانية فورية ومستدامة للمجتمعات المتضررة من الأزمات في السودان واليمن وما بعدهما.',
    de: 'Sofortige und nachhaltige humanitäre Hilfe für krisenbetroffene Gemeinschaften in Sudan, Jemen und darüber hinaus.',
  },
  vision: {
    en: 'A world where every person, regardless of where they live or what crisis they face, has access to the basic necessities of life.',
    ar: 'عالم يتمتع فيه كل إنسان بحق الوصول إلى الضروريات الأساسية للحياة.',
    de: 'Eine Welt, in der jeder Mensch Zugang zu den grundlegenden Lebensnotwendigkeiten hat.',
  },
  values: [
    { icon: 'Heart', title: { en: 'Humanity', ar: 'الإنسانية', de: 'Menschlichkeit' }, desc: { en: 'We place human dignity at the center of everything we do.', ar: 'نضع الكرامة الإنسانية في صميم كل ما نقوم به.', de: 'Wir stellen die Menschenwürde in den Mittelpunkt.' } },
    { icon: 'Shield', title: { en: 'Transparency', ar: 'الشفافية', de: 'Transparenz' }, desc: { en: 'Full accountability to our donors and the communities we serve.', ar: 'المساءلة الكاملة لمانحينا والمجتمعات التي نخدمها.', de: 'Vollständige Rechenschaftspflicht gegenüber unseren Spendern.' } },
    { icon: 'Target', title: { en: 'Impact', ar: 'الأثر', de: 'Wirkung' }, desc: { en: 'We measure our success by the real change we create on the ground.', ar: 'نقيس نجاحنا بالتغيير الحقيقي الذي نحدثه على أرض الواقع.', de: 'Wir messen unseren Erfolg am realen Wandel.' } },
    { icon: 'Award', title: { en: 'Accountability', ar: 'المساءلة', de: 'Verantwortung' }, desc: { en: 'We uphold the highest standards in humanitarian aid delivery.', ar: 'نلتزم بأعلى المعايير في تقديم المساعدات الإنسانية.', de: 'Wir halten die höchsten Standards in der humanitären Hilfe ein.' } },
  ],
};

async function importAll() {
  console.log('🚀 Starting import...');

  // Hero Slides
  console.log('\n📸 Importing Hero Slides...');
  for (const slide of heroSlides) {
    const result = await client.create(slide);
    console.log(`✅ ${slide.title.en} (${result._id})`);
  }

  // Stats
  console.log('\n📊 Importing Stats...');
  for (const stat of stats) {
    const result = await client.create(stat);
    console.log(`✅ ${stat.label.en} (${result._id})`);
  }

  // Site Settings (singleton)
  console.log('\n⚙️ Importing Site Settings...');
  await client.createOrReplace(siteSettings);
  console.log('✅ Site Settings saved');

  // Team Members
  console.log('\n👥 Importing Team Members...');
  for (const member of teamMembers) {
    const result = await client.create(member);
    console.log(`✅ ${member.name} (${result._id})`);
  }

  // About Content (singleton)
  console.log('\n📖 Importing About Content...');
  await client.createOrReplace(aboutContent);
  console.log('✅ About Content saved');

  console.log('\n🎉 All data imported successfully!');
}

importAll().catch(console.error);