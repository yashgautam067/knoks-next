"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect personal information that you voluntarily provide to us when you register on the website, place an order, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, shipping address, and payment information.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use the information we collect to process your orders, send you order confirmations and updates, respond to your inquiries, improve our website and services, send promotional communications (with your consent), and comply with legal obligations.",
  },
  {
    title: "3. Information Sharing",
    content:
      "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to fulfill your order (e.g., shipping partners, payment processors) or as required by law.",
  },
  {
    title: "4. Data Security",
    content:
      "We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    title: "5. Cookies",
    content:
      "Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.",
  },
  {
    title: "6. Your Rights",
    content:
      "You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.",
  },
  {
    title: "7. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.",
  },
  {
    title: "8. Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at contact@knoks.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-20 gold-bg-pattern">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold text-xs font-heading tracking-[0.4em] block mb-4">
              LEGAL
            </span>
            <h1 className="text-cream font-heading text-4xl md:text-6xl tracking-widest mb-4">
              PRIVACY POLICY
            </h1>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="text-silver/60 font-body">
              Last updated: June 2026
            </p>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Content */}
      <section className="py-16 bg-charcoal">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <p className="text-silver/60 font-body leading-relaxed mb-10">
            At KNOKS, we are committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, and safeguard your personal information when you
            visit our website or make a purchase.
          </p>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <h2 className="text-cream font-heading text-lg tracking-widest mb-3">
                  {section.title}
                </h2>
                <p className="text-silver/50 font-body text-sm leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
