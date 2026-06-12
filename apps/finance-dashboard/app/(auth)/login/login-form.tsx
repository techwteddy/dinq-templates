"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function onGoogleSignIn() {
    setLoading(true);
    const supabase = createClient();
    const next = params.get("next") || "/";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={onGoogleSignIn}
        className="w-full"
      >
        <GoogleIcon />
        {loading ? "Redirecting…" : "Sign in with Google"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Use your authorized Google account.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303a12 12 0 1 1-3.357-13.045l5.657-5.657A20 20 0 1 0 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819A12 12 0 0 1 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657A20 20 0 0 0 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A12 12 0 0 1 12.7 28.27l-6.522 5.025A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12 12 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
