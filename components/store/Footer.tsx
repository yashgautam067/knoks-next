"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "Boxer Briefs", href: "/shop?category=boxer-brief" },
    { label: "Trunks", href: "/shop?category=trunk" },
    { label: "Briefs", href: "/shop?category=brief" },
    { label: "Packs", href: "/shop?category=pack" },
  ],
  support: [
    { label: "Track Order", href: "/track" },
    { label: "Size Guide", href: "/shop" },
    { label: "FAQs", href: "/faqs" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/logo-white.png"
              alt="KNOKS"
              width={100}
              height={34}
              className="h-7 w-auto opacity-90 mb-4"
            />
            <p className="text-silver/50 text-sm font-body leading-relaxed mb-6 max-w-xs">
              100% cotton premium underwear. Designed for comfort,
              crafted for confidence. Hit Different.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-silver/30 hover:text-cream transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-silver/30 hover:text-cream transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-silver/30 hover:text-cream transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-cream text-xs font-heading tracking-[0.2em] uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-silver/50 text-sm font-body hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-cream text-xs font-heading tracking-[0.2em] uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-silver/50 text-sm font-body hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream text-xs font-heading tracking-[0.2em] uppercase mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-silver/50 text-sm font-body">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                contact@knoks.in
              </li>
              <li className="flex items-start gap-2 text-silver/50 text-sm font-body">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                +91 99999 99999
              </li>
              <li className="flex items-start gap-2 text-silver/50 text-sm font-body">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                Noida, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-silver/30 text-xs font-body">
            © {new Date().getFullYear()} KNOKS. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.company.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-silver/30 text-xs font-body hover:text-cream transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
