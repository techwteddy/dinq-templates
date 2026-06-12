export interface Friend {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  currentStreak: number;
  isFollowing: boolean;
}

export interface ActivityItem {
  id: string;
  userId: string;
  username: string;
  description: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  streak: number;
  weeklyCompletions: number;
  rank: number;
}
