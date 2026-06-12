import type { ProfileRepository } from "@/repositories/interfaces";
import type { Profile } from "@/types";

export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  getProfile(userId: string) {
    return this.profileRepository.getProfile(userId);
  }

  updateProfile(userId: string, updates: Partial<Profile>) {
    return this.profileRepository.updateProfile(userId, updates);
  }
}
