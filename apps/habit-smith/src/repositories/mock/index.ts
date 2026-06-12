import { MockAnalyticsRepository } from "@/repositories/mock/mock-analytics-repository";
import { MockAuthRepository } from "@/repositories/mock/mock-auth-repository";
import { MockBillingRepository } from "@/repositories/mock/mock-billing-repository";
import { MockHabitRepository } from "@/repositories/mock/mock-habit-repository";
import { MockProfileRepository } from "@/repositories/mock/mock-profile-repository";
import { MockSocialRepository } from "@/repositories/mock/mock-social-repository";

export const mockRepositories = {
  auth: new MockAuthRepository(),
  habits: new MockHabitRepository(),
  profile: new MockProfileRepository(),
  analytics: new MockAnalyticsRepository(),
  social: new MockSocialRepository(),
  billing: new MockBillingRepository(),
};
