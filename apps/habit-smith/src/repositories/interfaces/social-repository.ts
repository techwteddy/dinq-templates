import type { ActivityItem, Friend, LeaderboardEntry } from "@/types";

export interface SocialRepository {
  getFriends(userId: string): Promise<Friend[]>;
  searchUsers(query: string): Promise<Friend[]>;
  followUser(userId: string, friendId: string): Promise<void>;
  getActivityFeed(userId: string): Promise<ActivityItem[]>;
  getLeaderboard(userId: string): Promise<LeaderboardEntry[]>;
}
