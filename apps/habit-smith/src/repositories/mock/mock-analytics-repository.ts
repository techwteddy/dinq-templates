import { eachDayOfInterval, endOfWeek, formatISO, startOfWeek, subWeeks } from "date-fns";

import type { AnalyticsRepository } from "@/repositories/interfaces";
import type { DashboardStats, LeaderboardEntry, StreakSummary } from "@/types";
import { mockHabitLogs, mockHabits, mockLeaderboard } from "@/lib/constants/mock-data";
import { buildStreakSummary } from "@/lib/date";

export class MockAnalyticsRepository implements AnalyticsRepository {
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const habits = mockHabits.filter((habit) => habit.userId === userId && !habit.archived);
    const today = formatISO(new Date(), { representation: "date" });
    const completedToday = mockHabitLogs.filter((log) => habits.some((habit) => habit.id === log.habitId) && log.date === today && log.completed).length;

    return {
      activeHabits: habits.length,
      completedToday,
      currentBestStreak: 9,
      completionRate: 78,
    };
  }

  async getStreakSummaries(userId: string): Promise<StreakSummary[]> {
    return mockHabits
      .filter((habit) => habit.userId === userId)
      .map((habit) => buildStreakSummary(habit, mockHabitLogs));
  }

  async getWeeklyTrend(userId: string): Promise<Array<{ date: string; completions: number }>> {
    void userId;
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    const start = startOfWeek(end, { weekStartsOn: 1 });

    return eachDayOfInterval({ start, end }).map((date) => ({
      date: formatISO(date, { representation: "date" }),
      completions: Math.floor(Math.random() * 4) + 1,
    }));
  }

  async getMonthlyTrend(userId: string): Promise<Array<{ week: string; completionRate: number }>> {
    void userId;
    return Array.from({ length: 4 }, (_, idx) => ({
      week: formatISO(subWeeks(new Date(), 3 - idx), { representation: "date" }),
      completionRate: Math.floor(Math.random() * 25) + 65,
    }));
  }

  async getCategoryDistribution(userId: string): Promise<Array<{ category: string; value: number }>> {
    const habits = mockHabits.filter((habit) => habit.userId === userId);
    const map = habits.reduce<Record<string, number>>((acc, habit) => {
      acc[habit.category] = (acc[habit.category] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(map).map(([category, value]) => ({ category, value }));
  }

  async getLeaderboardPreview(userId: string): Promise<LeaderboardEntry[]> {
    void userId;
    return mockLeaderboard.slice(0, 3);
  }
}
