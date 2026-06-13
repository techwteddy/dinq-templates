import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'eg9gx04a',
  dataset: 'ghar',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const projects = [
  {
    _type: 'project',
    title: { en: 'Food Aid Distribution', ar: 'توزيع المساعدات الغذائية', de: 'Nahrungsmittelverteilung' },
    slug: { _type: 'slug', current: 'food-aid-distribution' },
    countryCode: 'YE',
    category: 'Food',
    raised: 8700,
    goal: 15000,
    desc: {
      en: 'Delivering essential food packages to vulnerable families in Yemen facing severe food insecurity and malnutrition.',
      ar: 'تسليم حزم غذائية أساسية للأسر الضعيفة في اليمن التي تعاني من انعدام الأمن الغذائي الحاد وسوء التغذية.',
      de: 'Lieferung von Lebensmittelpaketen an gefährdete Familien im Jemen.',
    },
    details: {
      en: 'Yemen is facing one of the world\'s worst humanitarian crises, with millions of people on the brink of famine. GHAR Organization\'s Food Aid Distribution program delivers monthly food packages to the most vulnerable families.',
      ar: 'يواجه اليمن واحدة من أسوأ الأزمات الإنسانية في العالم، مع ملايين الأشخاص على شفا المجاعة. يوفر برنامج توزيع المساعدات الغذائية لمؤسسة غار حزماً غذائية شهرية للأسر الأكثر ضعفاً.',
      de: 'Der Jemen steht vor einer der schlimmsten humanitären Krisen der Welt. Das Programm liefert monatlich Lebensmittelpakete an die bedürftigsten Familien.',
    },
    impact: ['1,000+ families per month', '6 distribution points across Yemen', '40% female-headed households', 'Zero diversion of aid reported'],
  },
  {
    _type: 'project',
    title: { en: 'Medical Camps', ar: 'المخيمات الطبية', de: 'Medizinische Lager' },
    slug: { _type: 'slug', current: 'medical-camps' },
    countryCode: 'SD',
    category: 'Medical',
    raised: 6200,
    goal: 10000,
    desc: {
      en: 'Providing free medical care and essential medicines in refugee camps across conflict-affected regions in Sudan.',
      ar: 'تقديم رعاية طبية مجانية وأدوية أساسية في مخيمات اللاجئين عبر المناطق المتضررة من النزاعات في السودان.',
      de: 'Kostenlose medizinische Versorgung in Flüchtlingslagern in Sudan.',
    },
    details: {
      en: 'In conflict zones, access to basic healthcare can mean the difference between life and death. GHAR Organization deploys mobile medical teams to refugee camps and remote communities in Sudan.',
      ar: 'في مناطق النزاع، يمكن أن يعني الوصول إلى الرعاية الصحية الأساسية الفرق بين الحياة والموت. تنشر مؤسسة غار فرقاً طبية متنقلة في مخيمات اللاجئين والمجتمعات النائية في السودان.',
      de: 'In Konfliktgebieten kann der Zugang zur Gesundheitsversorgung lebensrettend sein. Mobile Medizinteams versorgen Flüchtlingslager im Sudan.',
    },
    impact: ['800+ patients per campaign', '4 medical camps per year', '300+ children vaccinated', '50+ pregnant women receiving prenatal care'],
  },
  {
    _type: 'project',
    title: { en: 'Education Initiative', ar: 'مبادرة التعليم', de: 'Bildungsinitiative' },
    slug: { _type: 'slug', current: 'education-initiative' },
    countryCode: 'YE',
    category: 'Education',
    raised: 9800,
    goal: 18000,
    desc: {
      en: 'Supporting children\'s right to education by building and equipping schools in conflict zones across Yemen.',
      ar: 'دعم حق الأطفال في التعليم من خلال بناء وتجهيز المدارس في مناطق النزاع عبر اليمن.',
      de: 'Unterstützung des Bildungsrechts von Kindern durch den Aufbau von Schulen in Konfliktgebieten.',
    },
    details: {
      en: 'Conflict has deprived millions of Yemeni children of their right to education. GHAR Organization\'s Education Initiative rebuilds and equips damaged schools, trains and pays teachers\' salaries.',
      ar: 'حرم النزاع ملايين الأطفال اليمنيين من حقهم في التعليم. تعيد مبادرة التعليم لمؤسسة غار بناء وتجهيز المدارس المتضررة وتدريب المعلمين ودفع رواتبهم.',
      de: 'Der Konflikt hat Millionen jemenitischer Kinder ihres Bildungsrechts beraubt. Die Initiative baut Schulen wieder auf und zahlt Lehrergehälter.',
    },
    impact: ['200+ children enrolled', '3 schools rebuilt and equipped', '15 teachers supported', '90% attendance rate achieved'],
  },
  {
    _type: 'project',
    title: { en: 'Emergency Shelter', ar: 'المأوى الطارئ', de: 'Notunterkunft' },
    slug: { _type: 'slug', current: 'emergency-shelter' },
    countryCode: 'SD',
    category: 'Shelter',
    raised: 14000,
    goal: 25000,
    desc: {
      en: 'Building temporary and permanent shelters for families displaced by conflict and natural disasters in Sudan.',
      ar: 'بناء ملاجئ مؤقتة ودائمة للأسر النازحة بسبب النزاعات والكوارث الطبيعية في السودان.',
      de: 'Bau von Notunterkünften für vertriebene Familien im Sudan.',
    },
    details: {
      en: 'Displacement is one of the most devastating consequences of conflict. GHAR Organization\'s Emergency Shelter program provides displaced families with safe, dignified shelter.',
      ar: 'التهجير هو أحد أكثر عواقب النزاع تدميراً. يوفر برنامج المأوى الطارئ لمؤسسة غار ملاجئ آمنة وكريمة للأسر النازحة.',
      de: 'Vertreibung ist eine der verheerendsten Folgen von Konflikten. Das Programm bietet vertriebenen Familien sichere Unterkünfte.',
    },
    impact: ['300+ families sheltered', '50 permanent homes built', '1,200+ people protected', '100% meet humanitarian standards'],
  },
  {
    _type: 'project',
    title: { en: 'Winter Aid Campaign', ar: 'حملة المساعدات الشتوية', de: 'Winterhilfskampagne' },
    slug: { _type: 'slug', current: 'winter-aid-campaign' },
    countryCode: 'YE',
    category: 'Aid',
    raised: 5500,
    goal: 12000,
    desc: {
      en: 'Distributing winter clothing, blankets, and heating supplies to vulnerable families in Yemen during harsh winter months.',
      ar: 'توزيع الملابس الشتوية والبطانيات ومستلزمات التدفئة على الأسر الضعيفة في اليمن خلال أشهر الشتاء القاسية.',
      de: 'Verteilung von Winterkleidung und Heizmaterial an gefährdete Familien im Jemen.',
    },
    details: {
      en: 'Yemen\'s winters can be bitterly cold, especially in mountainous regions, yet millions of displaced families have no warm clothing or heating.',
      ar: 'يمكن أن تكون فصول الشتاء في اليمن باردة جداً، خاصة في المناطق الجبلية، ومع ذلك لا تملك ملايين الأسر النازحة ملابس دافئة أو تدفئة.',
      de: 'Die Winter im Jemen können sehr kalt sein. Millionen vertriebener Familien haben keine warme Kleidung oder Heizung.',
    },
    impact: ['500+ families received winter kits', '2,500+ individuals protected', 'Coverage across 3 governorates', 'Zero cold-related deaths among beneficiaries'],
  },
];

async function importProjects() {
  console.log('Importing projects...');
  for (const project of projects) {
    const result = await client.create(project);
    console.log(`✅ Created: ${project.title.en} (${result._id})`);
  }
  console.log('✅ All projects imported!');
}

importProjects().catch(console.error);