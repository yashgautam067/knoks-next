"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-charcoal border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Image
          src="/images/logo-white.png"
          alt="KNOKS"
          width={100}
          height={34}
          className="h-7 w-auto"
        />
        <p className="text-silver/30 text-[10px] font-heading tracking-[0.2em] mt-2">
          ADMIN PANEL
        </p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" &&
              pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-body transition-colors",
                isActive
                  ? "bg-red/10 text-red border-l-2 border-red"
                  : "text-silver/50 hover:text-cream hover:bg-white/5 border-l-2 border-transparent"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-border space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-silver/30 text-xs font-body hover:text-cream transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View Store
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-cream text-xs font-body">
              {profile?.name || "Admin"}
            </p>
            <p className="text-silver/30 text-[10px] font-body">Admin</p>
          </div>
          <button
            onClick={signOut}
            className="text-silver/30 hover:text-red transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
