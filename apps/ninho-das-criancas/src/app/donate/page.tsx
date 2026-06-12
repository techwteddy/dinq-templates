import type { Metadata } from "next";

import { DonatePageBody } from "@/components/donate/donate-page-body";
import { getDonatePageContent } from "@/lib/data/site-content";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "후원",
  description:
    "어린이 둥지 후원이 어떻게 쓰이는지, 후원 방법과 FAQ, 연락처를 안내합니다.",
};

export default async function DonatePage() {
  const content = await getDonatePageContent();
  return <DonatePageBody content={content} />;
}
