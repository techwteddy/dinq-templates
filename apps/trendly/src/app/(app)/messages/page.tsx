import Link from "next/link";
import { ChevronLeft, Plus, Camera, Video } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import { timeAgo } from "@/lib/utils";
import { TopBar } from "@/components/TopBar";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

type PeerRow = {
  peer_id: string;
  username: string;
  avatar_url: string | null;
  content: string | null;
  media_type: string | null;
  created_at: string | null;
  is_read: boolean | null;
  from_me: boolean;
};

export default async function MessagesPage() {
  const user = await getCachedUser();
  const supabase = await createClient();

  // me-profile and conversations are independent — fan them out in parallel.
  const [{ data: me }, { data: convs }] = await Promise.all([
    supabase.from("profiles").select("username").eq("id", user!.id).single(),
    supabase
      .from("conversations")
      .select("*")
      .or(`a.eq.${user!.id},b.eq.${user!.id}`)
      .order("created_at", { ascending: false }),
  ]);

  // Collect peer ids and load their profiles in one round trip
  const peerIds = Array.from(
    new Set(
      (convs ?? []).map((c) => (c.a === user!.id ? c.b : c.a) as string).filter(Boolean),
    ),
  );
  const { data: profiles } = peerIds.length
    ? await supabase.from("profiles").select("id, username, avatar_url").in("id", peerIds)
    : { data: [] };
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  const rows: PeerRow[] = (convs ?? [])
    .map((c) => {
      const peer_id = (c.a === user!.id ? c.b : c.a) as string;
      const p = byId.get(peer_id);
      if (!p) return null;
      return {
        peer_id,
        username: p.username,
        avatar_url: p.avatar_url,
        content: c.content,
        media_type: (c as unknown as { media_type: string | null }).media_type ?? null,
        created_at: c.created_at,
        is_read: c.is_read,
        from_me: c.sender_id === user!.id,
      };
    })
    .filter(Boolean) as PeerRow[];

  return (
    <>
      <TopBar
        title={me?.username ?? ""}
        left={
          <Link href="/feed" aria-label="Back">
            <ChevronLeft size={28} />
          </Link>
        }
        right={
          <Link href="/messages/new" aria-label="New message">
            <Plus size={28} strokeWidth={2.25} />
          </Link>
        }
      />

      <div className="px-3 pt-3 pb-2">
        <SearchBar
          linkTo="message"
          placeholder="Search people to message"
          excludeSelfId={user!.id}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="px-6 py-10 text-center text-white/60 text-sm">
            No messages yet. Tap <Plus size={14} className="inline" /> to start a chat.
          </div>
        ) : (
          rows.map((r) => (
            <Link
              key={r.peer_id}
              href={`/messages/${r.peer_id}`}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 active:bg-white/10"
            >
              <Avatar username={r.username} avatarUrl={r.avatar_url} size={56} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{r.username}</div>
                <div className="text-sm text-white/60 truncate">
                  {r.from_me && "You: "}
                  {r.content
                    ? r.content
                    : r.media_type === "image"
                    ? "📷 Photo"
                    : r.media_type === "audio"
                    ? "🎤 Voice message"
                    : ""}
                  {r.created_at && <span className="text-white/40"> · {timeAgo(r.created_at)}</span>}
                </div>
              </div>
              {!r.from_me && !r.is_read && (
                <span className="w-2 h-2 rounded-full bg-[color:var(--color-primary)]" />
              )}
              <Camera size={22} className="text-white/80 ml-2" />
            </Link>
          ))
        )}
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <Link
          href="/camera"
          className="flex items-center gap-2 text-[color:var(--color-primary)] text-sm font-semibold"
        >
          <Video size={18} /> Camera
        </Link>
      </div>
    </>
  );
}
