"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        let redirectTo = "";
        if (typeof window !== "undefined") {
          redirectTo = `${window.location.origin}/auth/callback`;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });
        if (error) throw error;
        alert("Account created successfully!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/collections");
        router.refresh();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#141414] items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-[#E5C07B]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#E5C07B]/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#E5C07B] to-[#C9B26A] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E5C07B]/20 mb-8">
              <BrainCircuit className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-4xl font-bold text-[#F5F5F5] mb-6 leading-tight">
              Your Second Brain,
              <br />
              <span className="text-[#E5C07B]">Supercharged by AI.</span>
            </h2>
            <div className="space-y-4">
              {[
                "Capture thoughts instantly",
                "AI auto-tagging & summarization",
                "Semantic search across everything",
                "Secure, portable knowledge vault",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#A1A1AA]">
                  <CheckCircle2 className="w-5 h-5 text-[#E5C07B]" />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-[#A1A1AA] hover:text-[#E5C07B] transition-colors group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-[#A1A1AA]">
                {isSignUp
                  ? "Start organizing your digital life."
                  : "Enter your details to access your vault."}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#E5C07B] uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525B] group-focus-within:text-[#E5C07B] transition-colors" />

                  <input
                    type="email"
                    required
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl py-4 pl-12 pr-4 text-[#F5F5F5] placeholder-[#52525B] focus:ring-2 focus:ring-[#E5C07B] focus:border-transparent outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#E5C07B] uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525B] group-focus-within:text-[#E5C07B] transition-colors" />
                  <input
                    type="password"
                    required
                    value={password || ""}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-xl py-4 pl-12 pr-4 text-[#F5F5F5] placeholder-[#52525B] focus:ring-2 focus:ring-[#E5C07B] focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E5C07B] text-black font-bold py-4 rounded-xl hover:bg-[#C9B26A] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#E5C07B]/10 hover:shadow-[#E5C07B]/20 hover:-translate-y-0.5"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#A1A1AA] text-sm">
                {isSignUp
                  ? "Already have an account?"
                  : "New to KnowledgeVault?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-[#E5C07B] font-medium hover:underline transition-all"
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </motion.div>

          <div className="mt-6 p-4 bg-[#1A1A1A] border border-[#262626] rounded-xl text-center">
            <p className="text-xs text-[#A1A1AA] mb-2">For Demo Access:</p>
            <div className="flex justify-center gap-4 text-xs font-mono text-[#E5C07B]">
              <span>demo@gmail.com</span>
              <span>•</span>
              <span>123456</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 text-xs text-[#52525B]">
          Protected by Supabase Auth
        </div>
      </div>
    </div>
  );
}
