"use client";

import { useMemo } from "react";

import { useLocale } from "@/components/i18n/locale-provider";
import { DailyFlowSection } from "@/components/home/daily-flow-section";
import { DonationCtaSection } from "@/components/home/donation-cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { MissionSection } from "@/components/home/mission-section";
import { ProvideSection } from "@/components/home/provide-section";
import { StatsSection } from "@/components/home/stats-section";
import { StoriesPreviewSection } from "@/components/home/stories-preview-section";
import type { HomeMarketingContent } from "@/lib/data/home-marketing-shared";
import {
  pickDonationCtaCopy,
  pickHeroCopy,
  pickMissionCopy,
  pickStoriesHeadingCopy,
} from "@/lib/data/home-marketing-shared";
import { homeMarketingForLocale } from "@/lib/i18n/marketing-for-locale";
import type { Post } from "@/lib/types/post";

export function HomePageClient({
  marketing,
  posts,
}: {
  marketing: HomeMarketingContent;
  posts: Post[];
}) {
  const { locale } = useLocale();
  const m = useMemo(
    () => homeMarketingForLocale(marketing, locale),
    [marketing, locale]
  );

  return (
    <>
      <HeroSection copy={pickHeroCopy(m)} />
      <MissionSection copy={pickMissionCopy(m)} />
      <ProvideSection />
      <DailyFlowSection />
      <StatsSection />
      <StoriesPreviewSection
        posts={posts}
        heading={pickStoriesHeadingCopy(m)}
      />
      <DonationCtaSection copy={pickDonationCtaCopy(m)} />
    </>
  );
}
