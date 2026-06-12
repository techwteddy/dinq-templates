/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AnalyticsRepository,
  BillingRepository,
  ProfileRepository,
  SocialRepository,
} from "@/repositories/interfaces";
import type {
  ActivityItem,
  DashboardStats,
  Friend,
  LeaderboardEntry,
  Profile,
  StreakSummary,
  SubscriptionPlan,
  UserSubscription,
} from "@/types";

export class SupabaseProfileRepository implements ProfileRepository {
  async getProfile(_userId: string): Promise<Profile | null> {
    throw new Error("SupabaseProfileRepository.getProfile not implemented");
  }

  async updateProfile(_userId: string, _updates: Partial<Profile>): Promise<Profile> {
    throw new Error("SupabaseProfileRepository.updateProfile not implemented");
  }
}

export class SupabaseAnalyticsRepository implements AnalyticsRepository {
  async getDashboardStats(_userId: string): Promise<DashboardStats> {
    throw new Error("SupabaseAnalyticsRepository.getDashboardStats not implemented");
  }

  async getStreakSummaries(_userId: string): Promise<StreakSummary[]> {
    throw new Error("SupabaseAnalyticsRepository.getStreakSummaries not implemented");
  }

  async getWeeklyTrend(_userId: string): Promise<Array<{ date: string; completions: number }>> {
    throw new Error("SupabaseAnalyticsRepository.getWeeklyTrend not implemented");
  }

  async getMonthlyTrend(_userId: string): Promise<Array<{ week: string; completionRate: number }>> {
    throw new Error("SupabaseAnalyticsRepository.getMonthlyTrend not implemented");
  }

  async getCategoryDistribution(_userId: string): Promise<Array<{ category: string; value: number }>> {
    throw new Error("SupabaseAnalyticsRepository.getCategoryDistribution not implemented");
  }

  async getLeaderboardPreview(_userId: string): Promise<LeaderboardEntry[]> {
    throw new Error("SupabaseAnalyticsRepository.getLeaderboardPreview not implemented");
  }
}

export class SupabaseSocialRepository implements SocialRepository {
  async getFriends(_userId: string): Promise<Friend[]> {
    throw new Error("SupabaseSocialRepository.getFriends not implemented");
  }

  async searchUsers(_query: string): Promise<Friend[]> {
    throw new Error("SupabaseSocialRepository.searchUsers not implemented");
  }

  async followUser(_userId: string, _friendId: string): Promise<void> {
    throw new Error("SupabaseSocialRepository.followUser not implemented");
  }

  async getActivityFeed(_userId: string): Promise<ActivityItem[]> {
    throw new Error("SupabaseSocialRepository.getActivityFeed not implemented");
  }

  async getLeaderboard(_userId: string): Promise<LeaderboardEntry[]> {
    throw new Error("SupabaseSocialRepository.getLeaderboard not implemented");
  }
}

export class SupabaseBillingRepository implements BillingRepository {
  async getPlans(): Promise<SubscriptionPlan[]> {
    throw new Error("SupabaseBillingRepository.getPlans not implemented");
  }

  async getSubscription(_userId: string): Promise<UserSubscription> {
    throw new Error("SupabaseBillingRepository.getSubscription not implemented");
  }

  async createCheckoutSession(_userId: string, _planId: string): Promise<{ checkoutUrl: string }> {
    throw new Error("SupabaseBillingRepository.createCheckoutSession not implemented");
  }

  async cancelSubscription(_userId: string): Promise<void> {
    throw new Error("SupabaseBillingRepository.cancelSubscription not implemented");
  }
}
