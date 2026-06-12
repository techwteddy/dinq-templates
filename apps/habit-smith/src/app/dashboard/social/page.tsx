"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ActivityFeed } from "@/components/social/activity-feed";
import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import type { ActivityItem, Friend } from "@/types";

export default function SocialPage() {
  const session = useSessionStore((state) => state.session);
  const userId = session?.user.id ?? "";

  const [friends, setFriends] = useState<Friend[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!userId) return;

    let active = true;

    void (async () => {
      const [nextFriends, nextActivity] = await Promise.all([
        services.social.getFriends(userId),
        services.social.getActivityFeed(userId),
      ]);

      if (!active) return;
      setFriends(nextFriends);
      setActivity(nextActivity);
    })();

    return () => {
      active = false;
    };
  }, [userId]);

  const search = async () => {
    const results = await services.social.searchUsers(query);
    setFriends(results);
  };

  const follow = async (friendId: string) => {
    if (!userId) return;
    await services.social.followUser(userId, friendId);
    const nextFriends = await services.social.getFriends(userId);
    setFriends(nextFriends);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Social</h1>
        <p className="mt-1 text-sm text-zinc-600">Build accountability with friends, activity, and streak leaderboards.</p>
      </div>

      <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Find Friends</h2>
        <div className="mt-3 flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search username"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => void search()}>
            Search
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {friends.map((friend) => (
            <li key={friend.id} className="flex items-center justify-between rounded-xl border border-zinc-100 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-zinc-900">{friend.displayName}</p>
                <p className="text-xs text-zinc-500">@{friend.username} · {friend.currentStreak} day streak</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/u/${friend.username}`} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs">
                  View Profile
                </Link>
                <button
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white disabled:bg-zinc-300"
                  disabled={friend.isFollowing}
                  onClick={() => void follow(friend.id)}
                >
                  {friend.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <ActivityFeed items={activity} />
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-white shadow-xl">
          <h2 className="text-lg font-semibold">Accountability Prompt</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Send encouragement to one friend today and increase your social accountability score.
          </p>
          <button className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900">Send Encouragement</button>
        </section>
      </div>
    </div>
  );
}
