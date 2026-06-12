import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const PUBLIC_ROUTES = ["/login", "/auth/callback", "/auth/error"];
const MFA_ROUTES = ["/mfa/enroll", "/mfa/challenge"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isMfaRoute = MFA_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isPublic) return applySecurityHeaders(response);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  // Authenticated user: enforce MFA.
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const currentLevel = aal?.currentLevel ?? "aal1";
  const nextLevel = aal?.nextLevel ?? "aal1";

  // aal1 with a factor → needs challenge. aal1 without a factor → needs enroll.
  if (currentLevel === "aal1" && !isMfaRoute && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = nextLevel === "aal2" ? "/mfa/challenge" : "/mfa/enroll";
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  if (isPublic && currentLevel === "aal2") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  return applySecurityHeaders(response);
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
