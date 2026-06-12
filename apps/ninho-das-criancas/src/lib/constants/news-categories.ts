/** 뉴스 필터 탭 — DB `posts.category` 값과 일치해야 함 */
export const NEWS_CATEGORY_TABS = [
  { id: "all", label: "전체", dbValue: null },
  { id: "daily", label: "일상", dbValue: "일상" },
  { id: "event", label: "행사", dbValue: "행사" },
  { id: "fundraising", label: "후원 소식", dbValue: "후원 소식" },
  { id: "prayer", label: "기도 제목", dbValue: "기도 제목" },
  { id: "impact", label: "변화 이야기", dbValue: "변화 이야기" },
] as const;

export type NewsCategoryTabId = (typeof NEWS_CATEGORY_TABS)[number]["id"];

export function tabIdToDbCategory(tabId: string | undefined): string | null {
  const id = tabId?.trim() || "all";
  if (id === "all") return null;
  const row = NEWS_CATEGORY_TABS.find((t) => t.id === id);
  return row?.dbValue ?? null;
}
