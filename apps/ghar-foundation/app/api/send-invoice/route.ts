import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdf = formData.get('pdf') as Blob;
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const lang = formData.get('lang') as string;
    const receiptNo = formData.get('receiptNo') as string;
    const amount = formData.get('amount') as string;

    const pdfBuffer = Buffer.from(await pdf.arrayBuffer());

    const subject = lang === 'de'
      ? `Ihre Spendenbestätigung – ${receiptNo}`
      : `Your Donation Receipt – ${receiptNo}`;

    const greeting = lang === 'de'
      ? `Sehr geehrte/r ${name},`
      : `Dear ${name},`;

    const body = lang === 'de'
      ? `vielen Dank für Ihre großzügige Spende in Höhe von €${amount} an die German Humanitarian Relief Organization e.V. Im Anhang finden Sie Ihre offizielle Zuwendungsbestätigung. Diese kann für steuerliche Zwecke verwendet werden. Bei Fragen stehen wir Ihnen gerne zur Verfügung.`
      : `Thank you for your generous donation of €${amount} to German Humanitarian Relief Organization e.V. Please find your official donation receipt attached. This receipt can be used for tax purposes. If you have any questions, please do not hesitate to contact us.`;

    const closing = lang === 'de'
      ? `Mit freundlichen Grüßen,\nGerman Humanitarian Relief Organization e.V.\ninfo@ghar-ngo.com`
      : `Kind regards,\nGerman Humanitarian Relief Organization e.V.\ninfo@ghar-ngo.com`;

    await resend.emails.send({
      from: 'GHAR Organization <info@ghar-ngo.com>',
      to: email,
      subject,
      text: `${greeting}\n\n${body}\n\n${closing}`,
      attachments: [
        {
          filename: `GHAR-Receipt-${receiptNo}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send invoice error:', error);
    return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 });
  }
}