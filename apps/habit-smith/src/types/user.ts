import type { PrivacyLevel, ReminderPreference } from "@/types/shared";

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  userId: string;
  displayName: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  timezone: string;
  reminderPreference: ReminderPreference;
  privacyLevel: PrivacyLevel;
  onboardingComplete: boolean;
}
