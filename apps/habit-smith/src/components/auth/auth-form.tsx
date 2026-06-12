"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";

import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import {
  type ForgotPasswordInput,
  type LoginFormInput,
  type SignupFormInput,
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
} from "@/lib/validations/auth";

type Mode = "login" | "signup" | "forgot";

type AuthFormValues = LoginFormInput & {
  confirmPassword?: string;
};

const titleByMode: Record<Mode, string> = {
  login: "Welcome back",
  signup: "Create your account",
  forgot: "Reset your password",
};

const subtitleByMode: Record<Mode, string> = {
  login: "Log in to continue forging your habits.",
  signup: "Start your HabitSmith journey today.",
  forgot: "Enter your email and we'll send a reset link.",
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: "alex@habitsmith.app",
      password: "password123",
      confirmPassword: "password123",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (mode === "login") {
        const parsed = loginSchema.parse(values);
        const session = await services.auth.login(parsed.email, parsed.password);
        setSession(session);
        router.push("/dashboard");
        return;
      }

      if (mode === "signup") {
        const parsed = signupSchema.parse(values) as SignupFormInput;
        const session = await services.auth.signup(parsed.email, parsed.password);
        setSession(session);
        router.push("/onboarding");
        return;
      }

      const parsed = forgotPasswordSchema.parse(values) as ForgotPasswordInput;
      await services.auth.forgotPassword(parsed.email);
      router.push("/login");
    } catch (error) {
      if (error instanceof ZodError) {
        error.issues.forEach((issue) => {
          const key = String(issue.path[0] ?? "email") as keyof AuthFormValues;
          setError(key, { message: issue.message });
        });
        return;
      }

      setError("email", { message: "Something went wrong, please try again." });
    }
  });

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{titleByMode[mode]}</h1>
      <p className="mt-2 text-sm text-zinc-600">{subtitleByMode[mode]}</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-900 transition focus:ring-2"
            {...register("email")}
          />
          {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email.message}</p> : null}
        </div>

        {mode !== "forgot" ? (
          <div>
            <label htmlFor="password" className="text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-900 transition focus:ring-2"
              {...register("password")}
            />
            {errors.password ? <p className="mt-1 text-xs text-red-500">{errors.password.message}</p> : null}
          </div>
        ) : null}

        {mode === "signup" ? (
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-900 transition focus:ring-2"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait..." : mode === "login" ? "Log In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-5 text-sm text-zinc-600">
        {mode === "login" ? (
          <>
            No account yet? <Link href="/signup" className="font-semibold text-zinc-900">Sign up</Link>
          </>
        ) : null}
        {mode === "signup" ? (
          <>
            Already a member? <Link href="/login" className="font-semibold text-zinc-900">Log in</Link>
          </>
        ) : null}
        {mode === "forgot" ? (
          <Link href="/login" className="font-semibold text-zinc-900">
            Back to login
          </Link>
        ) : null}
      </div>
    </div>
  );
}
