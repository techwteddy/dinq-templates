import { mockRepositories } from "@/repositories/mock";
import { AnalyticsService } from "@/services/analytics-service";
import { AuthService } from "@/services/auth-service";
import { BillingService } from "@/services/billing-service";
import { HabitsService } from "@/services/habits-service";
import { ProfileService } from "@/services/profile-service";
import { SocialService } from "@/services/social-service";

export const services = {
  auth: new AuthService(mockRepositories.auth),
  habits: new HabitsService(mockRepositories.habits),
  profile: new ProfileService(mockRepositories.profile),
  analytics: new AnalyticsService(mockRepositories.analytics),
  social: new SocialService(mockRepositories.social),
  billing: new BillingService(mockRepositories.billing),
};
