import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const type = searchParams.get("type");

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			if (type === "recovery") {
				return NextResponse.redirect(`${origin}/reset-password`);
			}

			// For OAuth sign-in (Google), check if user needs onboarding
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user?.user_metadata?.university) {
				return NextResponse.redirect(`${origin}/dashboard`);
			}

			// New OAuth user or user who hasn't completed onboarding
			return NextResponse.redirect(`${origin}/onboarding`);
		}
	}

	return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
