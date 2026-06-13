import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy · Trendly",
  description: "How Trendly collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="h-12 px-3 flex items-center gap-2 border-b border-[color:var(--color-border)]">
        <Link href="/feed" aria-label="Back">
          <ChevronLeft size={28} />
        </Link>
        <span className="font-semibold">Privacy Policy</span>
      </header>

      <div className="px-4 py-6 text-sm leading-relaxed space-y-4 text-white/85">
        <p className="text-white/60">Last updated: April 2026</p>

        <h2 className="text-base font-semibold text-white">1. Who we are</h2>
        <p>
          Trendly is a social app that lets you share photos, videos, reels,
          and stories with other users. This policy explains what we collect
          and why.
        </p>

        <h2 className="text-base font-semibold text-white">2. Data we collect</h2>
        <p>
          When you sign up, we collect your email address and a username.
          When you post, we store the images, videos, captions, likes,
          comments, and follow relationships you create. We also store
          device and session information needed to keep you signed in.
        </p>

        <h2 className="text-base font-semibold text-white">3. How we use it</h2>
        <p>
          Your data is used to run the app: to show your content to other
          users, to personalize your feed, to send you notifications about
          your posts, and to keep the service secure.
        </p>

        <h2 className="text-base font-semibold text-white">4. Where your data lives</h2>
        <p>
          Authentication and data storage are provided by Supabase. Media
          files are stored in Supabase Storage buckets. The app itself is
          hosted on Google Firebase App Hosting.
        </p>

        <h2 className="text-base font-semibold text-white">5. Your rights</h2>
        <p>
          You can delete your posts and stories at any time from the app.
          To delete your account and all associated data, email{" "}
          <a
            href="mailto:support@trendly.example.com"
            className="underline text-[color:var(--color-primary)]"
          >
            support@trendly.example.com
          </a>
          . We will remove your account within 30 days.
        </p>

        <h2 className="text-base font-semibold text-white">6. Cookies</h2>
        <p>
          Trendly uses an httpOnly session cookie to keep you signed in.
          We do not use advertising cookies or third-party trackers.
        </p>

        <h2 className="text-base font-semibold text-white">7. Children</h2>
        <p>
          Trendly is not intended for users under 13. If you believe a
          child has created an account, please contact us and we will
          remove it.
        </p>

        <h2 className="text-base font-semibold text-white">8. Changes</h2>
        <p>
          We may update this policy as the product evolves. Material
          changes will be announced inside the app.
        </p>

        <p className="pt-4 text-white/60">
          Questions? Reach us at{" "}
          <a
            href="mailto:support@trendly.example.com"
            className="underline"
          >
            support@trendly.example.com
          </a>
          .
        </p>
      </div>
    </>
  );
}
