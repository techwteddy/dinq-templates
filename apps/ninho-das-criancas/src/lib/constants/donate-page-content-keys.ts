/** 후원 페이지 `site_content` 키 ↔ 폼/타입 필드명 */
export const DONATE_FIELD_TO_DB_KEY = {
  bankInfo: "donate_bank_info",
  externalUrl: "donate_external_url",
  externalLabel: "donate_external_label",
  contactEmail: "donate_contact_email",
  contactPhone: "donate_contact_phone",
  contactNote: "donate_contact_note",
  waysIntro: "donate_ways_intro",
} as const;

export type DonateContentField = keyof typeof DONATE_FIELD_TO_DB_KEY;

export const DONATE_FORM_FIELDS: readonly {
  field: DonateContentField;
  label: string;
  helper?: string;
  multiline?: boolean;
  inputType?: "url" | "email";
}[] = [
  {
    field: "waysIntro",
    label: "후원 방법 상단 안내",
    helper: "「후원 방법」섹션 첫 문단에 표시됩니다.",
    multiline: true,
  },
  {
    field: "bankInfo",
    label: "은행·계좌 안내",
    helper: "계좌 이체 블록 본문 (줄바꿈 유지).",
    multiline: true,
  },
  {
    field: "externalUrl",
    label: "외부 후원 링크 URL",
    inputType: "url",
    helper: "비우면 후원 페이지에서 링크 버튼을 숨깁니다.",
  },
  {
    field: "externalLabel",
    label: "외부 링크 버튼 문구",
    helper: "예: GlobalGiving으로 후원하기",
  },
  {
    field: "contactEmail",
    label: "문의 이메일",
    inputType: "email",
  },
  {
    field: "contactPhone",
    label: "전화 · 메신저",
    helper: "표시용 한 줄 텍스트 (형식 자유).",
  },
  {
    field: "contactNote",
    label: "연락처 안내 문단",
    multiline: true,
  },
];
