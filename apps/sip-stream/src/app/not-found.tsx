'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { useIcon } from '../components/icon-provider';

export default function NotFound() {
  const icon = useIcon();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 fade-in">
      <div className="text-center space-y-8 slide-up">
        <div className="flex flex-col items-center justify-center gap-4 mb-6 scale-in">
          <img
            src={icon}
            alt="SipStream Logo"
            className="w-16 h-16 rounded-full shadow-lg bg-white/80"
            style={{ objectFit: 'cover' }}
          />
          <h1 className="text-6xl font-bold text-white">404</h1>
        </div>

        <div className="glossy-card p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-orange-200 mb-6">
            Oops! The page you&apos;re looking for doesn&apos;t exist. Maybe it got lost in the
            shuffle?
          </p>

          <div className="space-y-4">
            <Link href="/">
              <Button label="Go Home" className="w-full p-button-lg" />
            </Link>
            <Link href="/create">
              <Button label="Create New Game" severity="secondary" className="w-full p-button-lg" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
