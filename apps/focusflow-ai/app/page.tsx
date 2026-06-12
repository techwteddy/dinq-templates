import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import CTA from '@/components/sections/CTA';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <CTA />
    </main>
  );
}
