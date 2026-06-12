import type { Profile } from "@/types";

export interface ProfileRepository {
  getProfile(userId: string): Promise<Profile | null>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile>;
}
