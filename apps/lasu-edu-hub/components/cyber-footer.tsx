'use client';

import Link from 'next/link';

export function CyberFooter() {
  return (
    <footer className="bg-[#0a0f1c] border-t border-[#00f5ff]/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9d00ff] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00f5ff] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-[#00f5ff] flex items-center justify-center bg-gradient-to-br from-[#00f5ff]/20 to-[#9d00ff]/20">
                <span className="font-bold neon-text-cyan">L</span>
              </div>
              <span className="font-bold neon-text-cyan text-lg">LASU STESA</span>
            </div>
            <p className="text-[#a0a6b8] text-sm leading-relaxed">
              Advancing science and technology education through innovation and excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[#00f5ff] font-bold uppercase tracking-wider text-sm">Quick Access</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#a0a6b8] hover:text-[#00f5ff] transition-colors text-sm">Academics</Link></li>
              <li><Link href="#" className="text-[#a0a6b8] hover:text-[#00f5ff] transition-colors text-sm">Resources</Link></li>
              <li><Link href="#" className="text-[#a0a6b8] hover:text-[#00f5ff] transition-colors text-sm">News</Link></li>
              <li><Link href="#" className="text-[#a0a6b8] hover:text-[#00f5ff] transition-colors text-sm">Admin</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="text-[#9d00ff] font-bold uppercase tracking-wider text-sm">Information</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#a0a6b8] hover:text-[#9d00ff] transition-colors text-sm">About LASU</a></li>
              <li><a href="#" className="text-[#a0a6b8] hover:text-[#9d00ff] transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-[#a0a6b8] hover:text-[#9d00ff] transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-[#a0a6b8] hover:text-[#9d00ff] transition-colors text-sm">Terms</a></li>
            </ul>
          </div>

          {/* Social Links with Orbiting Animation */}
          <div className="space-y-3">
            <h4 className="text-[#ffd700] font-bold uppercase tracking-wider text-sm">Connect</h4>
            <div className="relative w-40 h-40">
              <style>{`
                @keyframes orbit {
                  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
                  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
                }
                .orbit-icon {
                  animation: orbit 8s linear infinite;
                  transform-origin: 0 0;
                  will-change: transform;
                }
              `}</style>

              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#ffd700] rounded-full" />

              {/* Orbiting Icons */}
              {[
                { icon: 'f', color: '#00f5ff', label: 'Facebook' },
                { icon: 't', color: '#9d00ff', label: 'Twitter' },
                { icon: 'l', color: '#ffd700', label: 'LinkedIn' },
                { icon: 'i', color: '#00f5ff', label: 'Instagram' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  title={social.label}
                  className="orbit-icon absolute top-1/2 left-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-current hover:shadow-lg transition-shadow"
                  style={{
                    color: social.color,
                    animationDelay: `${(idx * 2)}s`,
                  }}
                >
                  {social.icon.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#00f5ff]/10 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#a0a6b8] text-sm">
          <p>© 2026 LASU STE. All rights reserved. We are LASU We are Great.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#00f5ff] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#00f5ff] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#00f5ff] transition-colors">Sitemap</a>
          </div>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none animate-scanlines opacity-10" />
    </footer>
  );
}
