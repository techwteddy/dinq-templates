import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { amount, email, name, donorId } = await req.json();

    // إنشاء أو جلب الـ customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];
    if (!customer) {
      customer = await stripe.customers.create({ email, name });
    }

    // إنشاء الـ price ديناميكياً
    const price = await stripe.prices.create({
      unit_amount: Math.round(amount * 100),
      currency: "eur",
      recurring: { interval: "month" },
      product_data: { name: "GHAR Monthly Donation" },
    });

    // إنشاء الـ subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: { donorId },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice & {
      payment_intent: Stripe.PaymentIntent;
    };
    const paymentIntent = invoice.payment_intent;

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}