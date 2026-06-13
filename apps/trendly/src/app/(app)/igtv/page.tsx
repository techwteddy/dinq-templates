import Link from "next/link";
import { ChevronLeft, Search, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import Image from "next/image";
import { formatCount } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function IGTVPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, image_url, media_type, caption, user_id, profiles!posts_user_id_fkey(username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <>
      <header className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <Link href="/feed"><ChevronLeft size={28} /></Link>
        <span className="font-semibold">IGTV</span>
        <button aria-label="Search"><Search size={24} /></button>
      </header>

      <div className="bg-neutral-900 aspect-[16/9] relative flex items-center justify-center text-white/40">
        <span className="text-xs uppercase tracking-widest">Video preview</span>
      </div>

      <div className="px-3 py-2">
        <p className="text-sm text-white/70">Watch IGTV videos from people you follow and creators.</p>
      </div>

      {(posts ?? []).map((p) => {
        const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
        const isVideo =
          (p as unknown as { media_type?: string | null }).media_type === "video";
        return (
          <article key={p.id} className="border-t border-[color:var(--color-border)] py-3">
            <Link
              href={`/reels/${p.id}`}
              className="block relative mx-3 aspect-video rounded-md overflow-hidden bg-neutral-900"
            >
              {isVideo ? (
                <video
                  src={p.image_url}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <Image src={p.image_url} alt="" fill className="object-cover" unoptimized sizes="400px" />
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Play size={48} className="drop-shadow-lg text-white/90" />
              </div>
            </Link>
            <Link href={`/reels/${p.id}`} className="px-3 pt-2 flex items-center gap-2">
              <Avatar username={profile?.username ?? ""} avatarUrl={profile?.avatar_url ?? null} size={28} />
              <div className="text-sm font-semibold truncate flex-1">{p.caption ?? profile?.username}</div>
              <span className="text-[11px] text-white/50">
                {formatCount(Math.floor(Math.random() * 5000) + 200)} views
              </span>
            </Link>
          </article>
        );
      })}
    </>
  );
}
