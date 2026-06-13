import jsPDF from 'jspdf';
import { logoBase64 } from './logoBase64';

type Donor = {
  id: string;
  name: string;
  email: string;
  amount: number;
  donation_type: string;
  project: string;
  payment_method: string;
  status: string;
  created_at: string;
};

const ORG = {
  name: 'German Humanitarian Relief Organization e.V.',
  address: 'Kulenkampffallee 193, 28213 Bremen',
  email: 'info@ghar-ngo.com',
  phone: '+4915733269715',
  website: 'www.ghar-ngo.com',
  steuernummer: '60/147/03398',
  vereinsregister: 'VR 8792 HB — Amtsgericht Bremen',
  finanzamt: 'Finanzamt Bremen',
  freistellung: '10.03.2026',
  bankName: 'Wise',
  iban: 'BE88 9053 4986 3041',
  bic: 'TRWIBEB1XXX',
  signatory: 'Eman Saad',
};

const TEXTS = {
  de: {
    title: 'Zuwendungsbestaetigung',
    subtitle: 'Bestaetigung ueber Geldzuwendungen',
    invoiceNo: 'Belegnummer',
    date: 'Datum',
    donor: 'Zuwendender',
    name: 'Name',
    email: 'E-Mail',
    amount: 'Betrag der Zuwendung',
    amountWords: 'in Buchstaben',
    donationType: 'Art der Zuwendung',
    once: 'Einmalige Zahlung',
    monthly: 'Monatliche Zahlung',
    paymentMethod: 'Zahlungsweg',
    bank: 'Ueberweisung',
    paypal: 'PayPal',
    project: 'Verwendungszweck',
    legalText: 'Wir sind wegen Foerderung der Hilfe fuer Verfolgte, Fluechtlinge sowie Entwicklungszusammenarbeit nach dem Freistellungsbescheid des Finanzamts Bremen vom {date}, Steuernummer {steuernummer}, von der Koerperschaftsteuer befreit.',
    legalText2: 'Es wird bestaetigt, dass die Zuwendung nur zur Foerderung der gemeinnuetzigen Zwecke verwendet wird. Keine Gegenleistung wurde erbracht.',
    signatureLabel: 'Ort, Datum und Unterschrift des Zuwendungsempfaengers',
    signatoryRole: 'Vorsitzende',
    footerOrg: 'German Humanitarian Relief Organization e.V.',
  },
  en: {
    title: 'Donation Receipt',
    subtitle: 'Confirmation of Monetary Donation',
    invoiceNo: 'Receipt No.',
    date: 'Date',
    donor: 'Donor',
    name: 'Name',
    email: 'Email',
    amount: 'Donation Amount',
    amountWords: 'In words',
    donationType: 'Donation Type',
    once: 'One-time',
    monthly: 'Monthly',
    paymentMethod: 'Payment Method',
    bank: 'Bank Transfer',
    paypal: 'PayPal',
    project: 'Purpose',
    legalText: 'We are exempt from corporate tax by the decision of Finanzamt Bremen dated {date}, tax number {steuernummer}, for promoting humanitarian aid and development cooperation.',
    legalText2: 'It is confirmed that the donation will be used exclusively for the stated charitable purposes. No goods or services were provided in return.',
    signatureLabel: 'Place, Date and Signature of Recipient',
    signatoryRole: 'Chairperson',
    footerOrg: 'German Humanitarian Relief Organization e.V.',
  },
};

function amountToWords(amount: number, lang: 'de' | 'en'): string {
  const ones = lang === 'de'
    ? ['', 'ein', 'zwei', 'drei', 'vier', 'fuenf', 'sechs', 'sieben', 'acht', 'neun',
       'zehn', 'elf', 'zwoelf', 'dreizehn', 'vierzehn', 'fuenfzehn', 'sechzehn',
       'siebzehn', 'achtzehn', 'neunzehn']
    : ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
       'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
       'seventeen', 'eighteen', 'nineteen'];

  const tens = lang === 'de'
    ? ['', '', 'zwanzig', 'dreissig', 'vierzig', 'fuenfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig']
    : ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const hundreds = lang === 'de' ? 'hundert' : 'hundred';
  const thousand = lang === 'de' ? 'tausend' : 'thousand';
  const and = lang === 'de' ? 'und' : 'and';
  const currency = lang === 'de' ? 'Euro' : 'Euros';
  const cents = lang === 'de' ? 'Cent' : 'cents';

  function convertBelow1000(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return one === 0 ? tens[ten] : (lang === 'de' ? `${ones[one]}${and}${tens[ten]}` : `${tens[ten]}-${ones[one]}`);
    }
    const h = Math.floor(n / 100);
    const rest = n % 100;
    const hundredStr = lang === 'de' ? `${ones[h]}${hundreds}` : `${ones[h]} ${hundreds}`;
    return rest === 0 ? hundredStr : `${hundredStr} ${and} ${convertBelow1000(rest)}`;
  }

  const euros = Math.floor(amount);
  const centVal = Math.round((amount - euros) * 100);

  let result = '';
  if (euros >= 1000) {
    const t = Math.floor(euros / 1000);
    const r = euros % 1000;
    result = lang === 'de'
      ? `${convertBelow1000(t)}${thousand}${r > 0 ? convertBelow1000(r) : ''}`
      : `${convertBelow1000(t)} ${thousand}${r > 0 ? ` ${convertBelow1000(r)}` : ''}`;
  } else {
    result = convertBelow1000(euros);
  }

  let final = `${result} ${currency}`;
  if (centVal > 0) {
    final += ` ${and} ${convertBelow1000(centVal)} ${cents}`;
  }

  return final.charAt(0).toUpperCase() + final.slice(1);
}

function generateReceiptNumber(donorId: string, date: string): string {
  const year = new Date(date).getFullYear();
  const shortId = donorId.slice(0, 8).toUpperCase();
  return `GHAR-${year}-${shortId}`;
}

export function generateInvoice(donor: Donor, lang: 'de' | 'en') {
  const t = TEXTS[lang];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const receiptNo = generateReceiptNumber(donor.id, donor.created_at);
  const donationDate = new Date(donor.created_at).toLocaleDateString('de-DE');
  const issueDate = new Date().toLocaleDateString('de-DE');

  const primaryColor: [number, number, number] = [26, 111, 160];
  const darkColor: [number, number, number] = [42, 42, 42];
  const grayColor: [number, number, number] = [100, 100, 100];

// ─── HEADER — WHITE + LOGO ────────────────────────────
doc.setFillColor(255, 255, 255);
doc.rect(0, 0, 210, 32, 'F');

// GHAR Logo image
doc.addImage(logoBase64, 'PNG', 12, 4, 40, 20);

// Org name next to logo
doc.setTextColor(...darkColor);
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('German Humanitarian Relief Organization e.V.', 57, 13);
doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(...grayColor);
doc.text(`Steuernummer: ${ORG.steuernummer} | Vereinsregister: ${ORG.vereinsregister}`, 57, 19);

  // Receipt number top right
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text(`${t.invoiceNo}: ${receiptNo}`, 198, 10, { align: 'right' });
  doc.text(`${t.date}: ${issueDate}`, 198, 16, { align: 'right' });

  // Header bottom border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(12, 30, 198, 30);

  // ─── TITLE ────────────────────────────────────────────
  doc.setTextColor(...primaryColor);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(t.title, 105, 42, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(t.subtitle, 105, 49, { align: 'center' });

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(15, 53, 195, 53);

  // ─── DONOR INFO ───────────────────────────────────────
  let y = 62;

  doc.setFillColor(245, 248, 252);
  doc.roundedRect(15, y - 4, 180, 28, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(t.donor, 20, y + 2);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.text(`${t.name}: ${donor.name}`, 20, y + 9);
  doc.text(`${t.email}: ${donor.email}`, 20, y + 15);
  doc.text(`${t.date}: ${donationDate}`, 110, y + 9);

  // ─── AMOUNT BOX (single box) ──────────────────────────
  y += 36;

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(15, y, 180, 28);

  // Label
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(t.amount, 20, y + 7);

  // Amount in numbers
  doc.setTextColor(...darkColor);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(`EUR ${donor.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, y + 17);

  // Divider line inside box
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(15, y + 20, 195, y + 20);

  // Amount in words
  doc.setTextColor(...grayColor);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.amountWords}: `, 20, y + 26);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'italic');
  const words = amountToWords(donor.amount, lang);
  doc.text(words, 48, y + 26);

  // ─── DETAILS TABLE ────────────────────────────────────
  y += 36;

  const details = [
    [t.donationType, donor.donation_type === 'monthly' ? t.monthly : t.once],
    [t.paymentMethod, donor.payment_method === 'paypal' ? t.paypal : t.bank],
    [t.project, donor.project],
    ['Finanzamt', ORG.finanzamt],
    ['Freistellungsbescheid', ORG.freistellung],
  ];

  details.forEach((row, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 8, 'F');
    }
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text(row[0], 20, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    doc.text(row[1], 100, y + 5.5);
    y += 8;
  });

  // ─── LEGAL TEXT (mandatory) ───────────────────────────
  y += 8;

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(15, y, 195, y);
  y += 7;

  const legalText = t.legalText
    .replace('{date}', ORG.freistellung)
    .replace('{steuernummer}', ORG.steuernummer);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  const splitLegal = doc.splitTextToSize(legalText, 175);
  doc.text(splitLegal, 15, y);
  y += splitLegal.length * 4.5 + 4;

  const splitLegal2 = doc.splitTextToSize(t.legalText2, 175);
  doc.text(splitLegal2, 15, y);
  y += splitLegal2.length * 4.5 + 12;

  // ─── SIGNATURE ────────────────────────────────────────
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.3);
  doc.line(15, y, 90, y);

  doc.setFontSize(7.5);
  doc.setTextColor(...grayColor);
  doc.text(t.signatureLabel, 15, y + 5);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(`Bremen, ${issueDate}`, 15, y + 12);
  doc.text(ORG.signatory, 15, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text(t.signatoryRole, 15, y + 25);

  // ─── BANK DETAILS ─────────────────────────────────────
  doc.setFillColor(245, 248, 252);
  doc.roundedRect(110, y - 3, 85, 35, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Bankverbindung / Bank Details', 152, y + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  doc.text(`Bank: ${ORG.bankName}`, 115, y + 11);
  doc.text(`IBAN: ${ORG.iban}`, 115, y + 17);
  doc.text(`BIC: ${ORG.bic}`, 115, y + 23);

  // ─── FOOTER — ORG INFO ────────────────────────────────
  doc.setFillColor(...primaryColor);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(ORG.name, 105, 286, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`${ORG.address} | ${ORG.email} | ${ORG.website} | ${ORG.phone}`, 105, 292, { align: 'center' });

  return { doc, receiptNo };
}