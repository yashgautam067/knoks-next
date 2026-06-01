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
    <nav
      className={cn(
        "fixed left-0 right-0 transition-all duration-500",
        scrolled
          ? "bg-black/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/20"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      )}
      style={{ zIndex: 9999, top: "36px" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Desktop Layout: Logo left, Nav + Icons right */}
        <div className="hidden md:flex items-center justify-between h-20">
          {/* Logo — Left */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-icon.jpg"
              alt="KNOKS"
              className="h-10 lg:h-12 w-auto"
            />
            <span className="text-cream font-heading text-2xl lg:text-3xl tracking-[0.25em] font-bold select-none">
              KNOKS
            </span>
          </Link>

          {/* Nav Links + Icons — Right */}
          <div className="flex items-center gap-5 lg:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm lg:text-base font-heading tracking-[0.15em] uppercase transition-colors duration-300 whitespace-nowrap",
                  pathname === link.href
                    ? "text-cream"
                    : "text-silver/60 hover:text-cream"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="w-px h-5 bg-border" />

            {/* Icons */}
            <Link
              href="/shop"
              className="text-silver/60 hover:text-cream transition-colors duration-300"
            >
              <Search className="w-5 h-5" />
            </Link>



            <Link
              href="/account/wishlist"
              className="text-silver/60 hover:text-cream transition-colors duration-300 relative"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red text-cream text-[10px] font-mono flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="text-silver/60 hover:text-cream transition-colors duration-300 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red text-cream text-[10px] font-mono flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={isAdmin ? "/admin" : "/account"}
                  className="text-silver/60 hover:text-cream transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={signOut}
                  className="text-silver/60 hover:text-red transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-silver/60 hover:text-cream transition-colors duration-300"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between h-16">
          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-cream"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-icon.jpg"
              alt="KNOKS"
              className="h-8 w-auto"
            />
            <span className="text-cream font-heading text-lg tracking-[0.2em] font-bold select-none">
              KNOKS
            </span>
          </Link>

          {/* Mobile Icons */}
          <div className="flex items-center gap-3">

            <Link
              href="/cart"
              className="text-silver/60 hover:text-cream transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red text-cream text-[10px] font-mono flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                href={isAdmin ? "/admin" : "/account"}
                className="text-silver/60 hover:text-cream transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-silver/60 hover:text-cream transition-colors"
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
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block text-base font-heading tracking-[0.2em] uppercase transition-colors py-3 border-b border-border/30",
                    pathname === link.href
                      ? "text-cream"
                      : "text-silver/60 hover:text-cream"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <div className="pt-4">
                    <p className="text-cream text-sm font-body">
                      {profile?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="text-red text-sm font-heading tracking-widest py-3"
                  >
                    SIGN OUT
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
