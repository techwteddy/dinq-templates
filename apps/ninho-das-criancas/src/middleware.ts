import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLogin = pathname === "/admin/login";

  if (!isAdminArea) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  ) {
    if (!isLogin) {
      const u = request.nextUrl.clone();
      u.pathname = "/admin/login";
      u.searchParams.set("error", "env");
      return NextResponse.redirect(u);
    }
    return response;
  }

  if (!isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    const next = request.nextUrl.searchParams.get("next");
    const safe =
      next && next.startsWith("/admin") && !next.startsWith("/admin/login")
        ? next
        : "/admin";
    return NextResponse.redirect(new URL(safe, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
