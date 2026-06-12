import type { SocialRepository } from "@/repositories/interfaces";
import type { ActivityItem, Friend, LeaderboardEntry } from "@/types";
import { mockActivityFeed, mockFriends, mockLeaderboard } from "@/lib/constants/mock-data";

let friendsDb = [...mockFriends];

export class MockSocialRepository implements SocialRepository {
  async getFriends(userId: string): Promise<Friend[]> {
    void userId;
    return friendsDb;
  }

  async searchUsers(query: string): Promise<Friend[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return friendsDb;

    return friendsDb.filter(
      (friend) =>
        friend.displayName.toLowerCase().includes(normalized) || friend.username.toLowerCase().includes(normalized),
    );
  }

  async followUser(_userId: string, friendId: string): Promise<void> {
    friendsDb = friendsDb.map((friend) => (friend.id === friendId ? { ...friend, isFollowing: true } : friend));
  }

  async getActivityFeed(userId: string): Promise<ActivityItem[]> {
    void userId;
    return mockActivityFeed;
  }

  async getLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
    void userId;
    return mockLeaderboard;
  }
}
