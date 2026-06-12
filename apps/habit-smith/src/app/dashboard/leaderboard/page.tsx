"use client";

import { useEffect, useState } from "react";

import { LeaderboardList } from "@/components/social/leaderboard-list";
import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import type { LeaderboardEntry } from "@/types";

export default function LeaderboardPage() {
  const session = useSessionStore((state) => state.session);
  const userId = session?.user.id ?? "";
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!userId) return;

    void (async () => {
      const nextEntries = await services.social.getLeaderboard(userId);
      setEntries(nextEntries);
    })();
  }, [userId]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Leaderboard</h1>
        <p className="mt-1 text-sm text-zinc-600">See who is leading on consistency and streak momentum.</p>
      </div>
      <LeaderboardList entries={entries} />
    </div>
  );
}
