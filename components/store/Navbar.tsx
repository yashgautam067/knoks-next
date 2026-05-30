"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=boxer-brief", label: "Boxer Briefs" },
  { href: "/shop?category=trunk", label: "Trunks" },
  { href: "/shop?category=pack", label: "Packs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut } = useAuth();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-cream"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Nav Links — Left */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm lg:text-base font-heading tracking-[0.15em] uppercase transition-colors",
                  pathname === link.href
                    ? "text-cream"
                    : "text-silver/50 hover:text-cream"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo — Center */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <span className="text-cream font-heading text-2xl md:text-3xl lg:text-4xl tracking-[0.3em] font-bold select-none">
              KNOKS
            </span>
          </Link>

          {/* Desktop Nav Links — Right */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm lg:text-base font-heading tracking-[0.15em] uppercase text-silver/50 hover:text-cream transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-5">
            <Link
              href="/shop"
              className="text-silver/50 hover:text-cream transition-colors hidden md:block"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/account/wishlist"
              className="text-silver/50 hover:text-cream transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red text-cream text-[10px] font-mono flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="text-silver/50 hover:text-cream transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red text-cream text-[10px] font-mono flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={isAdmin ? "/admin" : "/account"}
                  className="text-silver/50 hover:text-cream transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={signOut}
                  className="text-silver/50 hover:text-red transition-colors hidden md:block"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-silver/50 hover:text-cream transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-t border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-heading tracking-[0.2em] uppercase text-silver hover:text-cream transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <div className="border-t border-border pt-4">
                    <p className="text-cream text-sm font-body">
                      {profile?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="text-red text-sm font-heading tracking-widest"
                  >
                    SIGN OUT
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
