import {
  DONATE_FIELD_TO_DB_KEY,
  type DonateContentField,
} from "@/lib/constants/donate-page-content-keys";
import { getSupabaseServer } from "@/lib/supabase/supabase-server-optional";
import { normalizeBrandName } from "@/lib/text/normalize-brand";

export type DonatePageContent = Record<DonateContentField, string>;

const DEFAULTS: DonatePageContent = {
  bankInfo:
    "은행·계좌 정보는 Supabase `site_content` 키 `donate_bank_info`에 등록하면 이곳에 표시됩니다.\n(예: Banco Example · Ag 0000 · Cc 00000-0 · PIX: exemplo@email.com)",
  externalUrl: "https://www.globalgiving.org/",
  externalLabel: "GlobalGiving 등 외부 플랫폼으로 후원하기",
  contactEmail: "contato@ninhodascriancas.example",
  contactPhone: "+55 (00) 0000-0000",
  contactNote:
    "WhatsApp 또는 이메일로 후원·봉사 문의를 남겨 주세요.\n관리자 대시보드「후원 문구」에서 수정할 수 있습니다.",
  waysIntro:
    "정기 후원은 예측 가능한 운영에 큰 힘이 됩니다.\n일시 후원도 소중히 쓰입니다.",
};

export async function getDonatePageContent(): Promise<DonatePageContent> {
  const supabase = getSupabaseServer();
  const keys = Object.values(DONATE_FIELD_TO_DB_KEY);

  if (supabase) {
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value")
      .in("key", keys);

    if (!error && data != null) {
      const map = new Map(
        data.map((r) => [r.key as string, r.value as string | null | undefined])
      );
      return {
        bankInfo: normalizeBrandName(
          map.get(DONATE_FIELD_TO_DB_KEY.bankInfo) ?? DEFAULTS.bankInfo
        ),
        externalUrl:
          map.get(DONATE_FIELD_TO_DB_KEY.externalUrl) ?? DEFAULTS.externalUrl,
        externalLabel: normalizeBrandName(
          map.get(DONATE_FIELD_TO_DB_KEY.externalLabel) ?? DEFAULTS.externalLabel
        ),
        contactEmail:
          map.get(DONATE_FIELD_TO_DB_KEY.contactEmail) ?? DEFAULTS.contactEmail,
        contactPhone:
          map.get(DONATE_FIELD_TO_DB_KEY.contactPhone) ?? DEFAULTS.contactPhone,
        contactNote: normalizeBrandName(
          map.get(DONATE_FIELD_TO_DB_KEY.contactNote) ?? DEFAULTS.contactNote
        ),
        waysIntro: normalizeBrandName(
          map.get(DONATE_FIELD_TO_DB_KEY.waysIntro) ?? DEFAULTS.waysIntro
        ),
      };
    }
  }

  return { ...DEFAULTS };
}
