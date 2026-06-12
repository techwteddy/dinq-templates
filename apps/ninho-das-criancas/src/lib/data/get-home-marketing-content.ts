import {
  HOME_MARKETING_DEFAULTS_KO,
  type HomeMarketingContent,
} from "@/lib/data/home-marketing-shared";

/**
 * 홈 마케팅 문구는 코드 상수만 사용합니다.
 * (이전에는 Supabase `site_content`에서 덮어썼지만, 줄바꿈·강조 등 포맷 제어가
 *  어려워 코드 단일 소스로 정리했습니다. 포어 버전은 `home-marketing-pt.ts`.)
 */
export async function getHomeMarketingContent(): Promise<HomeMarketingContent> {
  return { ...HOME_MARKETING_DEFAULTS_KO };
}
