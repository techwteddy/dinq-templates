import Link from "next/link";
import { Heart, Send } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";

export async function HeaderBadges() {
  const user = await getCachedUser();
  if (!user) return null;
  const supabase = await createClient();

  const [{ count: unreadNotifs }, { count: unreadMsgs }] = await Promise.all([
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", user.id)
      .eq("is_read", false),
  ]);

  return (
    <>
      <Link href="/likes" aria-label="Activity" className="relative">
        <Heart size={26} />
        {!!unreadNotifs && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[color:var(--color-danger,#ED4956)] text-[10px] font-semibold flex items-center justify-center leading-none">
            {unreadNotifs > 9 ? "9+" : unreadNotifs}
          </span>
        )}
      </Link>
      <Link href="/messages" aria-label="Messages" className="relative">
        <Send size={26} />
        {!!unreadMsgs && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[color:var(--color-danger,#ED4956)] text-[10px] font-semibold flex items-center justify-center leading-none">
            {unreadMsgs > 9 ? "9+" : unreadMsgs}
          </span>
        )}
      </Link>
    </>
  );
}
