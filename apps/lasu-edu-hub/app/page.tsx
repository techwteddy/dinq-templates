'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { PremiumHero } from '@/components/premium-hero';
import { LeadershipSection } from '@/components/leadership-section';
import { DepartmentTree } from '@/components/department-tree';
import { PremiumStats } from '@/components/premium-stats';
import { SimpleCatalogue } from '@/components/simple-catalogue';
import { PremiumFooter } from '@/components/premium-footer';
import { OnboardingFlow } from '@/components/onboarding-flow';
import { initializeStorage } from '@/lib/storage';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Check if remember me is still valid
          const rememberMeExpiry = localStorage.getItem('rememberMeExpiry');
          if (rememberMeExpiry && parseInt(rememberMeExpiry) > Date.now()) {
            // Session might still be valid, let's check
            const { data: { session: restoredSession } } = await supabase.auth.getSession();
            if (!restoredSession) {
              router.push('/auth/login');
              return;
            }
          } else {
            router.push('/auth/login');
            return;
          }
        }

        // Check if user is admin and redirect them
        if (session?.user?.user_metadata?.role === 'admin') {
          router.push('/admin/home');
          return;
        }

        setIsAuthenticated(true);
        initializeStorage();

        // Check if onboarding should be shown
        const onboardingShown = localStorage.getItem('onboarding_shown');
        if (onboardingShown !== 'true') {
          setShowOnboarding(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_shown', 'true');
    setShowOnboarding(false);
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-accent/20 animate-pulse">
            <svg className="w-12 h-12 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      <Navigation />

      {/* Hero Section */}
      <PremiumHero />

      {/* Leadership Vision */}
      <LeadershipSection />

      {/* Academic Departments Tree */}
      <DepartmentTree />

      {/* Statistics Section */}
      <PremiumStats />

      {/* Service Catalogue */}
      <SimpleCatalogue />

      {/* Footer */}
      <PremiumFooter />
    </div>
  );
}
