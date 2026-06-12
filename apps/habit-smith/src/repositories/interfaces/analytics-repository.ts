import type { DashboardStats, LeaderboardEntry, StreakSummary } from "@/types";

export interface AnalyticsRepository {
  getDashboardStats(userId: string): Promise<DashboardStats>;
  getStreakSummaries(userId: string): Promise<StreakSummary[]>;
  getWeeklyTrend(userId: string): Promise<Array<{ date: string; completions: number }>>;
  getMonthlyTrend(userId: string): Promise<Array<{ week: string; completionRate: number }>>;
  getCategoryDistribution(userId: string): Promise<Array<{ category: string; value: number }>>;
  getLeaderboardPreview(userId: string): Promise<LeaderboardEntry[]>;
}
