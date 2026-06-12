"use client";

import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, ListTodo } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PremiumUpgradeCard } from "@/components/billing/premium-upgrade-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StreakCard } from "@/components/dashboard/streak-card";
import { HabitCard } from "@/components/habits/habit-card";
import { ChartCard } from "@/components/shared/chart-card";
import { ActivityFeed } from "@/components/social/activity-feed";
import { LeaderboardList } from "@/components/social/leaderboard-list";
import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import type { ActivityItem, DashboardStats, Habit, HabitLog, LeaderboardEntry } from "@/types";

const EMPTY_STATS: DashboardStats = {
  activeHabits: 0,
  completedToday: 0,
  currentBestStreak: 0,
  completionRate: 0,
};

export function DashboardOverview() {
  const session = useSessionStore((state) => state.session);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<Array<{ date: string; completions: number }>>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user.id) return;

      const userId = session.user.id;
      const [nextStats, nextHabits, nextLogs, nextWeekly, nextActivity, nextLeaderboard] = await Promise.all([
        services.analytics.getDashboardStats(userId),
        services.habits.getHabits(userId),
        services.habits.getHabitLogs(userId),
        services.analytics.getWeeklyTrend(userId),
        services.social.getActivityFeed(userId),
        services.analytics.getLeaderboardPreview(userId),
      ]);

      setStats(nextStats);
      setHabits(nextHabits.filter((habit) => !habit.archived));
      setLogs(nextLogs);
      setWeeklyTrend(nextWeekly);
      setActivity(nextActivity);
      setLeaderboard(nextLeaderboard);
    };

    void loadData();
  }, [session?.user.id]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Habits" value={stats.activeHabits} icon={<ListTodo className="h-4 w-4" />} />
        <StatCard title="Completed Today" value={stats.completedToday} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard title="Consistency" value={`${stats.completionRate}%`} icon={<BarChart3 className="h-4 w-4" />} />
        <StreakCard title="Best Streak" current={stats.currentBestStreak} longest={42} />
      </div>

      <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Today&apos;s Habits</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {habits.slice(0, 6).map((habit) => (
            <HabitCard key={habit.id} habit={habit} logs={logs} />
          ))}
        </div>
      </section>

      <div className="grid gap-5">
        <ChartCard title="Weekly Completion" subtitle="Daily completions over the last 7 days.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="completions" stroke="#111827" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityFeed items={activity} />
        </div>
        <LeaderboardList entries={leaderboard} />
      </div>

      <div className="grid gap-4">
        <PremiumUpgradeCard />
      </div>
    </div>
  );
}
