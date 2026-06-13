import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - BaguioRentals",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-pine">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-bark-light">
        Last updated: June 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-bark">
        <section>
          <h2 className="text-lg font-semibold text-pine">What We Collect</h2>
          <p className="mt-2">
            When you create an account on BaguioRentals, we collect the following
            information:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-bark-light">
            <li>Full name and profile photo (from your Google or Facebook account)</li>
            <li>Email address (if you choose to add it to your profile)</li>
            <li>Phone number (if you choose to add it to your profile)</li>
            <li>Bio or description you write</li>
            <li>Property listings you create (including photos, addresses, and descriptions)</li>
            <li>Messages you send to other users</li>
            <li>Listings you save to your favorites</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">How We Use Your Data</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-bark-light">
            <li>To display your profile and listings to other users</li>
            <li>To enable messaging between renters and property owners</li>
            <li>To show your saved listings</li>
            <li>To improve the platform</li>
          </ul>
          <p className="mt-2">
            We do not sell your data to third parties. We do not send marketing
            emails. We do not use your data for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Public Information</h2>
          <p className="mt-2">
            The following information is publicly visible to anyone who visits the
            site:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-bark-light">
            <li>Your full name and profile photo</li>
            <li>Your bio</li>
            <li>Your email and phone number (if you add them to your profile)</li>
            <li>Your property listings and reviews</li>
          </ul>
          <p className="mt-2">
            Email and phone fields are optional. If you add them, they will be
            visible on your public profile. Do not add them if you prefer to keep
            them private.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Authentication</h2>
          <p className="mt-2">
            We use Google and Facebook OAuth for sign-in. We do not store your
            password. Authentication is handled by Supabase, which sets secure
            cookies to maintain your session.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Data Storage</h2>
          <p className="mt-2">
            Your data is stored on Supabase servers. Listing images are stored in
            Supabase Storage. We use row-level security policies to ensure users
            can only modify their own data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Your Rights</h2>
          <p className="mt-2">
            Under the Philippine Data Privacy Act of 2012 (RA 10173), you have the
            right to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-bark-light">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Object to processing of your data</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:hello@markanthonynavarro.dev"
              className="font-medium text-pine hover:underline"
            >
              hello@markanthonynavarro.dev
            </a>
            . You can also view our{" "}
            <Link
              href="/data-deletion"
              className="font-medium text-pine hover:underline"
            >
              data deletion instructions
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Changes</h2>
          <p className="mt-2">
            We may update this policy from time to time. Changes will be posted on
            this page with an updated date.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-stone/60 pt-6">
        <Link
          href="/"
          className="text-sm font-medium text-pine-muted hover:text-pine transition-colors"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
