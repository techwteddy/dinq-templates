export type HomeMarketingField =
  | "heroKicker"
  | "heroHeadingMain"
  | "heroHeadingAccent"
  | "heroBody"
  | "heroCtaSecondaryLabel"
  | "heroCtaSecondaryHref"
  | "heroCtaPrimaryLabel"
  | "heroCtaPrimaryHref"
  | "missionKicker"
  | "missionTitle"
  | "missionP1"
  | "missionP2"
  | "donateCtaTitle"
  | "donateCtaBody"
  | "donateCtaPrimaryLabel"
  | "donateCtaSecondaryLabel"
  | "storiesKicker"
  | "storiesTitle"
  | "storiesSubtitle";

export type HomeMarketingContent = Record<HomeMarketingField, string>;

export type HeroSectionCopy = Pick<
  HomeMarketingContent,
  | "heroKicker"
  | "heroHeadingMain"
  | "heroHeadingAccent"
  | "heroBody"
  | "heroCtaSecondaryLabel"
  | "heroCtaSecondaryHref"
  | "heroCtaPrimaryLabel"
  | "heroCtaPrimaryHref"
>;

export type MissionSectionCopy = Pick<
  HomeMarketingContent,
  "missionKicker" | "missionTitle" | "missionP1" | "missionP2"
>;

export type DonationCtaCopy = Pick<
  HomeMarketingContent,
  | "donateCtaTitle"
  | "donateCtaBody"
  | "donateCtaPrimaryLabel"
  | "donateCtaSecondaryLabel"
>;

export type StoriesHeadingCopy = Pick<
  HomeMarketingContent,
  "storiesKicker" | "storiesTitle" | "storiesSubtitle"
>;

export function pickHeroCopy(m: HomeMarketingContent): HeroSectionCopy {
  return {
    heroKicker: m.heroKicker,
    heroHeadingMain: m.heroHeadingMain,
    heroHeadingAccent: m.heroHeadingAccent,
    heroBody: m.heroBody,
    heroCtaSecondaryLabel: m.heroCtaSecondaryLabel,
    heroCtaSecondaryHref: m.heroCtaSecondaryHref,
    heroCtaPrimaryLabel: m.heroCtaPrimaryLabel,
    heroCtaPrimaryHref: m.heroCtaPrimaryHref,
  };
}

export function pickMissionCopy(m: HomeMarketingContent): MissionSectionCopy {
  return {
    missionKicker: m.missionKicker,
    missionTitle: m.missionTitle,
    missionP1: m.missionP1,
    missionP2: m.missionP2,
  };
}

export function pickDonationCtaCopy(m: HomeMarketingContent): DonationCtaCopy {
  return {
    donateCtaTitle: m.donateCtaTitle,
    donateCtaBody: m.donateCtaBody,
    donateCtaPrimaryLabel: m.donateCtaPrimaryLabel,
    donateCtaSecondaryLabel: m.donateCtaSecondaryLabel,
  };
}

export function pickStoriesHeadingCopy(
  m: HomeMarketingContent
): StoriesHeadingCopy {
  return {
    storiesKicker: m.storiesKicker,
    storiesTitle: m.storiesTitle,
    storiesSubtitle: m.storiesSubtitle,
  };
}

export const HOME_MARKETING_DEFAULTS_KO: HomeMarketingContent = {
  heroKicker: "Ninho das Crianças · Brazil",
  heroHeadingMain: "아이들이 안전하게 머물 수 있는 ",
  heroHeadingAccent: "방과 후 둥지",
  heroBody:
    "하교 후 빈 시간을 안전하게 채우고,\n식사·학습·놀이와 정서적 돌봄으로 하루를 지켜 주는 공간입니다.",
  heroCtaSecondaryLabel: "소개 더 보기",
  heroCtaSecondaryHref: "#mission",
  heroCtaPrimaryLabel: "후원하기",
  heroCtaPrimaryHref: "/donate",
  missionKicker: "Mission",
  missionTitle: "왜 어린이 둥지인가요?",
  missionP1:
    "방과 후 시간은 아이에게는 자유이지만,\n때로는 위험과 외로움으로 이어집니다.\n어린이 둥지는 지역 안에서 신뢰할 수 있는 방과 후 공동체를 세우고,\n한 끼와 한 마디가 쌓여 내일의 자신감이 되도록 돕습니다.",
  missionP2:
    "2018년부터 이어 온 관계 속에서 2025년,\n'어린이 둥지'라는 이름으로 공간을 정비했습니다.\n후원과 기도로 함께해 주시는 분들이 있기에 매주 문을 열 수 있습니다.",
  donateCtaTitle: "한 아이의 오후를 안전하게 지켜주세요",
  donateCtaBody:
    "후원은 식재료·교재·공간 유지비로 이어집니다.\n정기 후원은 계획을 세우는 데 큰 도움이 됩니다.",
  donateCtaPrimaryLabel: "후원 방법 보기",
  donateCtaSecondaryLabel: "소식 먼저 읽기",
  storiesKicker: "Stories",
  storiesTitle: "최신 소식",
  storiesSubtitle:
    "Supabase에 게시된 글이 있으면 자동으로 가져옵니다.\n없을 때는 샘플 소식을 보여 드립니다.",
};
