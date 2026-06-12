-- 홈 마케팅 문구는 코드 상수로만 관리하도록 전환
-- 1) site_content 에 시드된 home_* 키 일괄 삭제
-- 2) RLS 정책에서 home_* 키 제거 (donate_* 만 쓰기 허용으로 축소)

-- ---------------------------------------------------------------------------
-- 1) 시드 데이터 제거
-- ---------------------------------------------------------------------------
DELETE FROM public.site_content
WHERE key IN (
  'home_hero_kicker',
  'home_hero_heading_main',
  'home_hero_heading_accent',
  'home_hero_body',
  'home_hero_cta_secondary_label',
  'home_hero_cta_secondary_href',
  'home_hero_cta_primary_label',
  'home_hero_cta_primary_href',
  'home_mission_kicker',
  'home_mission_title',
  'home_mission_p1',
  'home_mission_p2',
  'home_donate_cta_title',
  'home_donate_cta_body',
  'home_donate_cta_primary_label',
  'home_donate_cta_secondary_label',
  'home_stories_kicker',
  'home_stories_title',
  'home_stories_subtitle'
);

-- ---------------------------------------------------------------------------
-- 2) RLS: home_* 제거, donate_* 만 허용
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "site_content_authenticated_insert" ON public.site_content;
CREATE POLICY "site_content_authenticated_insert"
  ON public.site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (
    key IN (
      'donate_bank_info',
      'donate_external_url',
      'donate_external_label',
      'donate_contact_email',
      'donate_contact_phone',
      'donate_contact_note',
      'donate_ways_intro'
    )
  );

DROP POLICY IF EXISTS "site_content_authenticated_update" ON public.site_content;
CREATE POLICY "site_content_authenticated_update"
  ON public.site_content
  FOR UPDATE
  TO authenticated
  USING (
    key IN (
      'donate_bank_info',
      'donate_external_url',
      'donate_external_label',
      'donate_contact_email',
      'donate_contact_phone',
      'donate_contact_note',
      'donate_ways_intro'
    )
  )
  WITH CHECK (
    key IN (
      'donate_bank_info',
      'donate_external_url',
      'donate_external_label',
      'donate_contact_email',
      'donate_contact_phone',
      'donate_contact_note',
      'donate_ways_intro'
    )
  );
