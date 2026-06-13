"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useActionState } from "react";
import { signUp } from "@/app/actions";
import { TrendlyLogo } from "@/components/TrendlyLogo";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    async (_: unknown, fd: FormData) => await signUp(fd),
    null,
  );

  return (
    <div className="flex-1 flex flex-col px-6 pb-6">
      <div className="py-3">
        <Link href="/login" aria-label="Back">
          <ChevronLeft size={28} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex justify-center mb-2">
          <TrendlyLogo size={50} />
        </div>
        <p className="text-center text-white/70 text-sm">Create an account to share what&apos;s trending.</p>

        <form action={formAction} className="space-y-3 mt-2">
          {(["full_name", "username", "email", "password"] as const).map((f) => (
            <input
              key={f}
              name={f}
              type={f === "password" ? "password" : f === "email" ? "email" : "text"}
              placeholder={
                f === "full_name"
                  ? "Full name"
                  : f === "username"
                    ? "Username"
                    : f[0].toUpperCase() + f.slice(1)
              }
              required
              className="w-full h-12 px-3 rounded-md bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border)] placeholder-white/40"
            />
          ))}

          {state?.error && <p className="text-[color:var(--color-danger)] text-sm">{state.error}</p>}

          <button
            disabled={pending}
            className="w-full h-12 btn-primary flex items-center justify-center font-semibold"
          >
            {pending ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-2">
          Have an account?{" "}
          <Link href="/login" className="text-[color:var(--color-primary)] font-semibold">
            Log in.
          </Link>
        </p>
      </div>
    </div>
  );
}
