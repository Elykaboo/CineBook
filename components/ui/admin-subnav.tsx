"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/movies", label: "Movies" },
  { href: "/admin/halls", label: "Halls" },
  { href: "/admin/showtimes", label: "Showtimes" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/users", label: "Users" },
];

export function AdminSubnav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-border-1">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-t-chip px-3 py-2 text-sm font-medium transition-colors duration-150",
              isActive
                ? "bg-surface-brand-subtle text-teal-700"
                : "text-fg-2 hover:text-fg-1"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
