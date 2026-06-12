-- 로그인한 사용자(authenticated)가 후원용 site_content 행만 INSERT/UPDATE
-- 공개 읽기는 기존 site_content_select_public 유지.

GRANT INSERT, UPDATE ON TABLE public.site_content TO authenticated;

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
