import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdminLoginForm } from "@/app/admin/(public)/login/admin-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">관리자 로그인</CardTitle>
          <CardDescription>
            Supabase Auth에 등록된 운영자 계정만 사용합니다. 공개 회원가입은
            없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-muted-foreground">로딩…</p>}>
            <AdminLoginForm />
          </Suspense>
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          사이트로 돌아가기
        </Link>
      </p>
    </div>
  );
}
