import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - BaguioRentals",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-pine">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-bark-light">
        Last updated: June 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-bark">
        <section>
          <h2 className="text-lg font-semibold text-pine">What BaguioRentals Is</h2>
          <p className="mt-2">
            BaguioRentals is a free online listing platform that connects property
            owners with people looking for rental properties in Baguio City,
            Philippines. We are a bulletin board, not a real estate broker, agent,
            or property manager.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">We Are Not a Party to Any Transaction</h2>
          <p className="mt-2">
            BaguioRentals does not own, manage, or inspect any property listed on
            the platform. We do not verify the identity of users, the accuracy of
            listings, or the condition of properties. All transactions, agreements,
            and payments happen directly between the property owner and the renter.
          </p>
          <p className="mt-2 font-medium">
            BaguioRentals is not responsible for any loss, damage, dispute, or
            fraud that may arise from interactions between users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Safety</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-bark-light">
            <li>Never send money or deposits before visiting a property in person</li>
            <li>Always verify the identity of the property owner</li>
            <li>Meet in public or well-populated areas for initial viewings</li>
            <li>Be cautious of deals that seem too good to be true</li>
            <li>Report suspicious listings or users to us immediately</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">User Accounts</h2>
          <p className="mt-2">
            You must sign in with a Google or Facebook account to create listings,
            send messages, save favorites, or leave reviews. You are responsible
            for all activity under your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Listing Rules</h2>
          <p className="mt-2">Property owners who post listings agree to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-bark-light">
            <li>Only list properties they own or are authorized to rent out</li>
            <li>Provide accurate information about the property</li>
            <li>Use real photos of the actual property</li>
            <li>Keep availability status up to date</li>
            <li>Not post discriminatory, illegal, or misleading content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Prohibited Content</h2>
          <p className="mt-2">You may not use BaguioRentals to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-bark-light">
            <li>Post fake or misleading listings</li>
            <li>Harass, threaten, or scam other users</li>
            <li>Collect personal information from other users for unauthorized purposes</li>
            <li>Post content that violates Philippine law</li>
          </ul>
          <p className="mt-2">
            We reserve the right to remove any listing or account that violates
            these rules without notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Reviews</h2>
          <p className="mt-2">
            Renters may leave reviews for property owners. Reviews must be honest
            and based on real experiences. We may remove reviews that are abusive,
            fraudulent, or violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Limitation of Liability</h2>
          <p className="mt-2">
            BaguioRentals is provided &quot;as is&quot; without warranties of any
            kind. To the fullest extent permitted by Philippine law, we are not
            liable for any direct, indirect, incidental, or consequential damages
            arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Changes</h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of the
            platform after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-pine">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Contact us at{" "}
            <a
              href="mailto:hello@markanthonynavarro.dev"
              className="font-medium text-pine hover:underline"
            >
              hello@markanthonynavarro.dev
            </a>
            .
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
