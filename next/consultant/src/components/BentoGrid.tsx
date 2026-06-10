"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhoneCall, Bot, Workflow, Share2, BarChart } from "lucide-react";

export const services = [
  {
    title: "Voice AI Receptionist",
    description: "24/7 call handling for home services. Books appointments, answers FAQs, and screens emergency calls.",
    icon: PhoneCall,
    colSpan: "md:col-span-2",
  },
  {
    title: "LLM-Powered Chatbots",
    description: "Custom-trained knowledge bases for lead qualification and support.",
    icon: Bot,
    colSpan: "md:col-span-1",
  },
  {
    title: "N8N Workflow Automation",
    description: "Multi-step automations connecting your tools to eliminate repetitive tasks. Self-hosted for security.",
    icon: Workflow,
    colSpan: "md:col-span-1",
  },
  {
    title: "Custom Dashboards",
    description: "Real-time data visualization and actionable insights into your business.",
    icon: BarChart,
    colSpan: "md:col-span-1",
  },
  {
    title: "Social Media Engine",
    description: "Automated content creation and scheduling across platforms.",
    icon: Share2,
    colSpan: "md:col-span-3",
  },
];

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto p-4">
      {services.map((service) => (
        <motion.div
          key={service.title}
          whileHover={{ scale: 1.02 }}
          className={`group relative overflow-hidden rounded-2xl bg-white/75 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/50 p-8 backdrop-blur-md transition-all hover:shadow-lg ${service.colSpan}`}
        >
          {/* Watercolor tint splash effect */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/20 blur-3xl transition-all group-hover:bg-primary/30 group-hover:blur-2xl" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <service.icon className="h-10 w-10 text-primary mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-foreground/70">{service.description}</p>
            </div>
            
            <div className="mt-8 flex items-center text-sm font-medium text-primary">
              Learn More
              <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
