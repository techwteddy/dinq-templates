"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    const handleLoading = () => setIsVisible(false);
    const handleLoaded = () => setIsVisible(true);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("experience-loading", handleLoading);
    window.addEventListener("experience-loaded", handleLoaded);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("experience-loading", handleLoading);
      window.removeEventListener("experience-loaded", handleLoaded);
    };
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Gallery", href: "#gallery" },
    { label: "Specs", href: "#specs" },
    { label: "Reviews", href: "#reviews" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
      } ${
        isScrolled
          ? "py-3 bg-black/80 backdrop-blur-xl border-b border-white/5"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 group"
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-gold rounded-lg rotate-12 group-hover:rotate-0 transition-transform duration-300" />
            <div className="absolute inset-0.5 bg-bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-500 font-bold text-sm">K</span>
            </div>
          </div>
          <span className="font-space font-semibold text-lg tracking-tight">
            Key<span className="text-primary-500">Cloud</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-neutral-400 hover:text-white transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#order"
            className="relative px-6 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-full overflow-hidden group hover:shadow-glow transition-shadow duration-300"
          >
            <span className="relative z-10">Pre-Order</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-bg-primary/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg text-neutral-400 hover:text-white transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#order"
            className="mt-4 px-6 py-3 bg-primary-500 text-white text-center font-medium rounded-full"
          >
            Pre-Order Now
          </a>
        </div>
      </div>
    </nav>
  );
}
