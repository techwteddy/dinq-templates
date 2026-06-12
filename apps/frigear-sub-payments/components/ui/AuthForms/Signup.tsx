"use client";

// import { useTranslation } from 'next-i18next';
import Button from "@/components/ui/Button";
import React from "react";
import Link from "next/link";
import { signUp } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  // const { t } = useTranslation('auth');
  // console.log(t('signin.email_label'));

  // const router = redirectMethod === 'client' ? useRouter() : null;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    if (redirectMethod === "client") {
      await handleRequest(e, signUp, router);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        method="POST"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">{"Email"}</label>
            {/* <label htmlFor="email">{t('signin.email_label')}</label> */}
            <input
              id="email"
              placeholder={"Din awesome email..."}
              // placeholder={t('signin.email_placeholder')}
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
            <label htmlFor="password">{"Password"}</label>
            {/* <label htmlFor="password">{t('signin.password_label')}</label> */}
            <input
              id="password"
              placeholder={"Dit mega svære password..."}
              // placeholder={t('signin.password_placeholder')}
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-zinc-800 mb-2"
            />
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mb-3"
            loading={isSubmitting}
          >
            OPRET
          </Button>
        </div>
      </form>
      <p className="mb-4">Har du allerede en konto?</p>
      <p className="mb-1">
        <Link href="/signin/password_signin" className="font-light text-sm ">
          Log ind med email og password.
        </Link>
      </p>
      {allowEmail && (
        <p>
          <Link href="/signin/email_signin" className="font-light text-sm">
            Hop ind via magic link.
          </Link>
        </p>
      )}
    </div>
  );
}
