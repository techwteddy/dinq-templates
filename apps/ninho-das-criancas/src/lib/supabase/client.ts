import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경 변수가 없습니다. .env.example을 참고해 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요."
    );
  }

  return createBrowserClient(url, anonKey);
}
