import type { BillingRepository } from "@/repositories/interfaces";

export class BillingService {
  constructor(private readonly billingRepository: BillingRepository) {}

  getPlans() {
    return this.billingRepository.getPlans();
  }

  getSubscription(userId: string) {
    return this.billingRepository.getSubscription(userId);
  }

  createCheckoutSession(userId: string, planId: string) {
    return this.billingRepository.createCheckoutSession(userId, planId);
  }

  cancelSubscription(userId: string) {
    return this.billingRepository.cancelSubscription(userId);
  }
}
