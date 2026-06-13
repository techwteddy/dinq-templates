import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Film } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SearchPicksPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, image_url, media_type")
    .order("created_at", { ascending: false })
    .limit(90);

  return (
    <>
      <header className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <Link href="/search" aria-label="Back"><ChevronLeft size={28} /></Link>
        <span className="font-semibold">All Posts</span>
        <span className="w-7" />
      </header>
      <div className="grid grid-cols-3 gap-0.5">
        {(posts ?? []).map((p) => {
          const isVideo =
            (p as unknown as { media_type?: string | null }).media_type === "video";
          return (
            <Link key={p.id} href={`/reels/${p.id}`} className="relative aspect-square bg-neutral-900 block">
              {isVideo ? (
                <>
                  <video
                    src={p.image_url}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <Film size={16} className="absolute top-1.5 right-1.5 text-white drop-shadow" />
                </>
              ) : (
                <Image src={p.image_url} alt="" fill sizes="140px" className="object-cover" unoptimized />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
