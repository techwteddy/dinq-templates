import Stripe from "stripe";

export function createStripeServerClient() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(secret, {
    apiVersion: "2025-02-24.acacia",
    appInfo: {
      name: "HabitSmith",
      version: "0.1.0",
    },
  });
}
