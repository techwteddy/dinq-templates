import Link from "next/link";

export function Footer() {
  return (
    <footer id="site-footer" className="border-t border-stone/60 bg-pine">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Link href="/" className="font-[family-name:var(--font-display)] text-2xl text-amber">
              BaguioRentals
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-dark/80">
              Connecting renters with property owners in the City of Pines since 2026.
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-stone-dark/60">
              <p>
                Built and maintained by{" "}
                <a href="https://markanthonynavarro.dev" target="_blank" rel="noopener noreferrer" className="text-amber/80 hover:text-amber transition-colors">
                  Mark Anthony Navarro
                </a>
              </p>
              <p>
                <a href="mailto:hello@markanthonynavarro.dev" className="hover:text-amber transition-colors">
                  hello@markanthonynavarro.dev
                </a>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber/70">Explore</h2>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link href="/listings" className="text-sm text-stone-dark/70 hover:text-amber transition-colors">
                Browse Listings
              </Link>
              <Link href="/listings?type=apartment" className="text-sm text-stone-dark/70 hover:text-amber transition-colors">
                Apartments
              </Link>
              <Link href="/listings?type=house" className="text-sm text-stone-dark/70 hover:text-amber transition-colors">
                Houses
              </Link>
              <Link href="/listings?type=room" className="text-sm text-stone-dark/70 hover:text-amber transition-colors">
                Rooms
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber/70">For Owners</h2>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link href="/listings/new" className="text-sm text-stone-dark/70 hover:text-amber transition-colors">
                Post a Listing
              </Link>
              <Link href="/my-listings" className="text-sm text-stone-dark/70 hover:text-amber transition-colors">
                My Listings
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-1">
            <p className="px-2 py-2 text-xs text-stone-dark/50">
              &copy; {new Date().getFullYear()} BaguioRentals
            </p>
            <Link href="/about" className="rounded-lg px-2 py-2 text-xs text-stone-dark/50 hover:text-amber transition-colors">
              About
            </Link>
            <Link href="/privacy" className="rounded-lg px-2 py-2 text-xs text-stone-dark/50 hover:text-amber transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="rounded-lg px-2 py-2 text-xs text-stone-dark/50 hover:text-amber transition-colors">
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-dark/50">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Baguio City, Benguet, Philippines
          </div>
        </div>
      </div>
    </footer>
  );
}
