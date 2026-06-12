'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.error('SW registration failed:', err));
    }

    // Sync focus sessions when coming back online
    window.addEventListener('online', () => {
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.sync.register('sync-focus-session').catch(() => {});
        });
      }
    });
  }, []);

  return <>{children}</>;
}
