'use client';
/**
 * src/app/onboarding/page.tsx
 * Ruta de onboarding. Redirige al dashboard si ya se completó.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Comprobar si el perfil ya tiene onboarding_completed = true
    fetch('/api/profile')
      .then(r => r.json())
      .then(profile => {
        if (profile?.onboarding_completed) {
          router.replace('/dashboard');
        } else {
          setReady(true);
        }
      })
      .catch(() => setReady(true)); // si falla, mostrar onboarding de todas formas
  }, [router]);

  async function handleComplete() {
    // Marcar onboarding completado en el perfil
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboarding_completed: true }),
    }).catch(() => {});
    router.replace('/dashboard');
  }

  if (!ready) {
    return (
      <div style={{
        minHeight: '100svh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', background: '#09090b',
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '2px solid #27272a', borderTopColor: '#4ade80',
          animation: 'spin .7s linear infinite', display: 'block',
        }} />
      </div>
    );
  }

  return <OnboardingFlow onComplete={handleComplete} />;
}
