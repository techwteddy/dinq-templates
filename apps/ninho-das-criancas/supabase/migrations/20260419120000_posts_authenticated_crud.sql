-- 로그인한 사용자(authenticated)가 posts 테이블 전체 CRUD
-- 공개 사이트는 anon + 기존 "published만 SELECT" 정책 유지.
-- 관리자는 Supabase Auth로 로그인한 뒤 동일 anon 키 + 세션 쿠키로 API 호출 시 authenticated 역할이 됨.

GRANT INSERT, UPDATE, DELETE ON TABLE public.posts TO authenticated;

DROP POLICY IF EXISTS "posts_authenticated_select_all" ON public.posts;
CREATE POLICY "posts_authenticated_select_all"
  ON public.posts
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "posts_authenticated_insert" ON public.posts;
CREATE POLICY "posts_authenticated_insert"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "posts_authenticated_update" ON public.posts;
CREATE POLICY "posts_authenticated_update"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "posts_authenticated_delete" ON public.posts;
CREATE POLICY "posts_authenticated_delete"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (true);
