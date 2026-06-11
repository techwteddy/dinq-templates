"use client";

import { Coffee, Users, Leaf } from "lucide-react";

export default function LifeAtBrewBite() {
  return (
    <section className="max-w-7xl py-16">
      <h2 className="text-2xl font-semibold text-center mb-12">
        Life at Brew-Bite
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <LifeCard
          icon={<Coffee />}
          title="Slow Mornings"
          description="Calm mornings filled with fresh coffee aromas, soft light, and a peaceful start to the day."
        />

        <LifeCard
          icon={<Users />}
          title="Shared Moments"
          description="A place where conversations flow naturally — between friends, families, and familiar faces."
        />

        <LifeCard
          icon={<Leaf />}
          title="Comfort & Calm"
          description="Warm interiors, natural elements, and a welcoming atmosphere designed to help you slow down."
        />
      </div>
    </section>
  );
}

function LifeCard({ icon, title, description }) {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-500">
        {icon}
      </div>

      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">{description}</p>
    </div>
  );
}
