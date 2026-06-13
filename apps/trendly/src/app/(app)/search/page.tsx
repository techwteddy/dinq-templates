import Link from "next/link";
import Image from "next/image";
import { Film } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { SearchBar } from "@/components/SearchBar";
import { TopMatchesRail } from "@/components/MatchCard";
import { getTopMatches } from "@/lib/matching";

export const dynamic = "force-dynamic";

const TABS = [
  { label: "IGTV", icon: true },
  { label: "Shop" },
  { label: "Style" },
  { label: "Sports" },
  { label: "Auto" },
];

export default async function SearchPage() {
  const [user, supabase] = await Promise.all([getCachedUser(), createClient()]);

  const [{ data: posts }, matches] = await Promise.all([
    supabase
      .from("posts")
      .select("id, image_url, media_type, user_id, profiles!posts_user_id_fkey(username)")
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(60),
    user
      ? getTopMatches(supabase, user.id, { limit: 10 }).catch(() => [])
      : Promise.resolve([]),
  ]);

  return (
    <>
      <header className="sticky top-0 bg-black z-20 border-b border-[color:var(--color-border)]">
        <div className="px-3 py-2">
          <SearchBar />
        </div>
        <div className="flex gap-2 px-3 pb-2 overflow-x-auto no-scrollbar">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border ${
                i === 0
                  ? "border-white text-white"
                  : "border-[color:var(--color-border)] text-white/80"
              }`}
            >
              {t.icon && <Film size={14} />}
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <TopMatchesRail matches={matches} />

      <Link
        href="/search/picks"
        className="px-3 py-2 text-sm text-[color:var(--color-primary)] block"
      >
        See All Posts →
      </Link>

      <div className="grid grid-cols-3 gap-0.5">
        {(posts ?? []).map((p, i) => {
          const isVideo =
            (p as unknown as { media_type?: string | null }).media_type === "video";
          return (
            <Link key={p.id} href={`/reels/${p.id}`}>
              <div
                className={`relative bg-neutral-900 ${
                  i % 7 === 3 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                }`}
              >
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
                      size={16}
                      className="absolute top-1.5 right-1.5 text-white drop-shadow"
                    />
                  </>
                ) : (
                  <Image
                    src={p.image_url}
                    alt=""
                    fill
                    sizes="140px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
