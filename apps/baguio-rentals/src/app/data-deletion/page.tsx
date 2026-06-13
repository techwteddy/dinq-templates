import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Deletion",
  description: "Request deletion of your BaguioRentals account and personal data.",
};

export default function DataDeletionPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-pine">
        Data Deletion Instructions
      </h1>
      <p className="mt-4 text-bark-light leading-relaxed">
        If you want to delete your BaguioRentals account and all associated data, please follow the steps below.
      </p>

      <h2 className="mt-10 font-[family-name:var(--font-display)] text-xl text-pine">
        How to Request Data Deletion
      </h2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 text-bark-light leading-relaxed">
        <li>
          Send an email to{" "}
          <a href="mailto:hello@markanthonynavarro.dev" className="font-medium text-pine underline">
            hello@markanthonynavarro.dev
          </a>{" "}
          with the subject line <strong>&quot;Data Deletion Request&quot;</strong>.
        </li>
        <li>Include the email address associated with your account.</li>
        <li>We will process your request and delete all your personal data within 30 days.</li>
      </ol>

      <h2 className="mt-10 font-[family-name:var(--font-display)] text-xl text-pine">
        What Data Will Be Deleted
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-bark-light leading-relaxed">
        <li>Your profile information (name, avatar, bio)</li>
        <li>Your property listings and uploaded images</li>
        <li>Your messages and conversations</li>
        <li>Your saved listings and favorites</li>
        <li>Your reviews</li>
      </ul>

      <p className="mt-8 text-sm text-bark-light">
        For more information, see our{" "}
        <Link href="/privacy" className="font-medium text-pine underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
