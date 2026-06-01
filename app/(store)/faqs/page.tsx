"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What sizes do you offer?",
    a: "We offer sizes from S to XXL. Please refer to our Size Guide on the shop page for detailed measurements to find your perfect fit.",
  },
  {
    q: "How long does delivery take?",
    a: "We aim to dispatch all orders within 2-3 business days. Delivery typically takes 5-7 business days depending on your location across India.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets. All payments are processed securely.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order from your account dashboard or our Track Order page.",
  },
  {
    q: "What materials are used in your products?",
    a: "All KNOKS products are made with 100% premium cotton — soft, breathable, and built to last. Check each product page for specific details.",
  },
  {
    q: "How do I contact customer support?",
    a: "You can reach us via email at contact@knoks.com or call us at +91 99999 99999. We typically respond within 24 hours.",
  },
];

export default function FAQsPage() {
  const [open, setOpen] = useState<number | null>(null);

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
              HELP CENTER
            </span>
            <h1 className="text-cream font-heading text-4xl md:text-6xl tracking-widest mb-4">
              FAQs
            </h1>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="text-silver/60 font-body text-lg max-w-2xl mx-auto">
              Find answers to commonly asked questions
            </p>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* FAQ List */}
      <section className="py-16 bg-charcoal">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-border/50 hover:border-gold/20 transition-colors"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-cream font-heading text-sm tracking-widest pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-silver/50 font-body text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
