"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="#home" className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="DtPix Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-2xl font-bold text-green-600">
            DtPix Studios
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              {label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-40 p-6 flex flex-col space-y-4 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-end">
          <button onClick={() => setIsOpen(false)} className="text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-green-600 text-lg font-medium transition"
          >
            {label}
          </Link>
        ))}

        <Link
          href="#contact"
          onClick={() => setIsOpen(false)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition text-center"
        >
          Get a Quote
        </Link>
      </motion.div>
    </motion.nav>
  );
}
