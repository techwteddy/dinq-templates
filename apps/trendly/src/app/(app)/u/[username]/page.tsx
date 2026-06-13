import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, Grid3x3, UserSquare2, Plus, Lock, ChevronDown, Film, ShieldCheck } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import { CountUp } from "@/components/CountUp";
import { formatCount } from "@/lib/utils";
import { FollowButton } from "@/components/FollowButton";
import { userHasActiveStory, canViewStory } from "@/lib/stories";
import { ProfileMatchBadge } from "@/components/ProfileMatchBadge";
import { getPairMatch } from "@/lib/matching";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [me, supabase] = await Promise.all([getCachedUser(), createClient()]);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (!profile) notFound();

  const isMe = me?.id === profile.id;

  // Fan out every independent profile-page query in a single round trip.
  const [
    { count: posts },
    { count: followers },
    { count: following },
    { data: postList },
    { data: followRow },
    hasStory,
    canSeeStoryRaw,
    match,
    { data: verifiedRaw },
    { data: projCollabsRaw },
    { data: activityRaw },
    { data: topPostsRaw },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", profile.id).is("archived_at", null),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", profile.id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", profile.id),
    supabase
      .from("posts")
      .select("id, image_url, media_type, archived_at")
      .eq("user_id", profile.id)
      .is("archived_at", null)
      .order("created_at", { ascending: false }),
    me
      ? supabase
          .from("follows")
          .select("id")
          .eq("follower_id", me.id)
          .eq("following_id", profile.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    userHasActiveStory(supabase, profile.id),
    canViewStory(supabase, me?.id ?? null, profile.id),
    me && !isMe
      ? getPairMatch(supabase, me.id, profile.id).catch(() => null)
      : Promise.resolve(null),
    supabase
      .from("verified_collab_proofs")
      .select("post_id, image_url, media_type, project_title, my_role, verified_count, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("verified_collaborations_view")
      .select(
        "collab_id, counterpart_id, project_name, description, created_at, responded_at, my_role",
      )
      .eq("user_id", profile.id)
      .order("responded_at", { ascending: false })
      .limit(12),
    // Activity sparkline data: posts created in the last 30 days.
    supabase
      .from("posts")
      .select("created_at")
      .eq("user_id", profile.id)
      .is("archived_at", null)
      .gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
    // Top 9 posts by like count (we count likes by post_id and pick 9).
    supabase
      .from("posts")
      .select("id, image_url, media_type, archived_at, likes(id)")
      .eq("user_id", profile.id)
      .is("archived_at", null),
  ]);

  const canSeeStory = hasStory && canSeeStoryRaw;
  type VerifiedRow = {
    post_id: string;
    image_url: string;
    media_type: "image" | "video" | null;
    project_title: string;
    my_role: string;
    verified_count: number;
    created_at: string | null;
  };
  const verifiedCollabs = (verifiedRaw as VerifiedRow[] | null) ?? [];

  // Project-level verified collaborations (v2) — fetched in parallel above.
  type ProjCollabRow = {
    collab_id: string;
    counterpart_id: string;
    project_name: string;
    description: string | null;
    created_at: string | null;
    responded_at: string | null;
    my_role: "initiator" | "partner";
  };
  const projCollabs = (projCollabsRaw as ProjCollabRow[] | null) ?? [];

  // Resolve counterpart profiles + linked post thumbs in a single pass.
  const counterpartIds = Array.from(new Set(projCollabs.map((p) => p.counterpart_id)));
  const collabIds = projCollabs.map((p) => p.collab_id);

  const [{ data: cpartsRaw }, { data: linksRaw }] = await Promise.all([
    counterpartIds.length > 0
      ? supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .in("id", counterpartIds)
      : Promise.resolve({ data: [] as unknown[] }),
    collabIds.length > 0
      ? supabase
          .from("collaboration_posts")
          .select("collab_id, posts:posts!inner(id, image_url, media_type)")
          .in("collab_id", collabIds)
      : Promise.resolve({ data: [] as unknown[] }),
  ]);

  type CpartRow = {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  const cpartsById = new Map<string, CpartRow>();
  for (const r of ((cpartsRaw as CpartRow[] | null) ?? [])) {
    cpartsById.set(r.id, r);
  }

  type LinkRow = {
    collab_id: string;
    posts:
      | { id: string; image_url: string; media_type: "image" | "video" | null }
      | { id: string; image_url: string; media_type: "image" | "video" | null }[]
      | null;
  };
  const linksByCollab = new Map<
    string,
    Array<{ post_id: string; image_url: string; media_type: "image" | "video" | null }>
  >();
  for (const r of ((linksRaw as LinkRow[] | null) ?? [])) {
    const p = Array.isArray(r.posts) ? r.posts[0] : r.posts;
    if (!p) continue;
    const arr = linksByCollab.get(r.collab_id) ?? [];
    arr.push({ post_id: p.id, image_url: p.image_url, media_type: p.media_type });
    linksByCollab.set(r.collab_id, arr);
  }

  const projectCollabs = projCollabs.map((p) => ({
    ...p,
    counterpart: cpartsById.get(p.counterpart_id) ?? null,
    linked_posts: linksByCollab.get(p.collab_id) ?? [],
  }));

  // 30-day activity sparkline.
  const days: number[] = Array.from({ length: 30 }, () => 0);
  const startDay = Math.floor((Date.now() - 30 * 86400000) / 86400000);
  for (const r of (activityRaw ?? []) as { created_at: string | null }[]) {
    if (!r.created_at) continue;
    const d = Math.floor(new Date(r.created_at).getTime() / 86400000) - startDay;
    if (d >= 0 && d < 30) days[d] += 1;
  }
  const maxDay = Math.max(1, ...days);

  // Top 9 posts by likes count (already filtered to non-archived).
  type TopRow = { id: string; image_url: string; media_type: "image" | "video" | null; likes?: { id: string }[] };
  const top9 = ((topPostsRaw as TopRow[] | null) ?? [])
    .map((r) => ({ ...r, _likes: (r.likes ?? []).length }))
    .sort((a, b) => b._likes - a._likes)
    .slice(0, 9);

  // Achievement chips — derived from existing data, no migration needed.
  type Badge = { label: string; emoji: string };
  const achievements: Badge[] = [];
  const postsCount = posts ?? 0;
  const followersCount = followers ?? 0;
  const verifiedCount = projectCollabs.length + verifiedCollabs.length;
  if (postsCount >= 100) achievements.push({ label: "100+ posts", emoji: "\ud83c\udfaf" });
  else if (postsCount >= 50) achievements.push({ label: "50+ posts", emoji: "\u2728" });
  else if (postsCount >= 10) achievements.push({ label: "10+ posts", emoji: "\ud83d\udcde" });
  if (followersCount >= 1000) achievements.push({ label: "1K+ followers", emoji: "\ud83d\ude80" });
  else if (followersCount >= 100) achievements.push({ label: "100+ followers", emoji: "\ud83d\udd25" });
  if (verifiedCount > 0) achievements.push({ label: `${verifiedCount} verified collab${verifiedCount === 1 ? "" : "s"}`, emoji: "\u2705" });
  if (top9.length >= 9) achievements.push({ label: "Top 9 unlocked", emoji: "\ud83c\udfc6" });

  return (
    <>
      {/* Cover banner — only when set; avatar overlaps half on / half off. */}
      {(profile as { cover_url?: string | null }).cover_url ? (
        <div
          className="w-full h-36 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${(profile as { cover_url: string }).cover_url})` }}
        >
          {/* Soft fade so the cover meets the page seamlessly. */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-black" />
        </div>
      ) : null}
      <header className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-1">
          <Lock size={14} />
          <span className="font-semibold">{profile.username}</span>
          <ChevronDown size={18} />
        </div>
        {isMe ? (
          <Link href="/profile/menu" aria-label="Menu"><Menu size={26} /></Link>
        ) : (
          <Plus size={26} />
        )}
      </header>

      <div
        className="px-4 pb-4 flex items-center gap-6"
        style={{
          marginTop: (profile as { cover_url?: string | null }).cover_url ? -44 : 16,
        }}
      >
        <div
          className="rounded-full p-1"
          style={{ background: "#000" }}
        >
          {canSeeStory ? (
            <Link href={`/stories/${profile.id}`} aria-label={`View ${profile.username}'s story`}>
              <Avatar
                username={profile.username}
                avatarUrl={profile.avatar_url}
                size={88}
                ring="story"
              />
            </Link>
          ) : (
            <Avatar
              username={profile.username}
              avatarUrl={profile.avatar_url}
              size={88}
              ring={hasStory ? "viewed" : "none"}
            />
          )}
        </div>
        <div className="flex-1 flex justify-around text-center">
          {[
            { n: posts ?? 0, l: "Posts" },
            { n: followers ?? 0, l: "Followers" },
            { n: following ?? 0, l: "Following" },
          ].map((s) => (
            <div key={s.l}>
              <CountUp value={s.n} className="text-xl stat-num" />
              <div className="text-xs text-white/70">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="font-semibold text-sm">{profile.full_name}</div>
        {profile.bio && <div className="text-sm whitespace-pre-line mt-0.5">{profile.bio}</div>}
        {profile.website && (
          <a
          href={profile.website}
          className="text-sm mt-0.5 block hover:underline"
          style={{ color: (profile as { theme_color?: string | null }).theme_color ?? "#f72585" }}
          target="_blank"
        >
            {profile.website.replace(/^https?:\/\//, "")}
          </a>
        )}
        {achievements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {achievements.map((a) => (
              <span key={a.label} className="pill-chip achievement">
                <span aria-hidden>{a.emoji}</span> {a.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 mt-3">
        {isMe ? (
          <Link
            href="/profile/edit"
            className="w-full h-8 flex items-center justify-center rounded-md bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border)] text-sm font-semibold"
          >
            Edit Profile
          </Link>
        ) : (
          <div className="flex gap-2">
            <FollowButton
              targetId={profile.id}
              initiallyFollowing={!!followRow}
              className="flex-1"
            />
            <Link
              href={`/messages/${profile.id}`}
              className="flex-1 h-8 flex items-center justify-center rounded-md bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border)] text-sm font-semibold"
            >
              Message
            </Link>
          </div>
        )}
      </div>

      {match && <ProfileMatchBadge match={match} />}

      {/* 30-day activity sparkline — smooth SVG area chart. */}
      {(() => {
        const W = 280, H = 36, pad = 2;
        const innerW = W - pad * 2, innerH = H - pad * 2;
        const dx = innerW / (days.length - 1);
        const pts = days.map((v, i) => [
          pad + i * dx,
          pad + innerH - (v / maxDay) * innerH,
        ]);
        // Smooth Catmull-Rom-ish path through the points.
        let line = `M ${pts[0][0]} ${pts[0][1]}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, y0] = pts[Math.max(0, i - 1)];
          const [x1, y1] = pts[i];
          const [x2, y2] = pts[i + 1];
          const [x3, y3] = pts[Math.min(pts.length - 1, i + 2)];
          const c1x = x1 + (x2 - x0) / 6;
          const c1y = y1 + (y2 - y0) / 6;
          const c2x = x2 - (x3 - x1) / 6;
          const c2y = y2 - (y3 - y1) / 6;
          line += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
        }
        const area = `${line} L ${pad + innerW} ${pad + innerH} L ${pad} ${pad + innerH} Z`;
        return (
          <div className="px-4 mt-3 flex items-center gap-2 text-[11px] text-white/55">
            <span>Last 30 days</span>
            <svg viewBox={`0 0 ${W} ${H}`} className="flex-1" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f72585" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#f72585" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="sparkLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff7a45" />
                  <stop offset="50%" stopColor="#f72585" />
                  <stop offset="100%" stopColor="#7209b7" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#sparkFill)" />
              <path d={line} fill="none" stroke="url(#sparkLine)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        );
      })()}

      {/* Top 9 — 'best of' grid auto-curated by likes. */}
      {top9.length >= 3 && (
        <section className="px-4 mt-4">
          <h3 className="text-xs font-bold text-white/80 uppercase tracking-wide mb-2">Top 9</h3>
          <div className="grid grid-cols-3 gap-0.5">
            {top9.map((p) => {
              const isVideo = p.media_type === "video";
              return (
                <Link key={p.id} href={`/p/${p.id}`} className="relative aspect-square bg-neutral-900">
                  {isVideo ? (
                    <video src={p.image_url} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <Image src={p.image_url} alt="" fill className="object-cover" sizes="140px" unoptimized />
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}




      {/* Project-level Verified Collaborations (v2) — primary trust surface */}
      {projectCollabs.length > 0 && (
        <section className="px-4 mt-4">
          <h3 className="text-xs font-bold text-white/80 flex items-center gap-1.5 uppercase tracking-wide">
            <ShieldCheck size={14} className="text-emerald-400" />
            Verified Collaborations
            <span className="text-white/40 text-[10px] font-normal normal-case">
              ({projectCollabs.length})
            </span>
          </h3>
          <div className="mt-2 space-y-2">
            {projectCollabs.map((c) => (
              <article
                key={c.collab_id}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-start gap-2">
                  {c.counterpart && (
                    <Link
                      href={`/u/${c.counterpart.username}`}
                      className="flex-shrink-0"
                    >
                      <Avatar
                        username={c.counterpart.username}
                        avatarUrl={c.counterpart.avatar_url}
                        size={32}
                      />
                    </Link>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold leading-tight truncate">
                      {c.project_name}
                    </h4>
                    {c.counterpart && (
                      <p className="text-[11px] text-white/60 mt-0.5 truncate">
                        with{" "}
                        <Link
                          href={`/u/${c.counterpart.username}`}
                          className="text-white hover:underline"
                        >
                          {c.counterpart.full_name ?? c.counterpart.username}
                        </Link>
                        <span className="ml-1.5 inline-flex items-center gap-0.5 text-emerald-400 font-semibold">
                          <ShieldCheck size={10} /> verified
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                {c.description && (
                  <p className="mt-1.5 text-xs text-white/70 whitespace-pre-line leading-snug line-clamp-3">
                    {c.description}
                  </p>
                )}
                {c.linked_posts.length > 0 && (
                  <div className="mt-2 flex gap-1 overflow-x-auto no-scrollbar">
                    {c.linked_posts.map((p) => (
                      <Link
                        key={p.post_id}
                        href={`/p/${p.post_id}`}
                        className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-900 flex-shrink-0"
                      >
                        {p.media_type === "video" ? (
                          <>
                            <video
                              src={p.image_url}
                              muted
                              playsInline
                              preload="metadata"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <Film
                              size={10}
                              className="absolute top-0.5 right-0.5 text-white drop-shadow"
                            />
                          </>
                        ) : (
                          <Image
                            src={p.image_url}
                            alt=""
                            fill
                            unoptimized
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {verifiedCollabs.length > 0 && (
        <section className="px-4 mt-4">
          <h3 className="text-xs font-bold text-white/80 flex items-center gap-1.5 uppercase tracking-wide">
            <ShieldCheck size={14} className="text-emerald-400" />
            Verified Collaborations
            <span className="text-white/40 text-[10px] font-normal normal-case">
              ({verifiedCollabs.length})
            </span>
          </h3>
          <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {verifiedCollabs.map((v) => (
              <Link
                key={v.post_id}
                href={`/p/${v.post_id}`}
                className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-900 group"
                aria-label={v.project_title}
              >
                {v.media_type === "video" ? (
                  <>
                    <video
                      src={v.image_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <Film
                      size={12}
                      className="absolute top-1 right-1 text-white drop-shadow"
                    />
                  </>
                ) : (
                  <Image
                    src={v.image_url}
                    alt=""
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1 flex items-center gap-1">
                  <ShieldCheck size={10} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-[9px] text-white font-semibold capitalize truncate">
                    {v.my_role}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 py-4">
        {["New", "Friends", "Sport", "Design"].map((h) => (
          <div key={h} className="flex flex-col items-center gap-1 w-16">
            <div className="w-16 h-16 rounded-full border border-[color:var(--color-border)]" />
            <span className="text-[11px] text-white/80">{h}</span>
          </div>
        ))}
      </div>

      <div className="flex border-t border-[color:var(--color-border)]">
        <button className="flex-1 py-2 flex items-center justify-center border-t-2 border-white -mt-px">
          <Grid3x3 size={22} />
        </button>
        <button className="flex-1 py-2 flex items-center justify-center text-white/60">
          <UserSquare2 size={22} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-0.5">
        {(postList ?? []).map((p) => {
          const isVideo =
            (p as unknown as { media_type?: string | null }).media_type === "video";
          return (
            <div key={p.id} className="relative aspect-square bg-neutral-900">
              {isVideo ? (
                <>
                  <video
                    src={p.image_url}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <Film
                    size={18}
                    className="absolute top-1.5 right-1.5 text-white drop-shadow"
                  />
                </>
              ) : (
                <Image
                  src={p.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="140px"
                  unoptimized
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
