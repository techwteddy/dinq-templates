import Image from "next/image";

import { MediaDeleteButton } from "@/components/admin/media-delete-button";
import { MediaUploadZone } from "@/components/admin/media-upload-zone";
import { listMediaPostsForAdmin } from "@/lib/data/admin-media";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const items = await listMediaPostsForAdmin();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          미디어
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Supabase Storage 버킷 <code className="rounded bg-muted px-1">media</code>{" "}
          의 <code className="rounded bg-muted px-1">posts/</code> 폴더에 올라간
          파일입니다. SQL 마이그레이션으로 버킷·정책을 적용했는지 확인하세요.
        </p>
      </div>

      <MediaUploadZone />

      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground">
          최근 업로드
        </h2>
        {items.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            아직 업로드된 이미지가 없습니다.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.path}
                className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm"
              >
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={item.publicUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <p className="break-all font-mono text-[14px] leading-snug text-muted-foreground">
                    {item.publicUrl}
                  </p>
                  <MediaDeleteButton path={item.path} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
