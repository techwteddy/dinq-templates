-- 1) Storage: 공개 읽기 `media` 버킷 + authenticated 업로드/삭제
--    (대시보드에서 버킷만 만든 경우 INSERT는 ON CONFLICT 로 무해)
-- 2) 홈 페이지 문구 site_content 키 시드
-- 3) site_content RLS: donate_* + home_* 키 허용 목록 확장

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "media_select_public" ON storage.objects;
CREATE POLICY "media_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_authenticated_insert" ON storage.objects;
CREATE POLICY "media_authenticated_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_authenticated_update" ON storage.objects;
CREATE POLICY "media_authenticated_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_authenticated_delete" ON storage.objects;
CREATE POLICY "media_authenticated_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- ---------------------------------------------------------------------------
-- 홈 마케팅 문구 (기본값은 앱 기존 하드코피와 동일)
-- ---------------------------------------------------------------------------
INSERT INTO public.site_content (key, value) VALUES
  ('home_hero_kicker', 'Ninho das Crianças · Brazil'),
  ('home_hero_heading_main', '아이들이 안전하게 머물 수 있는 '),
  ('home_hero_heading_accent', '방과 후 둥지'),
  ('home_hero_body', '하교 후 빈 시간을 안전하게 채우고, 식사·학습·놀이와 정서적 돌봄으로 하루를 지켜 주는 공간입니다.'),
  ('home_hero_cta_secondary_label', '소개 더 보기'),
  ('home_hero_cta_secondary_href', '#mission'),
  ('home_hero_cta_primary_label', '후원하기'),
  ('home_hero_cta_primary_href', '/donate'),
  ('home_mission_kicker', 'Mission'),
  ('home_mission_title', '왜 어린이 둥지인가요?'),
  (
    'home_mission_p1',
    '방과 후 시간은 아이에게는 자유이지만, 때로는 위험과 외로움으로 이어집니다. 어린이 둥지는 지역 안에서 신뢰할 수 있는 방과 후 공동체를 세우고, 한 끼와 한 마디가 쌓여 내일의 자신감이 되도록 돕습니다.'
  ),
  (
    'home_mission_p2',
    '2018년부터 이어 온 관계 속에서 2025년, ''어린이 둥지''라는 이름으로 공간을 정비했습니다. 후원과 기도로 함께해 주시는 분들이 있기에 매주 문을 열 수 있습니다.'
  ),
  ('home_donate_cta_title', '한 아이의 오후를 안전하게 지켜주세요'),
  (
    'home_donate_cta_body',
    '후원은 식재료·교재·공간 유지비로 이어집니다. 정기 후원은 계획을 세우는 데 큰 도움이 됩니다.'
  ),
  ('home_donate_cta_primary_label', '후원 방법 보기'),
  ('home_donate_cta_secondary_label', '소식 먼저 읽기'),
  ('home_stories_kicker', 'Stories'),
  ('home_stories_title', '최신 소식'),
  (
    'home_stories_subtitle',
    'Supabase에 게시된 글이 있으면 자동으로 가져옵니다. 없을 때는 샘플 소식을 보여 드립니다.'
  )
ON CONFLICT (key) DO NOTHING;

-- donate_* + home_* 만 authenticated 가 쓰기
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
      'donate_ways_intro',
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
      'donate_ways_intro',
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
      'donate_ways_intro',
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
    )
  );
