import Link from "next/link";
import { navAreas } from "@/config/navigation";
import { getCurrentMember } from "@/lib/supabase-server";
import type { FamilyMessage } from "@/lib/database.types";
import AreaCard from "@/components/AreaCard";

export default async function Home() {
  const { supabase, member } = await getCurrentMember();

  const { data: messages } = await supabase
    .from("family_messages")
    .select("id, author, message, pinned")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);

  const recentMessages = (messages as FamilyMessage[]) ?? [];

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Welcome home</h1>
      <p className="text-muted mb-4">What would you like to manage today?</p>

      {/* Quick-add buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/calendar"
          className="px-4 py-2 rounded-xl bg-lavender text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
        >
          + Event
        </Link>
        <Link
          href="/supermarket"
          className="px-4 py-2 rounded-xl bg-sage text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
        >
          + Shopping Item
        </Link>
        <Link
          href="/chores"
          className="px-4 py-2 rounded-xl bg-peach text-white text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
        >
          + Chore
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {navAreas.map((area) => (
          <AreaCard key={area.href} area={area} />
        ))}
      </div>

      {/* Message preview */}
      {recentMessages.length > 0 && (
        <div className="mt-8 rounded-2xl border-2 border-teal/50 bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Messages</h2>
            <Link
              href="/messages"
              className="text-sm font-medium text-teal hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-2 rounded-xl bg-background/50 border border-card-border"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{msg.author}</span>
                  {msg.pinned && <span className="text-xs">📌</span>}
                </div>
                <p className="text-sm text-muted truncate">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
