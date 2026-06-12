import type { ProfileRepository } from "@/repositories/interfaces";
import type { Profile } from "@/types";
import { mockProfile } from "@/lib/constants/mock-data";

export class MockProfileRepository implements ProfileRepository {
  async getProfile(userId: string): Promise<Profile | null> {
    if (mockProfile.userId !== userId) return null;
    return { ...mockProfile };
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    if (mockProfile.userId !== userId) {
      throw new Error("Profile not found");
    }

    Object.assign(mockProfile, updates);
    return { ...mockProfile };
  }
}
