import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";

export async function GET(request: NextRequest) {
    // The `/auth/callback` route is required for the server-side auth flow implemented
    // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const supabase = createClient();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            return NextResponse.redirect(
                getErrorRedirect(
                    `${requestUrl.origin}/signin`,
                    error.name,
                    "Sorry, Vi ku' ik' lige logge dig ind . . Prøv lige igen eller kontakt Frigear support.",
                ),
            );
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(
        getStatusRedirect(
            `${requestUrl.origin}/pricing`,
            "Succes!",
            "Her kan du vælge dit medlemsskab.",
        ),
    );
}
