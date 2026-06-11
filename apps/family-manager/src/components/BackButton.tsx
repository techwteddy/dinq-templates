"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BackButton() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      className="text-lg hover:opacity-70 transition-opacity mr-1"
      aria-label="Back to home"
    >
      &larr;
    </Link>
  );
}
