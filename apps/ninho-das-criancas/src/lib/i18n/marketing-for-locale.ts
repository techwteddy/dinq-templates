import type { HomeMarketingContent } from "@/lib/data/home-marketing-shared";

import { HOME_MARKETING_PT } from "@/lib/i18n/home-marketing-pt";
import type { Locale } from "@/lib/i18n/types";

export function homeMarketingForLocale(
  fromCms: HomeMarketingContent,
  locale: Locale
): HomeMarketingContent {
  if (locale === "ko") return fromCms;
  return { ...HOME_MARKETING_PT };
}
