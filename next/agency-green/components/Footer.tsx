"use client";

import { Phone, Mail, ArrowUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#105e42] text-white pt-8 pb-4 px-6 relative">
      <div className="ml-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo + Description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="DtPix Studios" width={36} height={36} />
            <span className="text-xl font-semibold">DtPix Studios</span>
          </div>
          <p className="text-sm text-green-100 leading-snug">
            Where ideas transform into stunning visuals — driven by passion,
            powered by creativity.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:ml-20">
          <h3 className="text-base font-semibold mb-2 text-green-100">
            Quick Links
          </h3>
          <ul className="space-y-1 text-sm text-green-100">
            <li>
              <Link href="#about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="#faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="md:ml-10">
          <h3 className="text-base font-semibold mb-2 text-green-100">
            Services
          </h3>
          <ul className="space-y-2 text-green-100 text-sm">
            <li>Business Branding</li>
            <li>Web Design & Development</li>
            <li>Creative Posters & Flyers</li>
            <li>Booklets & Data Entry</li>
            <li>Educational Materials Design</li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-base font-semibold mb-2 text-green-100">
            Connect With Us
          </h3>
          <div className="flex gap-4 text-green-100 mt-1">
            <a
              href="mailto:info.dtpixstudios@gmail.com"
              className="hover:text-white"
            >
              <Mail size={18} />
            </a>
            <a href="tel:+919176730251" className="hover:text-white">
              <Phone size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute top-6 right-6 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow transition-all animate-bounce"
        aria-label="Scroll to top"
      >
        <ArrowUp size={22} />
      </button>

      {/* Copyright */}
      <div className="mt-10 text-center text-xs text-green-100 border-t border-green-700 pt-4">
        © {new Date().getFullYear()} DtPix Studios. All rights reserved.
      </div>
    </footer>
  );
}
