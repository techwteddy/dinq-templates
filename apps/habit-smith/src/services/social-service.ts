import type { SocialRepository } from "@/repositories/interfaces";

export class SocialService {
  constructor(private readonly socialRepository: SocialRepository) {}

  getFriends(userId: string) {
    return this.socialRepository.getFriends(userId);
  }

  searchUsers(query: string) {
    return this.socialRepository.searchUsers(query);
  }

  followUser(userId: string, friendId: string) {
    return this.socialRepository.followUser(userId, friendId);
  }

  getActivityFeed(userId: string) {
    return this.socialRepository.getActivityFeed(userId);
  }

  getLeaderboard(userId: string) {
    return this.socialRepository.getLeaderboard(userId);
  }
}
