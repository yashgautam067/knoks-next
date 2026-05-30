"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { User, Package, MapPin, Heart } from "lucide-react";
import Link from "next/link";

const accountLinks = [
  {
    href: "/account/orders",
    icon: Package,
    label: "My Orders",
    desc: "View your order history and track deliveries",
  },
  {
    href: "/account/addresses",
    icon: MapPin,
    label: "Addresses",
    desc: "Manage your saved delivery addresses",
  },
  {
    href: "/account/wishlist",
    icon: Heart,
    label: "Wishlist",
    desc: "Items you've saved for later",
  },
];

export default function AccountPage() {
  const { user, profile } = useAuth();

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-cream font-heading text-4xl tracking-widest mb-8">
            MY ACCOUNT
          </h1>

          {/* Profile Card */}
          <div className="bg-card border border-border p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red/10 border border-red/20 flex items-center justify-center">
                <User className="w-8 h-8 text-red" />
              </div>
              <div>
                <h2 className="text-cream font-heading text-xl tracking-wider">
                  {profile?.name || "User"}
                </h2>
                <p className="text-silver/50 font-body text-sm">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid md:grid-cols-3 gap-4">
            {accountLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="block bg-card border border-border p-6 hover:border-silver/50 transition-all group"
                >
                  <link.icon className="w-8 h-8 text-red mb-4" />
                  <h3 className="text-cream font-heading text-sm tracking-widest mb-2 group-hover:text-silver transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-silver/40 text-xs font-body">
                    {link.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
