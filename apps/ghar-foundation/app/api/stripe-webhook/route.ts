import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  if (
    event.type === "payment_intent.succeeded" ||
    event.type === "invoice.payment_succeeded"
  ) {
    const object = event.data.object as Stripe.PaymentIntent | Stripe.Invoice;
    const donorId = object.metadata?.donorId;

    if (donorId) {
      // جلب بيانات المتبرع
      const { data: donor } = await supabase
        .from("donors")
        .select("*")
        .eq("id", donorId)
        .single();

      // تحديث الـ status
      await supabase
        .from("donors")
        .update({ status: "completed", paypal_tx_id: object.id })
        .eq("id", donorId);

      // إرسال الفاتورة تلقائياً
      if (donor) {
        try {
          const { generateInvoice } = await import('@/lib/generateInvoice');
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
        } catch (_error) {
          console.error('Failed to send invoice:', _error);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}