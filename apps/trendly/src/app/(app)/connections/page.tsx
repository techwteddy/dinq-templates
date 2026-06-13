import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, Users, UserPlus } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import {
  ConnectionRequestRow,
  type RequestRow,
} from "@/components/ConnectionRequestRow";

export const dynamic = "force-dynamic";

type Tab = "requests" | "network";

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabRaw } = await searchParams;
  const tab: Tab = tabRaw === "network" ? "network" : "requests";

  const user = await getCachedUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  // Run requests + my_network in parallel — both depend only on user.id.
  const [{ data: requests }, { data: net }] = await Promise.all([
    supabase
      .from("connections")
      .select(
        `id, requester_id, intro_message, match_score, created_at,
         profiles:profiles!connections_requester_id_fkey(username, full_name, avatar_url, bio)`,
      )
      .eq("addressee_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("my_network")
      .select("peer_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  type ReqRaw = {
    id: string;
    requester_id: string;
    intro_message: string | null;
    match_score: number | null;
    created_at: string | null;
    profiles:
      | {
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
        }
      | { username: string; full_name: string | null; avatar_url: string | null; bio: string | null }[]
      | null;
  };
  const requestRows: RequestRow[] = ((requests as ReqRaw[] | null) ?? []).map(
    (r) => {
      const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
      return {
        id: r.id,
        requester_id: r.requester_id,
        username: p?.username ?? "user",
        full_name: p?.full_name ?? null,
        avatar_url: p?.avatar_url ?? null,
        bio: p?.bio ?? null,
        intro_message: r.intro_message,
        match_score: r.match_score,
        created_at: r.created_at,
      };
    },
  );

  // Accepted network (bi-directional via my_network view) — fetched above.
  const peerIds = ((net as { peer_id: string }[] | null) ?? []).map((n) => n.peer_id);
  type PeerProfile = {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
  let peers: PeerProfile[] = [];
  if (peerIds.length > 0) {
    const { data: p } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, bio")
      .in("id", peerIds);
    peers = (p as PeerProfile[] | null) ?? [];
  }

  return (
    <>
      <header className="sticky top-0 z-20 bg-black border-b border-[color:var(--color-border)]">
        <div className="h-12 px-3 flex items-center gap-2">
          <Link href="/profile" aria-label="Back">
            <ChevronLeft size={26} />
          </Link>
          <h1 className="font-semibold">Connections</h1>
        </div>
        <nav className="grid grid-cols-2 text-sm">
          <Link
            href="/connections?tab=requests"
            className={`flex items-center justify-center gap-2 py-2.5 ${
              tab === "requests"
                ? "border-b-2 border-white text-white font-semibold"
                : "text-white/60"
            }`}
          >
            <UserPlus size={16} /> Requests
            {requestRows.length > 0 && (
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[color:var(--color-primary)] text-white">
                {requestRows.length}
              </span>
            )}
          </Link>
          <Link
            href="/connections?tab=network"
            className={`flex items-center justify-center gap-2 py-2.5 ${
              tab === "network"
                ? "border-b-2 border-white text-white font-semibold"
                : "text-white/60"
            }`}
          >
            <Users size={16} /> My Network ({peers.length})
          </Link>
        </nav>
      </header>

      {tab === "requests" ? (
        requestRows.length === 0 ? (
          <EmptyState
            icon={<UserPlus size={30} />}
            title="No pending requests"
            hint="When someone wants to connect, they'll appear here."
          />
        ) : (
          <div>
            {requestRows.map((r) => (
              <ConnectionRequestRow key={r.id} req={r} />
            ))}
          </div>
        )
      ) : peers.length === 0 ? (
        <EmptyState
          icon={<Users size={30} />}
          title="Your network is empty"
          hint="Connect with someone from Discover to get started."
          cta={{ href: "/search", label: "Find matches" }}
        />
      ) : (
        <div>
          {peers.map((p) => (
            <Link
              key={p.id}
              href={`/u/${p.username}`}
              className="flex items-center gap-3 px-3 py-3 border-b border-[color:var(--color-border)] hover:bg-white/5"
            >
              <Avatar username={p.username} avatarUrl={p.avatar_url} size={44} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {p.full_name ?? p.username}
                </div>
                <div className="text-xs text-white/50 truncate">@{p.username}</div>
                {p.bio && (
                  <p className="text-xs text-white/70 truncate mt-0.5">{p.bio}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState({
  icon,
  title,
  hint,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 px-6 text-center text-white/60">
      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/70">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs max-w-xs">{hint}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-1 h-9 px-4 inline-flex items-center rounded-md btn-primary text-xs font-semibold"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
