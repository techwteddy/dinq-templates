import CosmicCanvas from "@/components/cosmic-canvas";
import LandingContent from "@/components/landing-content";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <CosmicCanvas />
      <LandingContent />
    </main>
  );
}
