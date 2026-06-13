import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'eg9gx04a',
  dataset: 'ghar',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const privacyContent = {
  _type: 'privacyContent',
  _id: 'privacyContent',
  lastUpdated: 'March 2026',
  contentEn: `GHAR Organization is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal data in accordance with the EU General Data Protection Regulation (GDPR).

1. Data Controller
GHAR Organization, Kullenkampffallee 193, 28217 Bremen, Germany. Email: info@ghar-ngo.com

2. Data We Collect
We collect personal data you provide when donating (name, email, amount), volunteering (name, email, phone, country, specialty), or contacting us via our contact form.

3. How We Use Your Data
We use your data to process donations, send confirmation emails, manage volunteer applications, and respond to your inquiries. We do not sell or share your data with third parties for marketing purposes.

4. Cookies
We use essential cookies to ensure the website functions properly. We also use analytics cookies to understand how visitors use our site. You can accept or decline cookies via the cookie banner.

5. Data Storage
Your data is stored securely on Supabase servers located in Frankfurt, Germany (EU). We retain your data for as long as necessary to fulfill the purposes described in this policy.

6. Your Rights
Under GDPR, you have the right to access, correct, delete, or export your personal data. You may also object to processing or withdraw consent at any time. Contact us at info@ghar-ngo.com to exercise your rights.

7. Third-Party Services
We use PayPal for donation processing and Resend for email delivery. These services have their own privacy policies. We also use Vercel for hosting and Sanity for content management.

8. Contact
For any privacy-related questions, contact us at: info@ghar-ngo.com or write to GHAR Organization, Kullenkampffallee 193, 28217 Bremen, Germany.`,

  contentAr: `تلتزم مؤسسة غار بحماية خصوصيتك. توضح هذه السياسة كيفية جمع بياناتك الشخصية واستخدامها وحمايتها وفقاً للائحة الأوروبية العامة لحماية البيانات (GDPR).

1. المتحكم في البيانات
مؤسسة غار، Kullenkampffallee 193، 28217 بريمن، ألمانيا. البريد الإلكتروني: info@ghar-ngo.com

2. البيانات التي نجمعها
نجمع البيانات الشخصية التي تقدمها عند التبرع (الاسم، البريد الإلكتروني، المبلغ)، أو التطوع، أو التواصل معنا.

3. كيف نستخدم بياناتك
نستخدم بياناتك لمعالجة التبرعات وإرسال رسائل تأكيد وإدارة طلبات التطوع والرد على استفساراتك. لا نبيع بياناتك لأطراف ثالثة.

4. ملفات تعريف الارتباط
نستخدم ملفات تعريف الارتباط الأساسية لضمان عمل الموقع بشكل صحيح. يمكنك قبول أو رفض ملفات تعريف الارتباط عبر شريط الموافقة.

5. تخزين البيانات
تُخزّن بياناتك بأمان على خوادم Supabase في فرانكفورت، ألمانيا (الاتحاد الأوروبي).

6. حقوقك
بموجب GDPR، لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها وحذفها. تواصل معنا على info@ghar-ngo.com لممارسة حقوقك.

7. خدمات الطرف الثالث
نستخدم PayPal لمعالجة التبرعات وResend لتسليم البريد الإلكتروني وVercel للاستضافة وSanity لإدارة المحتوى.

8. التواصل
لأي أسئلة متعلقة بالخصوصية، تواصل معنا على: info@ghar-ngo.com`,

  contentDe: `Die GHAR Organization verpflichtet sich zum Schutz Ihrer Privatsphäre. Diese Richtlinie erläutert, wie wir Ihre personenbezogenen Daten gemäß der EU-Datenschutz-Grundverordnung (DSGVO) erheben, verwenden und schützen.

1. Verantwortlicher
GHAR Organization, Kullenkampffallee 193, 28217 Bremen, Deutschland. E-Mail: info@ghar-ngo.com

2. Erhobene Daten
Wir erheben personenbezogene Daten, die Sie beim Spenden (Name, E-Mail, Betrag), bei der Freiwilligenarbeit oder beim Kontakt über unser Formular angeben.

3. Verwendung Ihrer Daten
Wir verwenden Ihre Daten zur Spendenverarbeitung, zum Versand von Bestätigungs-E-Mails und zur Bearbeitung von Freiwilligenanfragen. Wir verkaufen Ihre Daten nicht an Dritte.

4. Cookies
Wir verwenden notwendige Cookies für die Funktionalität der Website. Sie können Cookies über das Cookie-Banner akzeptieren oder ablehnen.

5. Datenspeicherung
Ihre Daten werden sicher auf Supabase-Servern in Frankfurt, Deutschland (EU) gespeichert.

6. Ihre Rechte
Gemäß DSGVO haben Sie das Recht auf Zugang, Berichtigung und Löschung Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter info@ghar-ngo.com.

7. Drittanbieter-Dienste
Wir nutzen PayPal für die Spendenverarbeitung, Resend für E-Mail-Zustellung, Vercel für Hosting und Sanity für Content-Management.

8. Kontakt
Bei datenschutzbezogenen Fragen kontaktieren Sie uns unter: info@ghar-ngo.com oder GHAR Organization, Kullenkampffallee 193, 28217 Bremen.`,
};

async function importPrivacy() {
  console.log('Importing privacy content...');
  await client.createOrReplace(privacyContent);
  console.log('✅ Privacy content imported!');
}

importPrivacy().catch(console.error);