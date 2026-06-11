import CafeStorySection from "@/components/CafeStorySection";
import HomeFooter from "@/components/HomeFooter";
import LifeAtBrewBite from "@/components/LifeAtBrewBite";
import MissionAndVisionSection from "@/components/MissionAndVisionSection";

export const metadata = {
  title: "About",
  description:
    "Learn the story behind Brew & Bite — our mission, vision, and the team that crafts every cup.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <CafeStorySection />
      <LifeAtBrewBite />
      <MissionAndVisionSection />
      <HomeFooter />
    </div>
  );
}
