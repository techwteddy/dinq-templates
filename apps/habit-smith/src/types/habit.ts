import type { HabitCategory, HabitFrequency } from "@/types/shared";

export interface HabitSchedule {
  frequency: HabitFrequency;
  daysOfWeek?: number[];
  customDates?: string[];
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  emoji: string;
  category: HabitCategory;
  colour: string;
  frequency: HabitFrequency;
  targetCount: number;
  unit: string;
  createdAt: string;
  archived: boolean;
  schedule?: HabitSchedule;
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  count: number;
  notes?: string;
}

export interface StreakSummary {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  weeklyCompletion: number;
  monthlyCompletion: number;
  consistencyScore: number;
}

export interface DashboardStats {
  activeHabits: number;
  completedToday: number;
  currentBestStreak: number;
  completionRate: number;
}
