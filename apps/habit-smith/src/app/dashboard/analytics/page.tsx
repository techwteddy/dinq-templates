"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/shared/chart-card";
import { EmptyState } from "@/components/shared/empty-state";
import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import type { StreakSummary } from "@/types";

const categoryColors = ["#111827", "#1f2937", "#374151", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"];

export default function AnalyticsPage() {
  const session = useSessionStore((state) => state.session);
  const userId = session?.user.id ?? "";

  const [weeklyTrend, setWeeklyTrend] = useState<Array<{ date: string; completions: number }>>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<Array<{ week: string; completionRate: number }>>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<Array<{ category: string; value: number }>>([]);
  const [streakSummaries, setStreakSummaries] = useState<StreakSummary[]>([]);

  useEffect(() => {
    if (!userId) return;

    let active = true;

    void (async () => {
      const [weekly, monthly, distribution, streaks] = await Promise.all([
        services.analytics.getWeeklyTrend(userId),
        services.analytics.getMonthlyTrend(userId),
        services.analytics.getCategoryDistribution(userId),
        services.analytics.getStreakSummaries(userId),
      ]);

      if (!active) return;

      setWeeklyTrend(weekly);
      setMonthlyTrend(monthly);
      setCategoryDistribution(distribution);
      setStreakSummaries(streaks);
    })();

    return () => {
      active = false;
    };
  }, [userId]);

  const strongestHabit = useMemo(
    () => streakSummaries.slice().sort((a, b) => b.consistencyScore - a.consistencyScore)[0],
    [streakSummaries],
  );

  const weakestHabit = useMemo(
    () => streakSummaries.slice().sort((a, b) => a.consistencyScore - b.consistencyScore)[0],
    [streakSummaries],
  );

  const consistencyScore = useMemo(() => {
    if (!streakSummaries.length) return 0;
    const total = streakSummaries.reduce((sum, item) => sum + item.consistencyScore, 0);
    return Math.round(total / streakSummaries.length);
  }, [streakSummaries]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-600">Monitor completion trends, streak momentum, and consistency insights.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Completion Trend" subtitle="Daily completions in the current week.">
          {weeklyTrend.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="completions" stroke="#111827" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No completion data" description="Start logging habit completions to populate this chart." />
          )}
        </ChartCard>

        <ChartCard title="Streak Trend" subtitle="Weekly completion rate trajectory.">
          {monthlyTrend.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="completionRate" stroke="#0f766e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No streak trend data" description="Use your habits consistently to unlock this trend." />
          )}
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Category Distribution" subtitle="Active habit split by category.">
          {categoryDistribution.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="category" outerRadius={90} label>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={entry.category} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No category data" description="Create habits to see distribution by category." />
          )}
        </ChartCard>

        <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Consistency Insights</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-zinc-100 p-4">
              <p className="text-xs text-zinc-500">Overall Score</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{consistencyScore}%</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4">
              <p className="text-xs text-zinc-500">Strongest Habit</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{strongestHabit?.habitId ?? "-"}</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4">
              <p className="text-xs text-zinc-500">Weakest Habit</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{weakestHabit?.habitId ?? "-"}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {streakSummaries.map((summary) => (
              <div key={summary.habitId} className="rounded-xl border border-zinc-100 px-3 py-2 text-sm">
                <p className="font-medium text-zinc-900">{summary.habitId}</p>
                <p className="text-xs text-zinc-500">
                  Current: {summary.currentStreak} · Longest: {summary.longestStreak} · Weekly: {summary.weeklyCompletion}%
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
