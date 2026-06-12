import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  formatISO,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

import type { Habit, HabitLog, HabitSchedule } from "@/types";

function isScheduledDate(date: Date, schedule?: HabitSchedule): boolean {
  if (!schedule || schedule.frequency === "daily") return true;

  if (schedule.frequency === "weekly") {
    return schedule.daysOfWeek?.includes(date.getDay()) ?? false;
  }

  if (schedule.frequency === "custom") {
    const dateKey = formatISO(date, { representation: "date" });
    return schedule.customDates?.includes(dateKey) ?? false;
  }

  return true;
}

function isCompletedOnDate(habitId: string, date: Date, logs: HabitLog[], targetCount: number): boolean {
  const dateKey = formatISO(date, { representation: "date" });
  const log = logs.find((entry) => entry.habitId === habitId && entry.date === dateKey);
  if (!log) return false;
  return log.completed && log.count >= targetCount;
}

function getScheduledDates(habit: Habit, days: number): Date[] {
  const end = new Date();
  const start = subDays(end, days - 1);

  return eachDayOfInterval({ start, end }).filter((date) => isScheduledDate(date, habit.schedule));
}

export function calculateCurrentStreak(habit: Habit, logs: HabitLog[]): number {
  const scheduledDates = getScheduledDates(habit, 120).reverse();
  let streak = 0;

  for (const date of scheduledDates) {
    if (isSameDay(date, new Date()) || date < new Date()) {
      if (isCompletedOnDate(habit.id, date, logs, habit.targetCount)) {
        streak += 1;
        continue;
      }
      break;
    }
  }

  return streak;
}

export function calculateLongestStreak(habit: Habit, logs: HabitLog[]): number {
  const scheduledDates = getScheduledDates(habit, 365);
  let longest = 0;
  let current = 0;

  for (const date of scheduledDates) {
    if (isCompletedOnDate(habit.id, date, logs, habit.targetCount)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function completionForRange(habit: Habit, logs: HabitLog[], start: Date, end: Date): number {
  const scheduledDates = eachDayOfInterval({ start, end }).filter((date) => isScheduledDate(date, habit.schedule));
  if (!scheduledDates.length) return 0;

  const completed = scheduledDates.filter((date) => isCompletedOnDate(habit.id, date, logs, habit.targetCount)).length;
  return Math.round((completed / scheduledDates.length) * 100);
}

export function calculateWeeklyCompletion(habit: Habit, logs: HabitLog[]): number {
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const start = startOfWeek(end, { weekStartsOn: 1 });
  return completionForRange(habit, logs, start, end);
}

export function calculateMonthlyCompletion(habit: Habit, logs: HabitLog[]): number {
  const now = new Date();
  return completionForRange(habit, logs, startOfMonth(now), endOfMonth(now));
}

export function calculateHabitConsistencyScore(habit: Habit, logs: HabitLog[]): number {
  const current = calculateCurrentStreak(habit, logs);
  const longest = Math.max(calculateLongestStreak(habit, logs), 1);
  const weekly = calculateWeeklyCompletion(habit, logs);
  const monthly = calculateMonthlyCompletion(habit, logs);

  const streakFactor = Math.min(100, Math.round((current / longest) * 100));
  return Math.round(streakFactor * 0.3 + weekly * 0.3 + monthly * 0.4);
}

export function buildStreakSummary(habit: Habit, logs: HabitLog[]) {
  return {
    habitId: habit.id,
    currentStreak: calculateCurrentStreak(habit, logs),
    longestStreak: calculateLongestStreak(habit, logs),
    weeklyCompletion: calculateWeeklyCompletion(habit, logs),
    monthlyCompletion: calculateMonthlyCompletion(habit, logs),
    consistencyScore: calculateHabitConsistencyScore(habit, logs),
  };
}

export function normalizeLogDates(logs: HabitLog[]): HabitLog[] {
  return logs.map((entry) => ({
    ...entry,
    date: formatISO(parseISO(entry.date), { representation: "date" }),
  }));
}
