import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateInvoice } from '@/lib/generateInvoice';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verifyPayPalWebhook(req: NextRequest, _body: string): Promise<boolean> {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  return secret === process.env.PAYPAL_WEBHOOK_SECRET;
}

async function sendInvoiceEmail(donor: {
  id: string;
  name: string;
  email: string;
  amount: number;
  donation_type: string;
  project: string;
  payment_method: string;
  status: string;
  created_at: string;
}) {
  try {
    const { doc, receiptNo } = generateInvoice(donor, 'de');
    const pdfBlob = doc.output('blob');
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `GHAR-Receipt-${receiptNo}.pdf`);
    formData.append('email', donor.email);
    formData.append('name', donor.name);
    formData.append('lang', 'de');
    formData.append('receiptNo', receiptNo);
    formData.append('amount', donor.amount.toString());

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-invoice`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Send invoice error:', error);
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    // التحقق من صحة الـ Webhook
    const isValid = await verifyPayPalWebhook(req, body);
    if (!isValid) {
      console.error('Invalid PayPal webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;

    console.log('PayPal Webhook event:', eventType);

    // One-time donation completed
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'PAYMENT.SALE.COMPLETED') {
      const amount = parseFloat(event.resource?.amount?.value ||
                                event.resource?.amount?.total || '0');

      // البحث عن التبرع في Supabase
      const { data: donors } = await supabase
        .from('donors')
        .select('*')
        .eq('status', 'pending')
        .eq('payment_method', 'paypal')
        .gte('amount', amount - 1)
        .lte('amount', amount + 1)
        .order('created_at', { ascending: false })
        .limit(1);

      if (donors && donors.length > 0) {
        const donor = donors[0];
        await supabase
          .from('donors')
          .update({ status: 'completed' })
          .eq('id', donor.id);

        await sendInvoiceEmail(donor);
      }
    }

    // Monthly subscription activated
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const { data: donors } = await supabase
        .from('donors')
        .select('*')
        .eq('status', 'pending')
        .eq('payment_method', 'paypal')
        .eq('donation_type', 'monthly')
        .order('created_at', { ascending: false })
        .limit(1);

      if (donors && donors.length > 0) {
        const donor = donors[0];
        await supabase
          .from('donors')
          .update({ status: 'completed' })
          .eq('id', donor.id);

        await sendInvoiceEmail(donor);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}