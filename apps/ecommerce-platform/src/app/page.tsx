import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrustBadges from '@/components/home/TrustBadges';

export default function HomePage() {
  return (
    <>
      <Marquee />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <WhyChooseSection />
        <IntroSection />
        <TrustBadges />
      </main>
      <Footer />
    </>
  );
}
