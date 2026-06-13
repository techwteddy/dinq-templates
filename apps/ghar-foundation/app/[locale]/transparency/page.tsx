import { getTransparencyContent } from "@/sanity/lib/queries";
import TransparencyClient from "./TransparencyClient";

export default async function TransparencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const transparencyContent = await getTransparencyContent();

  const heroImage = transparencyContent?.heroImage || null;
  const heroTitle = locale === "ar" ? transparencyContent?.heroTitleAr : locale === "de" ? transparencyContent?.heroTitleDe : transparencyContent?.heroTitle;
  const heroSubtitle = locale === "ar" ? transparencyContent?.heroSubtitleAr : locale === "de" ? transparencyContent?.heroSubtitleDe : transparencyContent?.heroSubtitle;

  return (
    <TransparencyClient
      heroImage={heroImage}
      heroTitle={heroTitle || null}
      heroSubtitle={heroSubtitle || null}
      transparencyContent={transparencyContent}
    />
  );
}