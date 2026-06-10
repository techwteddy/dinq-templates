"use client";

import { Github, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Specifications", href: "#specs" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
  ],
  support: [
    { label: "Documentation", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Warranty", href: "#" },
    { label: "Contact", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="relative bg-bg-secondary border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-gold rounded-lg rotate-12" />
                <div className="absolute inset-0.5 bg-bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-sm">K</span>
                </div>
              </div>
              <span className="font-space font-semibold text-lg">
                Key<span className="text-primary-500">Cloud</span>
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6 max-w-xs">
              Crafting the future of mechanical keyboards. 
              Where precision meets passion.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-neutral-800/50 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700/50 transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-neutral-500 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-sm">
            © 2025 KeyCloud. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
