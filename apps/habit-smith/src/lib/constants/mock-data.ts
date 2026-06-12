import { addDays, formatISO, subDays } from "date-fns";

import type {
  ActivityItem,
  Friend,
  Habit,
  HabitLog,
  LeaderboardEntry,
  Profile,
  SubscriptionPlan,
  User,
  UserSubscription,
} from "@/types";

const now = new Date();

export const mockUser: User = {
  id: "user_1",
  email: "alex@habitsmith.app",
  createdAt: formatISO(subDays(now, 80)),
  updatedAt: formatISO(now),
};

export const mockProfile: Profile = {
  userId: mockUser.id,
  displayName: "Alex Carter",
  username: "alexc",
  bio: "Building better routines one day at a time.",
  timezone: "Europe/London",
  reminderPreference: "push",
  privacyLevel: "friends",
  onboardingComplete: false,
};

export const mockHabits: Habit[] = [
  {
    id: "habit_1",
    userId: mockUser.id,
    title: "Deep Work Sprint",
    description: "90 minutes of uninterrupted focus",
    emoji: "{1F4BB}",
    category: "career",
    colour: "#111827",
    frequency: "daily",
    targetCount: 1,
    unit: "session",
    createdAt: formatISO(subDays(now, 45)),
    archived: false,
  },
  {
    id: "habit_2",
    userId: mockUser.id,
    title: "Read",
    description: "Read at least 20 pages",
    emoji: "{1F4DA}",
    category: "reading",
    colour: "#0f766e",
    frequency: "daily",
    targetCount: 20,
    unit: "pages",
    createdAt: formatISO(subDays(now, 30)),
    archived: false,
  },
  {
    id: "habit_3",
    userId: mockUser.id,
    title: "Gym",
    description: "Strength training sessions",
    emoji: "{1F4AA}",
    category: "fitness",
    colour: "#9a3412",
    frequency: "weekly",
    targetCount: 3,
    unit: "sessions",
    createdAt: formatISO(subDays(now, 20)),
    archived: false,
    schedule: { frequency: "weekly", daysOfWeek: [1, 3, 5] },
  },
  {
    id: "habit_4",
    userId: mockUser.id,
    title: "Meditation",
    description: "Mindfulness reset",
    emoji: "{1F9D8}",
    category: "mindfulness",
    colour: "#4338ca",
    frequency: "custom",
    targetCount: 1,
    unit: "session",
    createdAt: formatISO(subDays(now, 12)),
    archived: false,
    schedule: {
      frequency: "custom",
      customDates: Array.from({ length: 14 }, (_, i) => formatISO(addDays(subDays(now, 13), i), { representation: "date" })),
    },
  },
];

const completionPattern = [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1];

export const mockHabitLogs: HabitLog[] = completionPattern.flatMap((complete, index) => {
  const date = formatISO(subDays(now, completionPattern.length - index), { representation: "date" });

  return mockHabits.slice(0, 3).map((habit) => ({
    habitId: habit.id,
    date,
    completed: complete === 1,
    count: complete === 1 ? habit.targetCount : 0,
    notes: complete === 1 ? "Completed on schedule" : "Missed due to travel",
  }));
});

export const mockFriends: Friend[] = [
  { id: "friend_1", displayName: "Maya Lane", username: "mayal", currentStreak: 34, isFollowing: true },
  { id: "friend_2", displayName: "Tom Singh", username: "toms", currentStreak: 22, isFollowing: true },
  { id: "friend_3", displayName: "Priya Das", username: "priyada", currentStreak: 41, isFollowing: false },
  { id: "friend_4", displayName: "Noah Kim", username: "noahk", currentStreak: 16, isFollowing: false },
];

export const mockActivityFeed: ActivityItem[] = [
  {
    id: "activity_1",
    userId: "friend_1",
    username: "mayal",
    description: "Reached a 30-day reading streak",
    createdAt: formatISO(subDays(now, 1)),
  },
  {
    id: "activity_2",
    userId: "friend_2",
    username: "toms",
    description: "Completed all habits for 7 days straight",
    createdAt: formatISO(subDays(now, 2)),
  },
  {
    id: "activity_3",
    userId: mockUser.id,
    username: mockProfile.username,
    description: "Archived the old hydration habit and added Deep Work Sprint",
    createdAt: formatISO(subDays(now, 3)),
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { userId: "friend_3", username: "priyada", displayName: "Priya Das", streak: 41, weeklyCompletions: 23, rank: 1 },
  { userId: "friend_1", username: "mayal", displayName: "Maya Lane", streak: 34, weeklyCompletions: 21, rank: 2 },
  { userId: mockUser.id, username: mockProfile.username, displayName: mockProfile.displayName, streak: 28, weeklyCompletions: 19, rank: 3 },
  { userId: "friend_2", username: "toms", displayName: "Tom Singh", streak: 22, weeklyCompletions: 17, rank: 4 },
  { userId: "friend_4", username: "noahk", displayName: "Noah Kim", streak: 16, weeklyCompletions: 14, rank: 5 },
];

export const mockPlans: SubscriptionPlan[] = [
  {
    id: "plan_free",
    name: "Free",
    tier: "free",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["Up to 5 habits", "Basic analytics", "Limited social"],
  },
  {
    id: "plan_premium",
    name: "Premium",
    tier: "premium",
    priceMonthly: 12,
    priceYearly: 96,
    features: ["Unlimited habits", "Advanced analytics", "Deep insights", "Premium themes"],
  },
];

export const mockSubscription: UserSubscription = {
  userId: mockUser.id,
  tier: "free",
  status: "active",
  billingCycle: "monthly",
  currentPeriodStart: formatISO(subDays(now, 12)),
  currentPeriodEnd: formatISO(addDays(now, 18)),
  cancelAtPeriodEnd: false,
};
