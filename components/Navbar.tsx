"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-brand-600 transition-colors">
              <span className="text-white text-sm">🌿</span>
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">
              Emit<span className="text-brand-600">Less</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                  pathname === link.href
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-brand-50 px-3 py-1.5 rounded-full">
              <span className="text-xs text-brand-700 font-semibold">🏆 Top 5 this week</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
