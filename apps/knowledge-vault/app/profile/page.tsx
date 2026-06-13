"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  FileText,
  Link as LinkIcon,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    notes: 0,
    links: 0,
    insights: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/auth");
        return;
      }
      setUser(authUser);

      const { data: items, error } = await supabase
        .from("knowledge_items")
        .select("type")
        .eq("user_id", authUser.id);

      if (error) {
        console.error("Error fetching user items:", error);
      }

      if (items) {
        setStats({
          total: items.length,
          notes: items.filter((i) => i.type === "note").length,
          links: items.filter((i) => i.type === "link").length,
          insights: items.filter((i) => i.type === "insight").length,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center pt-20">
        <Sparkles className="w-12 h-12 text-[#E5C07B] animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  const statCards = [
    { icon: FileText, label: "Notes", value: stats.notes, color: "#E5C07B" },
    { icon: LinkIcon, label: "Links", value: stats.links, color: "#E5C07B" },
    {
      icon: Lightbulb,
      label: "Insights",
      value: stats.insights,
      color: "#E5C07B",
    },
  ];
  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);

      router.push("/auth");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-12 pt-24">
      {" "}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E5C07B] to-[#C9B26A] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#E5C07B]/20">
                <User className="w-10 h-10 text-black" />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
                  Your Profile
                </h1>
                <p className="text-[#A1A1AA] mb-6">
                  Manage your account and view your knowledge statistics
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[#A1A1AA]">
                    <Mail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#A1A1AA]">
                    <Calendar className="w-5 h-5" />
                    <span>
                      Joined{" "}
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">
              Knowledge Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#141414] border border-[#262626] rounded-xl p-6 hover:border-[#E5C07B]/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-[#E5C07B]" />
                  <span className="text-sm text-[#A1A1AA]">Total Items</span>
                </div>
                <p className="text-3xl font-bold text-[#F5F5F5]">
                  {stats.total}
                </p>
              </motion.div>

              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 2) }}
                  className="bg-[#141414] border border-[#262626] rounded-xl p-6 hover:border-[#E5C07B]/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon
                      className="w-5 h-5"
                      style={{ color: stat.color }}
                    />
                    <span className="text-sm text-[#A1A1AA]">{stat.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-[#F5F5F5]">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">
              Account Settings
            </h2>
            <p className="text-[#A1A1AA] mb-6">
              Manage your account preferences and settings
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="text-[#F5F5F5] font-semibold mb-1">Email</h3>
                  <p className="text-sm text-[#A1A1AA]">{user.email}</p>
                </div>
                <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-900">
                  Verified
                </span>
              </div>

              <div className="p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl">
                <h3 className="text-[#F5F5F5] font-semibold mb-1">User ID</h3>
                <p className="text-sm text-[#A1A1AA] font-mono">{user.id}</p>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-pulse">Logging out...</span>
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
