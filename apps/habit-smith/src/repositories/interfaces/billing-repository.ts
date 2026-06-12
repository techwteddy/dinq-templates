import type { SubscriptionPlan, UserSubscription } from "@/types";

export interface BillingRepository {
  getPlans(): Promise<SubscriptionPlan[]>;
  getSubscription(userId: string): Promise<UserSubscription>;
  createCheckoutSession(userId: string, planId: string): Promise<{ checkoutUrl: string }>;
  cancelSubscription(userId: string): Promise<void>;
}
