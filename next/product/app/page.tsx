import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

// Lazy load heavy components to reduce initial bundle size
const DeepDiveFeatures = dynamic(() => import("@/components/DeepDiveFeatures"), {
  loading: () => <div className="h-screen bg-[#050505]" />,
});
const HorizontalGallery = dynamic(() => import("@/components/HorizontalGallery"), {
  loading: () => <div className="h-[50vh] bg-[#050505]" />,
});
const SoundWaveSection = dynamic(() => import("@/components/SoundWaveSection"), {
  loading: () => <div className="h-[60vh] bg-[#050505]" />,
});
const SpecsGrid = dynamic(() => import("@/components/SpecsGrid"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const MagneticFooter = dynamic(() => import("@/components/MagneticFooter"), {
  loading: () => <div className="min-h-[50vh] bg-[#050505]" />,
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        <Hero />
        <DeepDiveFeatures />
        <HorizontalGallery />
        <SoundWaveSection />
        <SpecsGrid />
        <Testimonials />
      </main>
      <MagneticFooter />
    </>
  );
}
