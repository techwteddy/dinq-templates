import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ScrollingBanner from "@/components/ScrollingBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import ClientTestimonials from "@/components/Testimonials";
import QuickStats from "@/components/QuickStats";
import FaqSection from "@/components/FAQ";
import QuoteBanner from "@/components/QuoteBanner";
import ContactSection from "@/components/Contact";
import Footer from "@/components/Footer";
import ProcessSection from "@/components/ProcessSection";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <ScrollingBanner />
      <Services />
      <ProcessSection />
      <WhyChooseUs />
      <QuickStats />
      <ClientTestimonials />
      <FaqSection />
      <QuoteBanner />
      <ContactSection />
      <Footer />
    </div>
  );
}
