import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Archive, ChevronLeft, Film } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { EmptyArt } from "@/components/EmptyArt";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: rawPosts } = await supabase
    .from("posts")
    .select("id, image_url, media_type, caption, archived_at, created_at")
    .eq("user_id", user.id)
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });

  type ArchivedRow = {
    id: string;
    image_url: string;
    media_type: "image" | "video" | null;
    caption: string | null;
    archived_at: string | null;
    created_at: string | null;
  };
  const posts = (rawPosts as ArchivedRow[] | null) ?? [];

  return (
    <>
      <header className="sticky top-0 z-20 bg-black border-b border-[color:var(--color-border)]">
        <div className="h-12 px-3 flex items-center gap-2">
          <Link href="/profile" aria-label="Back">
            <ChevronLeft size={26} />
          </Link>
          <h1 className="font-semibold flex items-center gap-1.5">
            <Archive size={18} />
            Archive
            <span className="text-white/40 text-xs font-normal">
              ({posts.length})
            </span>
          </h1>
        </div>
        <p className="px-3 pb-2 text-[11px] text-white/50">
          Only you can see archived posts. Restore them anytime to republish.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-8 text-center">
          <EmptyArt size={120} />
          <div>
            <h3 className="text-base font-semibold text-white">Nothing archived yet</h3>
            <p className="text-xs text-white/60 mt-1 max-w-xs">
              Archived posts hide from your profile and feed but stay safe here — you can always restore them.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/p/${p.id}`}
              className="relative aspect-square bg-neutral-900"
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
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 flex items-center gap-1">
                <Archive size={10} className="text-white/90" />
                <span className="text-[9px] text-white font-semibold">
                  Archived
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
