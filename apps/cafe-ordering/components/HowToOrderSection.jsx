"use client";

import {
  IconCup,
  IconFileText,
  IconTruckDelivery,
  IconCoffee,
} from "@tabler/icons-react";

const steps = [
  { icon: IconCup, title: "Choose Drink", description: "Browse our menu and pick your favorite brew or bite." },
  { icon: IconFileText, title: "Place Order", description: "Fill in your details and confirm your order in seconds." },
  { icon: IconTruckDelivery, title: "Pickup or Delivery", description: "Choose to pick up in-store or get it delivered to you." },
  { icon: IconCoffee, title: "Enjoy Your Coffee", description: "Sit back, relax, and enjoy your perfectly crafted drink." },
];

export default function HowToOrderSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 my-24">
      <h2 className="text-3xl font-bold text-center mb-12">How to Order</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <OrderCard
            key={step.title}
            step={index + 1}
            icon={step.icon}
            title={step.title}
            description={step.description}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function OrderCard({ step, icon: Icon, title, description, isLast }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Connector line — visible on large screens between cards, hidden on last */}
      {!isLast && (
        <div className="hidden lg:block absolute top-[22px] left-[calc(50%+28px)] w-[calc(100%-56px)] h-[2px] bg-orange-100 z-0" />
      )}

      {/* Step bubble */}
      <div className="relative z-10 mb-4">
        {/* Outer ring */}
        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
          <Icon size={24} stroke={2} className="text-[#C56A2D]" />
        </div>

        {/* Step number badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center leading-none shadow">
          {step}
        </span>
      </div>

      {/* Card body */}
      <div className="bg-white rounded-2xl p-5 w-full shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-sm text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}