import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Bookmark, ChevronLeft, Film } from "lucide-react";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { EmptyArt } from "@/components/EmptyArt";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  // Fetch saved posts joined with the original post rows.
  const { data: rawSaved } = await supabase
    .from("saved_posts")
    .select(
      `id, created_at,
       posts:posts!inner(id, image_url, media_type, caption, archived_at)`,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  type SavedRow = {
    id: string;
    created_at: string | null;
    posts:
      | {
          id: string;
          image_url: string;
          media_type: "image" | "video" | null;
          caption: string | null;
          archived_at: string | null;
        }
      | {
          id: string;
          image_url: string;
          media_type: "image" | "video" | null;
          caption: string | null;
          archived_at: string | null;
        }[]
      | null;
  };

  const rows = ((rawSaved as SavedRow[] | null) ?? []).flatMap((r) => {
    const p = Array.isArray(r.posts) ? r.posts[0] : r.posts;
    if (!p) return [];
    // Hide archived posts from the saved list.
    if (p.archived_at) return [];
    return [
      {
        saved_id: r.id,
        post_id: p.id,
        image_url: p.image_url,
        media_type: p.media_type,
      },
    ];
  });

  return (
    <>
      <header className="sticky top-0 z-20 bg-black border-b border-[color:var(--color-border)]">
        <div className="h-12 px-3 flex items-center gap-2">
          <Link href="/profile" aria-label="Back">
            <ChevronLeft size={26} />
          </Link>
          <h1 className="font-semibold flex items-center gap-1.5">
            <Bookmark size={18} />
            Saved
            <span className="text-white/40 text-xs font-normal">
              ({rows.length})
            </span>
          </h1>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-8 text-center">
          <EmptyArt size={120} />
          <div>
            <h3 className="text-base font-semibold text-white">Your collection is empty</h3>
            <p className="text-xs text-white/60 mt-1 max-w-xs">
              Bookmark posts you love. Build your private vibe board — only you can see it.
            </p>
          </div>
          <Link
            href="/feed"
            className="h-10 px-5 inline-flex items-center rounded-md btn-primary text-sm font-semibold"
          >
            Browse feed
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {rows.map((p) => (
            <Link
              key={p.saved_id}
              href={`/p/${p.post_id}`}
              className="relative aspect-square bg-neutral-900 group"
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
              <div className="absolute top-1.5 left-1.5">
                <Bookmark
                  size={14}
                  className="text-white drop-shadow fill-white"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
