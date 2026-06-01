"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using the KNOKS website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.",
  },
  {
    title: "2. Products & Pricing",
    content:
      "All product descriptions and prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. Prices displayed are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.",
  },
  {
    title: "3. Orders & Payment",
    content:
      "When you place an order, you are making an offer to purchase the selected products. We reserve the right to accept or reject any order. Payment must be made at the time of order placement through our accepted payment methods.",
  },
  {
    title: "4. Shipping & Delivery",
    content:
      "We aim to dispatch orders within 2-3 business days. Delivery timelines may vary depending on your location. We are not responsible for delays caused by shipping carriers or unforeseen circumstances.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "All content on this website, including text, graphics, logos, images, and software, is the property of KNOKS and is protected by intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.",
  },
  {
    title: "6. User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "KNOKS shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid by you for the specific product in question.",
  },
  {
    title: "8. Governing Law",
    content:
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Delhi, India.",
  },
  {
    title: "9. Changes to Terms",
    content:
      "We reserve the right to update these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website constitutes acceptance of the modified terms.",
  },
  {
    title: "10. Contact",
    content:
      "For any questions regarding these Terms and Conditions, please contact us at contact@knoks.com.",
  },
];

export default function TermsPage() {
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
              TERMS & CONDITIONS
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
            Please read these Terms and Conditions carefully before using the KNOKS
            website or purchasing any products from us.
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
