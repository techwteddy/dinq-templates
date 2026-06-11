"use client";

import Link from "next/link";
import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import CoffeeLogo from "./icons/CoffeeLogo";

export function Left() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CoffeeLogo size={28} className="text-gray-900" />
        <span className="font-semibold text-lg">Brew-Bite Cafe</span>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed">
        Order your favorite brew and bites online. Quick, easy, and delicious.
      </p>
    </div>
  );
}

export function Center() {
  return (
    <div>
      <h4 className="font-semibold mb-4">Quick Links</h4>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link href="/menu" className="hover:text-gray-900 transition-colors">
            Menu
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-gray-900 transition-colors">
            About
          </Link>
        </li>
        <li>
          <Link href="/cart" className="hover:text-gray-900 transition-colors">
            Cart
          </Link>
        </li>
      </ul>
    </div>
  );
}

const socialLinks = [
  {
    Icon: Facebook,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    Icon: Twitter,
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    Icon: Instagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    Icon: Youtube,
    href: "https://youtube.com",
    label: "YouTube",
  },
];

export function Right() {
  return (
    <div>
      <h4 className="font-semibold mb-4">Contact</h4>
      <ul className="space-y-3 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <Mail size={16} className="text-orange-500 shrink-0" />
          <a
            href="mailto:hello@brewbite.com"
            className="hover:text-gray-900 transition-colors"
          >
            hello@brewbite.com
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Phone size={16} className="text-orange-500 shrink-0" />
          <a
            href="tel:+10000000000"
            className="hover:text-gray-900 transition-colors"
          >
            +1 (000) 000-0000
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Globe size={16} className="text-orange-500 shrink-0" />
          <a
            href="https://github.com/Eyasdm/brew-bite-website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            github.com/Eyasdm/brew-bite-website
          </a>
        </li>
      </ul>

      {/* Social icons */}
      <div className="flex gap-3 mt-6">
        {socialLinks.map(({ Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  );
}
