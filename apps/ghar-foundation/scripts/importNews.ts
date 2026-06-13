import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'eg9gx04a',
  dataset: 'ghar',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const news = [
  {
    _type: 'news',
    title: { en: 'GHAR Organization launches new water project in Sudan', ar: 'مؤسسة غار تطلق مشروع مياه جديد في السودان', de: 'GHAR Organization startet neues Wasserprojekt im Sudan' },
    excerpt: { en: 'The new water project aims to provide clean drinking water to over 5,000 families in rural Sudan through solar-powered pumping stations.', ar: 'يهدف مشروع المياه الجديد إلى توفير مياه شرب نظيفة لأكثر من 5000 أسرة في السودان الريفي من خلال محطات ضخ تعمل بالطاقة الشمسية.', de: 'Das neue Wasserprojekt zielt darauf ab, über 5.000 Familien im ländlichen Sudan mit sauberem Trinkwasser zu versorgen.' },
    date: '2026-03-15',
    category: 'Water',
  },
  {
    _type: 'news',
    title: { en: 'Food distribution campaign reaches 1,000 families in Yemen', ar: 'حملة توزيع الغذاء تصل إلى 1000 أسرة في اليمن', de: 'Lebensmittelverteilungskampagne erreicht 1.000 Familien im Jemen' },
    excerpt: { en: 'Our latest food aid campaign successfully distributed emergency food packages to families in the most affected areas of Yemen.', ar: 'وزّعت حملة المساعدات الغذائية الأخيرة بنجاح حزم غذائية طارئة على الأسر في أكثر المناطق تضرراً في اليمن.', de: 'Unsere neueste Lebensmittelhilfekampagne hat erfolgreich Notfalllebensmittelpakete an Familien in den am stärksten betroffenen Gebieten des Jemen verteilt.' },
    date: '2026-02-20',
    category: 'Food',
  },
  {
    _type: 'news',
    title: { en: 'Medical camp serves 800 patients in refugee camp', ar: 'مخيم طبي يخدم 800 مريض في مخيم للاجئين', de: 'Medizinisches Lager versorgt 800 Patienten in Flüchtlingslager' },
    excerpt: { en: 'GHAR Organization\'s mobile medical team provided free consultations, medicines and emergency care to hundreds of patients.', ar: 'قدّم الفريق الطبي المتنقل لمؤسسة غار استشارات مجانية وأدوية ورعاية طارئة لمئات المرضى.', de: 'Das mobile Medizinteam der GHAR Organization bot Hunderten von Patienten kostenlose Beratung, Medikamente und Notfallversorgung.' },
    date: '2026-01-10',
    category: 'Medical',
  },
  {
    _type: 'news',
    title: { en: 'New school opens its doors for 200 children', ar: 'مدرسة جديدة تفتح أبوابها لـ 200 طفل', de: 'Neue Schule öffnet ihre Türen für 200 Kinder' },
    excerpt: { en: 'Thanks to the generous support of our donors, a new school has been built providing quality education to 200 children in conflict zones.', ar: 'بفضل الدعم السخي من المانحين، تم بناء مدرسة جديدة توفر تعليماً عالي الجودة لـ 200 طفل في مناطق النزاع.', de: 'Dank der großzügigen Unterstützung unserer Spender wurde eine neue Schule gebaut, die 200 Kindern in Konfliktgebieten eine hochwertige Bildung bietet.' },
    date: '2025-12-05',
    category: 'Education',
  },
  {
    _type: 'news',
    title: { en: 'Emergency shelter project completed in Sudan', ar: 'مشروع المأوى الطارئ يكتمل في السودان', de: 'Notunterkunftsprojekt im Sudan abgeschlossen' },
    excerpt: { en: 'GHAR Organization has successfully completed the construction of 50 permanent homes for displaced families in Sudan.', ar: 'أتمّت مؤسسة غار بنجاح بناء 50 منزلاً دائماً للأسر النازحة في السودان.', de: 'Die GHAR Organization hat erfolgreich den Bau von 50 Dauerhäusern für vertriebene Familien im Sudan abgeschlossen.' },
    date: '2025-11-18',
    category: 'Shelter',
  },
  {
    _type: 'news',
    title: { en: 'Winter aid campaign kicks off in Yemen', ar: 'حملة المساعدات الشتوية تنطلق في اليمن', de: 'Winterhilfskampagne startet im Jemen' },
    excerpt: { en: 'As temperatures drop, GHAR Organization begins distributing winter kits to vulnerable families across three governorates in Yemen.', ar: 'مع انخفاض درجات الحرارة، تبدأ مؤسسة غار في توزيع مجموعات الشتاء على الأسر الضعيفة في ثلاث محافظات في اليمن.', de: 'Mit sinkenden Temperaturen beginnt die GHAR Organization, Winterpakete an gefährdete Familien in drei Gouvernoraten im Jemen zu verteilen.' },
    date: '2025-10-30',
    category: 'Aid',
  },
  {
    _type: 'news',
    title: { en: 'GHAR Organization receives recognition from German authorities', ar: 'مؤسسة غار تحصل على اعتراف من السلطات الألمانية', de: 'GHAR Organization erhält Anerkennung von deutschen Behörden' },
    excerpt: { en: 'The foundation has been officially recognized by German humanitarian authorities for its transparent operations and effective aid delivery.', ar: 'حصلت المؤسسة على اعتراف رسمي من السلطات الإنسانية الألمانية لعملياتها الشفافة وتقديم المساعدات الفعّال.', de: 'Die Stiftung wurde von deutschen humanitären Behörden für ihren transparenten Betrieb und effektive Hilfsleistung offiziell anerkannt.' },
    date: '2025-09-12',
    category: 'News',
  },
  {
    _type: 'news',
    title: { en: 'Partnership signed with local organizations in Sudan', ar: 'توقيع شراكة مع منظمات محلية في السودان', de: 'Partnerschaft mit lokalen Organisationen im Sudan unterzeichnet' },
    excerpt: { en: 'A new partnership agreement has been signed with three local organizations in Sudan to strengthen our presence and reach on the ground.', ar: 'تم توقيع اتفاقية شراكة جديدة مع ثلاث منظمات محلية في السودان لتعزيز حضورنا وتوسيع نطاق عملنا.', de: 'Eine neue Partnerschaftsvereinbarung wurde mit drei lokalen Organisationen im Sudan unterzeichnet.' },
    date: '2025-08-03',
    category: 'News',
  },
  {
    _type: 'news',
    title: { en: 'Clean water project phase 2 begins', ar: 'المرحلة الثانية من مشروع المياه النظيفة تبدأ', de: 'Phase 2 des Sauberwasserprojekts beginnt' },
    excerpt: { en: 'Following the success of phase 1, GHAR Organization has launched phase 2 of the clean water project, targeting 8 additional villages.', ar: 'في أعقاب نجاح المرحلة الأولى، أطلقت مؤسسة غار المرحلة الثانية من مشروع المياه النظيفة، مستهدفةً 8 قرى إضافية.', de: 'Nach dem Erfolg von Phase 1 hat die GHAR Organization Phase 2 des Sauberwasserprojekts gestartet.' },
    date: '2025-07-20',
    category: 'Water',
  },
  {
    _type: 'news',
    title: { en: 'Ramadan food campaign distributes 2,000 packages', ar: 'حملة رمضان الغذائية توزع 2000 حزمة', de: 'Ramadan-Lebensmittelkampagne verteilt 2.000 Pakete' },
    excerpt: { en: 'During Ramadan 2025, GHAR Organization distributed 2,000 food packages to families in Sudan and Yemen.', ar: 'خلال رمضان 2025، وزّعت مؤسسة غار 2000 حزمة غذائية على الأسر في السودان واليمن.', de: 'Während des Ramadan 2025 verteilte die GHAR Organization 2.000 Lebensmittelpakete an Familien im Sudan und Jemen.' },
    date: '2025-03-25',
    category: 'Food',
  },
  {
    _type: 'news',
    title: { en: 'Medical training program launched for local health workers', ar: 'إطلاق برنامج تدريب طبي للعاملين الصحيين المحليين', de: 'Medizinisches Ausbildungsprogramm für lokale Gesundheitshelfer gestartet' },
    excerpt: { en: 'A new training program has been launched to build local capacity in basic healthcare delivery in remote areas of Sudan.', ar: 'تم إطلاق برنامج تدريبي جديد لبناء القدرات المحلية في تقديم الرعاية الصحية الأساسية في المناطق النائية بالسودان.', de: 'Ein neues Ausbildungsprogramm wurde gestartet, um lokale Kapazitäten in der Grundversorgung im Sudan aufzubauen.' },
    date: '2025-02-14',
    category: 'Medical',
  },
  {
    _type: 'news',
    title: { en: 'GHAR Organization celebrates its first anniversary', ar: 'مؤسسة غار تحتفل بذكراها السنوية الأولى', de: 'GHAR Organization feiert ihren ersten Jahrestag' },
    excerpt: { en: 'One year after its founding, GHAR Organization reflects on its achievements and looks ahead to an ambitious year of growth and impact.', ar: 'بعد عام من تأسيسها، تتأمل مؤسسة غار إنجازاتها وتتطلع إلى عام طموح من النمو والتأثير.', de: 'Ein Jahr nach ihrer Gründung blickt die GHAR Organization auf ihre Erfolge zurück.' },
    date: '2025-01-01',
    category: 'News',
  },
];

async function importNews() {
  console.log('Importing news...');
  for (const item of news) {
    const result = await client.create(item);
    console.log(`✅ Created: ${item.title.en} (${result._id})`);
  }
  console.log('✅ All news imported!');
}

importNews().catch(console.error);