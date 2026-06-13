"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Brain,
  Lock,
  Zap,
  Search,
  Tag,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "Smart Organization",
      description:
        "Automatically organize your knowledge with AI-powered categorization and tagging.",
    },
    {
      icon: Search,
      title: "Instant Search",
      description:
        "Find what you need in seconds with powerful full-text search across all your content.",
    },
    {
      icon: Tag,
      title: "Flexible Tagging",
      description:
        "Create custom tags and collections to organize knowledge your way.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Your data is encrypted and stored securely. Only you have access to your knowledge.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Built for speed. Access and search your entire knowledge base instantly.",
    },
    {
      icon: Sparkles,
      title: "AI Insights",
      description:
        "Get AI-generated summaries and insights to better understand your knowledge.",
    },
  ];

  const benefits = [
    "Capture ideas and insights instantly",
    "Never lose important information",
    "Find connections between your notes",
    "Build your second brain",
  ];

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    }
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-15 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E5C07B]/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#141414] border border-[#262626] rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#E5C07B]" />
              <span className="text-sm text-[#A1A1AA]">
                Your Personal Knowledge Management System
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F5F5F5] mb-6 leading-tight">
              Capture, Organize,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C07B] to-[#C9B26A]">
                Discover Knowledge
              </span>
            </h1>

            <p className="text-xl text-[#A1A1AA] mb-10 leading-relaxed max-w-2xl mx-auto">
              Build your second brain with KnowledgeVault. Store notes, links,
              and insights in one place. Let AI help you organize and discover
              connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <Link
                  href="/auth"
                  className="group px-8 py-4 bg-[#E5C07B] text-black font-semibold rounded-xl hover:bg-[#C9B26A] transition-all flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <Link
                href="/collections"
                className="px-8 py-4 bg-[#141414] border border-[#262626] text-[#F5F5F5] font-semibold rounded-xl hover:border-[#E5C07B] transition-all"
              >
                View Collections
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-[#71717A]">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#E5C07B]" />
                  {benefit}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className=" bg-[#0B0B0B] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#F5F5F5] mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto">
              Powerful features to help you manage your knowledge effectively
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 bg-[#141414] border border-[#262626] rounded-2xl hover:border-[#E5C07B]/40 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#E5C07B]/20 to-[#C9B26A]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#E5C07B]" />
                </div>
                <h3 className="text-xl font-semibold text-[#F5F5F5] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#A1A1AA] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-b from-[#0B0B0B] to-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-16 h-16 text-[#E5C07B] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-[#F5F5F5] mb-6">
              Start Building Your Knowledge Vault Today
            </h2>
            <p className="text-lg text-[#A1A1AA] mb-10">
              Join thousands of users who are already organizing their knowledge
            </p>

            <Link
              href="/add"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E5C07B] text-black font-semibold rounded-xl hover:bg-[#C9B26A] transition-all"
            >
              Start Writing Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
