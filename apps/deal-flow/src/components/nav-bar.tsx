'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/upload', label: 'Upload' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/results', label: 'Results' },
  { href: '/monitor', label: 'Monitor' },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    router.refresh();
    setTimeout(() => setSpinning(false), 800);
  }, [router]);

  return (
    <nav className="border-b border-[var(--border-subtle)] bg-[var(--bg-raised)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/upload" className="flex items-center gap-3">
          <span className="text-[var(--text-bright)] font-semibold text-sm tracking-tight">
            Deal Flow
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[var(--accent-glow)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {label}
              </Link>
            );
          })}

          <button
            onClick={handleRefresh}
            title="Refresh page data"
            className="ml-2 rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={spinning ? 'animate-spin' : ''}
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
