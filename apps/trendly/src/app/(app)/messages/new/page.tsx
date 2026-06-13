import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function NewMessagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Suggested: people you follow, plus recent profiles to fill if empty
  const { data: follows } = await supabase
    .from("follows")
    .select("following_id, profiles!follows_following_id_fkey(id, username, avatar_url, full_name)")
    .eq("follower_id", user!.id);

  let people =
    (follows ?? [])
      .map((f) => (Array.isArray(f.profiles) ? f.profiles[0] : f.profiles))
      .filter(Boolean) ?? [];

  if (people.length === 0) {
    const { data: recent } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, full_name")
      .neq("id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20);
    people = (recent ?? []) as typeof people;
  }

  return (
    <>
      <header className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <Link href="/messages" aria-label="Close">
          <ChevronLeft size={28} />
        </Link>
        <span className="font-semibold">New Message</span>
        <span className="w-7" />
      </header>

      <div className="px-3 pt-3 pb-2">
        <SearchBar
          linkTo="message"
          placeholder="Search people"
          excludeSelfId={user!.id}
        />
      </div>

      <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/50">
        Suggested
      </div>

      <div className="flex-1 overflow-y-auto">
        {people.length === 0 ? (
          <div className="text-center text-white/50 text-sm py-10">
            No other users yet — invite a friend to sign up!
          </div>
        ) : (
          people.map((p) => (
            <Link
              key={p!.id}
              href={`/messages/${p!.id}`}
              className="flex items-center gap-3 px-3 py-2 hover:bg-white/5"
            >
              <Avatar username={p!.username} avatarUrl={p!.avatar_url} size={44} />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{p!.username}</div>
                {p!.full_name && (
                  <div className="text-xs text-white/60 truncate">{p!.full_name}</div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
