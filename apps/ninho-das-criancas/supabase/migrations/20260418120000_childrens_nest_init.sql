-- Ninho das Crianças / 어린이 둥지 — 초기 스키마
-- 적용: Supabase Dashboard → SQL Editor 에서 실행하거나 `supabase db push` (CLI)
-- 공개 웹은 anon 키로 읽기만 하며, 게시글은 published 만 노출됩니다.
-- 어드민 쓰기/초안 조회는 Service Role(서버 전용) 또는 이후 Auth + 정책으로 연결하세요.

-- ---------------------------------------------------------------------------
-- 공통: updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  summary text,
  category text,
  tags text[] DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'draft',
  thumbnail_url text,
  images text[],
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT posts_status_check CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'hidden'::text]))
);

CREATE INDEX IF NOT EXISTS posts_published_at_desc_idx
  ON public.posts (published_at DESC NULLS LAST)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS posts_category_idx
  ON public.posts (category)
  WHERE status = 'published';

DROP TRIGGER IF EXISTS posts_set_updated_at ON public.posts;
CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_published" ON public.posts;
CREATE POLICY "posts_select_published"
  ON public.posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

COMMENT ON TABLE public.posts IS '뉴스/스토리 게시글. 공개 조회는 published 만.';

-- ---------------------------------------------------------------------------
-- site_content (key-value 문구·후원 정보 등)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

DROP TRIGGER IF EXISTS site_content_set_updated_at ON public.site_content;
CREATE TRIGGER site_content_set_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_content_select_public" ON public.site_content;
CREATE POLICY "site_content_select_public"
  ON public.site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

COMMENT ON TABLE public.site_content IS '사이트 문구·후원 안내 등. 공개 읽기 전용.';

-- API(anon / authenticated)에서 PostgREST로 읽기 허용
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.posts TO anon, authenticated;
GRANT SELECT ON TABLE public.site_content TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage (`media`) — SQL Editor에서는 여기서 건너뜀
--
-- `storage.objects`는 Supabase 관리 테이블이라, 대시보드 SQL로
-- CREATE POLICY / DROP POLICY 시 오류가 납니다:
--   ERROR: 42501: must be owner of relation objects
--
-- 대신 UI에서 설정하세요:
--   1) Storage → New bucket → Name: media, Public bucket: ON
--   2) 해당 버킷 → Policies → "New policy"에서
--      - 공개 읽기: SELECT 허용 (bucket_id = 'media')
--      - 업로드/삭제: authenticated 또는 이후 어드민 설계에 맞게 추가
-- 어드민 서버에서 Service Role로 업로드하면 RLS 우회로 동작 가능.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 시드: 후원 페이지 site_content 키 (앱 기본값과 동기)
-- ---------------------------------------------------------------------------
INSERT INTO public.site_content (key, value) VALUES
  (
    'donate_bank_info',
    '은행·계좌 정보는 관리자 대시보드에서 수정하세요. (예: Banco Example · Ag 0000 · Cc 00000-0 · PIX: exemplo@email.com)'
  ),
  ('donate_external_url', 'https://www.globalgiving.org/'),
  ('donate_external_label', 'GlobalGiving 등 외부 플랫폼으로 후원하기'),
  ('donate_contact_email', 'contato@ninhodascriancas.example'),
  ('donate_contact_phone', '+55 (00) 0000-0000'),
  (
    'donate_contact_note',
    'WhatsApp 또는 이메일로 후원·봉사 문의를 남겨 주세요.'
  ),
  (
    'donate_ways_intro',
    '정기 후원은 예측 가능한 운영에 큰 힘이 됩니다. 일시 후원도 소중히 쓰입니다.'
  )
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 시드: 샘플 게시글 (선택 — 중복 시 slug 로 스킵)
-- ---------------------------------------------------------------------------
INSERT INTO public.posts (
  title,
  slug,
  content,
  summary,
  category,
  tags,
  status,
  thumbnail_url,
  published_at
) VALUES
  (
    '봄맞이 정원 활동',
    'spring-garden-day',
    '## 오늘의 둥지' || E'\n\n' || '모두가 손을 더렵히며 **씨앗**과 흙을 만졌습니다.',
    '아이들과 함께 작은 화분을 꾸미며 봄을 맞았습니다.',
    '일상',
    ARRAY['활동', '봄'],
    'published',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    timezone('utc', now()) - interval '12 days'
  ),
  (
    '지역 교회와 함께한 여름 행사',
    'summer-event-with-church',
    '행사 당일 많은 가족이 찾아와 주셨습니다.',
    '음악과 간식, 그리고 안전 교육 부스가 마련되었습니다.',
    '행사',
    ARRAY['행사', '협력'],
    'published',
    'https://images.unsplash.com/photo-1511632761676-022748dd248f?w=800&q=80',
    timezone('utc', now()) - interval '25 days'
  ),
  (
    '후원자님께 감사드립니다',
    'thank-you-donors-march',
    '보내주신 후원 덕분에 한 달 식단과 미술 시간이 풍성해졌습니다.',
    '식재료와 학용품 후원이 도착했습니다.',
    '후원 소식',
    ARRAY['후원', '감사'],
    'published',
    'https://images.unsplash.com/photo-1593113598338-cab288b1cf7c?w=800&q=80',
    timezone('utc', now()) - interval '35 days'
  ),
  (
    '4월 기도 제목',
    'april-prayer-requests',
    '- 아이들이 학교에서 안전하고 존중받으며 지내기를' || E'\n' ||
    '- 봄철 유행 감기 없이 건강하기를' || E'\n' ||
    '- 봉사자 한 분 한 분의 가정에 평안하기를',
    '아이들의 학교 적응과 코디네이터의 지혜를 위해.',
    '기도 제목',
    ARRAY['기도'],
    'published',
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
    timezone('utc', now()) - interval '40 days'
  ),
  (
    '엄마의 한마디 — 달라진 저녁 시간',
    'parent-story-evening',
    '예전엔 TV만 보다 잠들었는데, 지금은 둥지에서 숙제를 끝내고 와서 대화가 늘었어요. — 보호자 A씨',
    '귀가 후 숙제 시간이 덜 힘들어졌다는 이야기.',
    '변화 이야기',
    ARRAY['가정', '교육'],
    'published',
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80',
    timezone('utc', now()) - interval '45 days'
  ),
  (
    '비 오는 날 실내 놀이',
    'rainy-day-indoor-play',
    '창밖엔 빗소리, 안에서는 조용한 집중과 웃음이 섞였습니다.',
    '보드게임과 독서 코너로 오후를 보냈습니다.',
    '일상',
    ARRAY['놀이'],
    'published',
    'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80',
    timezone('utc', now()) - interval '50 days'
  )
ON CONFLICT (slug) DO NOTHING;
