"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const envError = searchParams.get("error") === "env";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      const next = searchParams.get("next");
      const dest =
        next && next.startsWith("/admin") && !next.startsWith("/admin/login")
          ? next
          : "/admin";
      router.refresh();
      router.push(dest);
    } catch (err) {
      console.error("[admin login]", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("로그인 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {envError ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Supabase 환경 변수가 없습니다. `.env.local`에 URL과 anon(또는
          publishable) 키를 설정하세요.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="space-y-2">
        <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
          이메일
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm",
            "outline-none ring-offset-background focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          )}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="admin-password"
          className="text-sm font-medium text-foreground"
        >
          비밀번호
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm",
            "outline-none ring-offset-background focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          )}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "로그인 중…" : "로그인"}
      </Button>
    </form>
  );
}
