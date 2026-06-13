import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ChevronLeft,
  Film,
  Inbox,
  Plus,
  Send,
  ShieldCheck,
  Clock,
  X as XIcon,
} from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import {
  CollabInviteRow,
  type CollabInvite,
} from "@/components/CollabInviteRow";
import { CollabProjectRow, type CollabProject } from "@/components/CollabProjectRow";

export const dynamic = "force-dynamic";

type Tab = "received" | "sent";

export default async function CollabsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabRaw } = await searchParams;
  const tab: Tab = tabRaw === "sent" ? "sent" : "received";

  const user = await getCachedUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  // --- Project-level collabs (v2) ----------------------------------------
  // Fan out the four independent collab queries up front in parallel.
  const [
    { data: receivedProjRaw },
    { data: sentProjRaw },
    { data: received },
    { data: sent },
  ] = await Promise.all([
    supabase
      .from("collab_project_inbox")
      .select(
        `collab_id, inviter_id, invitee_id, project_name, description, status,
         created_at, responded_at, inviter_username, inviter_full_name, inviter_avatar_url`,
      )
      .eq("invitee_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("collaborations")
      .select(
        `id, initiator_id, partner_id, project_name, description, status,
         created_at, responded_at,
         partner:profiles!collaborations_partner_id_fkey(username, full_name, avatar_url)`,
      )
      .eq("initiator_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("collab_inbox")
      .select(
        `post_id, status, role, invited_at, author_id, author_username,
         author_full_name, author_avatar_url, project_title, image_url, media_type`,
      )
      .eq("invitee_id", user.id)
      .order("invited_at", { ascending: false }),
    supabase
      .from("proof_of_work_collaborators")
      .select(
        `post_id, user_id, status, role, invited_at,
         posts:posts!inner(id, image_url, media_type, user_id),
         profiles:profiles!proof_of_work_collaborators_user_id_fkey(username, full_name, avatar_url)`,
      )
      .eq("posts.user_id", user.id)
      .order("invited_at", { ascending: false }),
  ]);

  type ReceivedProjRow = {
    collab_id: string;
    inviter_id: string;
    invitee_id: string;
    project_name: string;
    description: string | null;
    status: "pending" | "verified" | "declined";
    created_at: string | null;
    responded_at: string | null;
    inviter_username: string;
    inviter_full_name: string | null;
    inviter_avatar_url: string | null;
  };
  const receivedProjs = (receivedProjRaw as ReceivedProjRow[] | null) ?? [];

  // Sent: collaborations where I'm the initiator. (Fetched in parallel above.)
  type SentProjRow = {
    id: string;
    initiator_id: string;
    partner_id: string;
    project_name: string;
    description: string | null;
    status: "pending" | "verified" | "declined";
    created_at: string | null;
    responded_at: string | null;
    partner:
      | { username: string; full_name: string | null; avatar_url: string | null }
      | { username: string; full_name: string | null; avatar_url: string | null }[]
      | null;
  };
  const sentProjs = ((sentProjRaw as SentProjRow[] | null) ?? []).map((r) => {
    const p = Array.isArray(r.partner) ? r.partner[0] : r.partner;
    return {
      collab_id: r.id,
      project_name: r.project_name,
      description: r.description,
      status: r.status,
      created_at: r.created_at,
      responded_at: r.responded_at,
      counterpart_id: r.partner_id,
      counterpart_username: p?.username ?? "user",
      counterpart_full_name: p?.full_name ?? null,
      counterpart_avatar_url: p?.avatar_url ?? null,
    };
  });

  // Resolve linked-post thumbnails for every collab the user can see.
  const allCollabIds = [
    ...receivedProjs.map((r) => r.collab_id),
    ...sentProjs.map((r) => r.collab_id),
  ];
  const postsByCollab = new Map<
    string,
    Array<{ post_id: string; image_url: string; media_type: "image" | "video" | null }>
  >();
  if (allCollabIds.length > 0) {
    const { data: linksRaw } = await supabase
      .from("collaboration_posts")
      .select(
        `collab_id, post_id,
         posts:posts!inner(id, image_url, media_type)`,
      )
      .in("collab_id", allCollabIds);
    type LinkRow = {
      collab_id: string;
      post_id: string;
      posts:
        | { id: string; image_url: string; media_type: "image" | "video" | null }
        | { id: string; image_url: string; media_type: "image" | "video" | null }[]
        | null;
    };
    for (const r of ((linksRaw as LinkRow[] | null) ?? [])) {
      const p = Array.isArray(r.posts) ? r.posts[0] : r.posts;
      if (!p) continue;
      const arr = postsByCollab.get(r.collab_id) ?? [];
      arr.push({
        post_id: p.id,
        image_url: p.image_url,
        media_type: p.media_type,
      });
      postsByCollab.set(r.collab_id, arr);
    }
  }

  const receivedProjects: CollabProject[] = receivedProjs.map((r) => ({
    collab_id: r.collab_id,
    project_name: r.project_name,
    description: r.description,
    status: r.status,
    created_at: r.created_at,
    counterpart_id: r.inviter_id,
    counterpart_username: r.inviter_username,
    counterpart_full_name: r.inviter_full_name,
    counterpart_avatar_url: r.inviter_avatar_url,
    side: "received",
    linked_posts: postsByCollab.get(r.collab_id) ?? [],
  }));

  const sentProjects: CollabProject[] = sentProjs.map((r) => ({
    ...r,
    side: "sent",
    linked_posts: postsByCollab.get(r.collab_id) ?? [],
  }));

  const pendingReceivedProjCount = receivedProjects.filter(
    (r) => r.status === "pending",
  ).length;

  // --- Per-post invites (v1, legacy) -------------------------------------
  // (Both `received` and `sent` were fetched in parallel above.)

  const receivedRows: CollabInvite[] =
    ((received as CollabInvite[] | null) ?? []).map((r) => ({ ...r }));

  const pendingPerPostCount = receivedRows.filter(
    (r) => r.status === "pending",
  ).length;

  type SentRaw = {
    post_id: string;
    user_id: string;
    status: "pending" | "verified" | "declined";
    role: string | null;
    invited_at: string | null;
    posts:
      | { id: string; image_url: string; media_type: "image" | "video" | null; user_id: string }
      | { id: string; image_url: string; media_type: "image" | "video" | null; user_id: string }[]
      | null;
    profiles:
      | { username: string; full_name: string | null; avatar_url: string | null }
      | { username: string; full_name: string | null; avatar_url: string | null }[]
      | null;
  };
  const sentRows = ((sent as SentRaw[] | null) ?? []).map((r) => {
    const post = Array.isArray(r.posts) ? r.posts[0] : r.posts;
    const prof = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      post_id: r.post_id,
      image_url: post?.image_url ?? "",
      media_type: post?.media_type ?? null,
      invitee_user_id: r.user_id,
      invitee_username: prof?.username ?? "user",
      invitee_full_name: prof?.full_name ?? null,
      invitee_avatar_url: prof?.avatar_url ?? null,
      status: r.status,
      role: r.role,
      invited_at: r.invited_at,
    };
  });

  const totalPendingReceived = pendingReceivedProjCount + pendingPerPostCount;
  const totalSent = sentProjects.length + sentRows.length;

  return (
    <>
      <header className="sticky top-0 z-20 bg-black border-b border-[color:var(--color-border)]">
        <div className="h-12 px-3 flex items-center gap-2">
          <Link href="/profile" aria-label="Back">
            <ChevronLeft size={26} />
          </Link>
          <h1 className="font-semibold flex items-center gap-1.5">
            <ShieldCheck size={18} className="text-[color:var(--color-primary)]" />
            Collab Lock
          </h1>
          <Link
            href="/collabs/new"
            className="ml-auto h-8 px-3 inline-flex items-center gap-1 rounded-md btn-primary text-xs font-bold"
          >
            <Plus size={14} /> New Collab
          </Link>
        </div>
        <nav className="grid grid-cols-2 text-sm">
          <Link
            href="/collabs?tab=received"
            className={`flex items-center justify-center gap-2 py-2.5 ${
              tab === "received"
                ? "border-b-2 border-white text-white font-semibold"
                : "text-white/60"
            }`}
          >
            <Inbox size={16} /> Received
            {totalPendingReceived > 0 && (
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[color:var(--color-primary)] text-white">
                {totalPendingReceived}
              </span>
            )}
          </Link>
          <Link
            href="/collabs?tab=sent"
            className={`flex items-center justify-center gap-2 py-2.5 ${
              tab === "sent"
                ? "border-b-2 border-white text-white font-semibold"
                : "text-white/60"
            }`}
          >
            <Send size={16} /> Sent ({totalSent})
          </Link>
        </nav>
      </header>

      {tab === "received" ? (
        <ReceivedPane
          projects={receivedProjects}
          perPost={receivedRows}
        />
      ) : (
        <SentPane projects={sentProjects} perPost={sentRows} />
      )}
    </>
  );
}

function ReceivedPane({
  projects,
  perPost,
}: {
  projects: CollabProject[];
  perPost: CollabInvite[];
}) {
  if (projects.length === 0 && perPost.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={30} />}
        title="No collab requests yet"
        hint="When someone requests to verify a collaboration with you, it'll appear here. Only after you accept does it go public on both profiles."
      />
    );
  }
  return (
    <>
      {projects.length > 0 && (
        <section>
          <h2 className="px-3 pt-3 pb-1 text-[11px] font-bold text-white/60 uppercase tracking-wide">
            Project Collaborations
          </h2>
          {projects.map((p) => (
            <CollabProjectRow key={p.collab_id} project={p} />
          ))}
        </section>
      )}
      {perPost.length > 0 && (
        <section>
          <h2 className="px-3 pt-3 pb-1 text-[11px] font-bold text-white/60 uppercase tracking-wide">
            Per-post Invites
          </h2>
          {perPost.map((r) => (
            <CollabInviteRow key={r.post_id + r.author_id} inv={r} />
          ))}
        </section>
      )}
    </>
  );
}

function SentPane({
  projects,
  perPost,
}: {
  projects: CollabProject[];
  perPost: Array<{
    post_id: string;
    image_url: string;
    media_type: "image" | "video" | null;
    invitee_user_id: string;
    invitee_username: string;
    invitee_full_name: string | null;
    invitee_avatar_url: string | null;
    status: "pending" | "verified" | "declined";
    role: string | null;
    invited_at: string | null;
  }>;
}) {
  if (projects.length === 0 && perPost.length === 0) {
    return (
      <EmptyState
        icon={<Send size={30} />}
        title="No outgoing collaborations"
        hint="Create your first collaboration — pick a partner, name the project, and link the posts that prove the work."
        cta={{ href: "/collabs/new", label: "New Collab" }}
      />
    );
  }
  return (
    <>
      {projects.length > 0 && (
        <section>
          <h2 className="px-3 pt-3 pb-1 text-[11px] font-bold text-white/60 uppercase tracking-wide">
            Project Collaborations
          </h2>
          {projects.map((p) => (
            <CollabProjectRow key={p.collab_id} project={p} />
          ))}
        </section>
      )}
      {perPost.length > 0 && (
        <section>
          <h2 className="px-3 pt-3 pb-1 text-[11px] font-bold text-white/60 uppercase tracking-wide">
            Per-post Invites
          </h2>
          {perPost.map((r) => (
            <div
              key={r.post_id + r.invitee_user_id}
              className="flex gap-3 px-3 py-3 border-b border-[color:var(--color-border)]"
            >
              <Link
                href={`/p/${r.post_id}`}
                className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0"
              >
                {r.media_type === "video" ? (
                  <>
                    <video
                      src={r.image_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <Film size={12} className="absolute top-1 right-1 text-white" />
                  </>
                ) : (
                  r.image_url && (
                    <Image
                      src={r.image_url}
                      alt=""
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover"
                    />
                  )
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Avatar
                    username={r.invitee_username}
                    avatarUrl={r.invitee_avatar_url}
                    size={20}
                  />
                  <Link
                    href={`/u/${r.invitee_username}`}
                    className="text-sm font-semibold truncate hover:underline"
                  >
                    {r.invitee_full_name ?? r.invitee_username}
                  </Link>
                  <StatusChip status={r.status} />
                </div>
                <p className="text-xs text-white/60 mt-0.5 truncate">
                  {r.role ? `role: ${r.role}` : "No role specified"}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

function StatusChip({ status }: { status: "pending" | "verified" | "declined" }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
        <ShieldCheck size={12} /> verified
      </span>
    );
  }
  if (status === "declined") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/40">
        <XIcon size={12} /> declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/60">
      <Clock size={12} /> pending
    </span>
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
