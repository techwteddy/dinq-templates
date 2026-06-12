import { DonateContentForm } from "@/components/admin/donate-content-form";
import { getDonatePageContent } from "@/lib/data/site-content";

export const dynamic = "force-dynamic";

export default async function AdminDonateContentPage() {
  const content = await getDonatePageContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          후원 페이지 문구
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          공개 후원 페이지(`/donate`)에 표시되는 계좌·링크·연락처 문구를
          수정합니다. 값은 Supabase `site_content` 테이블에 저장됩니다.
        </p>
      </div>
      <DonateContentForm content={content} />
    </div>
  );
}
