import { Sparkles, Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] border-t border-[#262626] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#E5C07B] to-[#C9B26A] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-[#F5F5F5]">
                KnowledgeVault
              </span>
            </div>
            <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-md">
              Capture, organize, and discover your knowledge with intelligent
              insights. Built for modern thinkers and learners.
            </p>
          </div>

          <div>
            <h3 className="text-[#F5F5F5] font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/collections"
                  className="text-[#A1A1AA] hover:text-[#E5C07B] text-sm transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/add"
                  className="text-[#A1A1AA] hover:text-[#E5C07B] text-sm transition-colors"
                >
                  Add Knowledge
                </Link>
              </li>

              <li>
                <Link
                  href="/docs"
                  className="text-[#A1A1AA] hover:text-[#E5C07B] text-sm transition-colors"
                >
                  Architecture Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#F5F5F5] font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#141414] border border-[#262626] rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#E5C07B] hover:border-[#E5C07B] transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#141414] border border-[#262626] rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#E5C07B] hover:border-[#E5C07B] transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#141414] border border-[#262626] rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#E5C07B] hover:border-[#E5C07B] transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#262626] mt-8 pt-8 text-center">
          <p className="text-[#71717A] text-sm">
            © {new Date().getFullYear()} KnowledgeVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
