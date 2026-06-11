"use client";

import { Heart, Eye, Leaf, Recycle } from "lucide-react";
import { WhyCard } from "@/components/WhyCard";

export default function MissionAndVisionSection() {
  return (
    <section>
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-center mb-12">
        Mission & Vision
      </h2>

      {/* Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <WhyCard
          icon={<Heart />}
          title="Our Mission"
          description="To serve exceptional coffee crafted with care, while creating a welcoming space where community and comfort come first."
        />

        <WhyCard
          icon={<Eye />}
          title="Our Vision"
          description="To become a local favorite café where every visit feels familiar, inspiring moments of connection and calm."
        />

        <WhyCard
          icon={<Leaf />}
          title="Our Values"
          description="We believe in quality, authenticity, and genuine human connection in everything we brew and serve."
        />

        <WhyCard
          icon={<Recycle />}
          title="Sustainability"
          description="Committed to responsible sourcing, eco-friendly practices, and supporting a more sustainable future."
        />
      </div>
    </section>
  );
}
