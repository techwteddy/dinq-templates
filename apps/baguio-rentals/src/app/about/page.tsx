import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - BaguioRentals",
  description:
    "BaguioRentals is a free rental listing platform for Baguio City, built and maintained by Mark Anthony Navarro.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-pine">
        About BaguioRentals
      </h1>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-bark">
        {/* What it is */}
        <section>
          <p className="text-base text-bark">
            BaguioRentals is a free rental listing platform for Baguio City. It
            connects property owners with renters looking for apartments, houses,
            rooms, condos, and townhouses in the City of Pines.
          </p>
          <p className="mt-3 text-bark-light">
            No fees, no commissions. Property owners list for free, renters browse
            for free, and everyone connects directly.
          </p>
        </section>

        {/* Who built it */}
        <section>
          <h2 className="text-lg font-semibold text-pine">Who Built This</h2>
          <div className="mt-4 rounded-xl border border-stone/60 bg-warm-white p-5">
            <p className="font-semibold text-pine">Mark Anthony Navarro</p>
            <p className="mt-1 text-bark-light">
              AI Systems Engineer &amp; Automation Expert
            </p>
            <p className="mt-3 text-bark-light">
              I built BaguioRentals as a community project to make it easier for
              people to find rental properties in Baguio City. I design and
              maintain the platform on my own time.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://markanthonynavarro.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone/60 px-3.5 py-2 text-xs font-medium text-pine hover:bg-mist transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.777.514-3.435 1.401-4.834" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Website
              </a>
              <a
                href="mailto:hello@markanthonynavarro.dev"
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone/60 px-3.5 py-2 text-xs font-medium text-pine hover:bg-mist transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Email
              </a>
            </div>
          </div>
        </section>

        {/* Support / Donations */}
        <section>
          <h2 className="text-lg font-semibold text-pine">Support the Project</h2>
          <p className="mt-2 text-bark-light">
            BaguioRentals is completely free and has no ads. Running the platform
            costs time and money (hosting, storage, domain). If you find it useful
            and want to support the project, reach out to me at{" "}
            <a
              href="mailto:hello@markanthonynavarro.dev"
              className="font-medium text-pine hover:underline"
            >
              hello@markanthonynavarro.dev
            </a>
            .
          </p>
        </section>

        {/* Partnerships */}
        <section>
          <h2 className="text-lg font-semibold text-pine">
            Partnerships &amp; Collaborations
          </h2>
          <p className="mt-2 text-bark-light">
            I&apos;m open to partnerships, collaborations, and project inquiries.
            If you&apos;re a business, organization, or developer interested in
            working together, I&apos;d love to hear from you.
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-stone/60 bg-warm-white p-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-pine-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <p className="font-medium text-bark">Real Estate Businesses</p>
                <p className="mt-0.5 text-xs text-bark-light">
                  Property managers, real estate agencies, or landlord associations
                  in Baguio looking to list properties or integrate with the
                  platform.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-stone/60 bg-warm-white p-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-pine-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              <div>
                <p className="font-medium text-bark">Tech &amp; Automation Projects</p>
                <p className="mt-0.5 text-xs text-bark-light">
                  I specialize in AI automation, voice AI, workflow orchestration,
                  and web development. Open to freelance projects and long-term
                  collaborations.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-stone/60 bg-warm-white p-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-pine-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <p className="font-medium text-bark">Community Organizations</p>
                <p className="mt-0.5 text-xs text-bark-light">
                  Barangay offices, housing groups, or community organizations in
                  Baguio that want to help residents find housing.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-bark-light">
            Reach out at{" "}
            <a
              href="mailto:hello@markanthonynavarro.dev"
              className="font-medium text-pine hover:underline"
            >
              hello@markanthonynavarro.dev
            </a>{" "}
            or visit{" "}
            <a
              href="https://markanthonynavarro.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-pine hover:underline"
            >
              markanthonynavarro.dev
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
