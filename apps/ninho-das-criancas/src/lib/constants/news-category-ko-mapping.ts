import type { NewsCategoryTabId } from "@/lib/constants/news-categories";

type NewsCategoryTabIdNoAll = Exclude<NewsCategoryTabId, "all">;

/** DB에 저장된 한글 카테고리 → 탭 id (라벨은 `publicUi.news.tabLabels` 사용) */
export const KO_CATEGORY_TO_TAB_ID: Record<string, NewsCategoryTabIdNoAll> = {
  일상: "daily",
  행사: "event",
  "후원 소식": "fundraising",
  "기도 제목": "prayer",
  "변화 이야기": "impact",
};
