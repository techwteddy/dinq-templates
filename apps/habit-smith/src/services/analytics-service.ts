import type { AnalyticsRepository } from "@/repositories/interfaces";

export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  getDashboardStats(userId: string) {
    return this.analyticsRepository.getDashboardStats(userId);
  }

  getStreakSummaries(userId: string) {
    return this.analyticsRepository.getStreakSummaries(userId);
  }

  getWeeklyTrend(userId: string) {
    return this.analyticsRepository.getWeeklyTrend(userId);
  }

  getMonthlyTrend(userId: string) {
    return this.analyticsRepository.getMonthlyTrend(userId);
  }

  getCategoryDistribution(userId: string) {
    return this.analyticsRepository.getCategoryDistribution(userId);
  }

  getLeaderboardPreview(userId: string) {
    return this.analyticsRepository.getLeaderboardPreview(userId);
  }
}
