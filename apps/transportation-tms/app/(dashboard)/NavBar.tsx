"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentAdminUser } from "@/app/actions/admin-management";
import type { AdminUser } from "@/lib/types";

interface NavBarProps {
  userEmail: string;
  onSignOut: () => void;
}

export default function NavBar({ userEmail, onSignOut }: NavBarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    getCurrentAdminUser().then(setCurrentUser);
  }, []);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: "/dashboard", label: "Calendar" },
    { href: "/dashboard/reservations", label: "Reservations" },
    { href: "/dashboard/vehicles", label: "Vehicles" },
    { href: "/dashboard/drivers", label: "Drivers" },
    { href: "/dashboard/inventory", label: "Inventory" },
    { href: "/dashboard/admin/users", label: "Admin" },
  ];

  // Add Activity Logs link for supervisors
  if (currentUser?.role === "supervisor") {
    navLinks.push({
      href: "/dashboard/admin/activity-logs",
      label: "Activity Logs",
    });
  }

  return (
    <nav className="bg-white shadow print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-xl font-bold text-gray-900">UC Transportation</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      active
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-700">{userEmail}</span>
            <form action={onSignOut}>
              <button
                type="submit"
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

