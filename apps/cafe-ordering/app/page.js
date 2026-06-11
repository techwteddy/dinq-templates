import Link from "next/link";
import Hero from "@/components/Hero";
import FeaturedDrinksSection from "@/components/FeaturedDrinksSection";
import HowToOrderSection from "@/components/HowToOrderSection";
import WhyBrewBiteSection from "@/components/WhyBrewBiteSection";
import CustomerReviewsSection from "@/components/CustomerReviewsSection";
import HomeFooter from "@/components/HomeFooter";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <Hero />
      <FeaturedDrinksSection />
      <WhyBrewBiteSection />
      <HowToOrderSection />

      <div className="bg-white rounded-3xl shadow-sm p-1 ">
        <CustomerReviewsSection />
        {/* ================= CTA ================= */}
        <section className="bg-orange-50 py-10 rounded-2xl m-8">
          <div className="max-w-3xl mx-auto text-center space-y-6 px-6">
            <h2 className="text-3xl font-bold">Order Your Brew Now</h2>
            <p className="text-gray-600">
              Fresh coffee, delicious snacks, and fast delivery.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition"
            >
              Go to Menu
            </Link>
          </div>
        </section>
      </div>
      <HomeFooter />
    </main>
  );
}
