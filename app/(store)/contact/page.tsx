"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

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
              GET IN TOUCH
            </span>
            <h1 className="text-cream font-heading text-4xl md:text-6xl tracking-widest mb-4">
              CONTACT US
            </h1>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="text-silver/60 font-body text-lg max-w-2xl mx-auto">
              Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Contact Info + Form */}
      <section className="py-20 bg-charcoal">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-cream font-heading text-2xl tracking-widest mb-8">
                REACH OUT TO US
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-gold/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-cream font-heading text-sm tracking-widest mb-1">EMAIL</h3>
                    <p className="text-silver/60 font-body">contact@knoks.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-gold/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-cream font-heading text-sm tracking-widest mb-1">PHONE</h3>
                    <p className="text-silver/60 font-body">+91 99999 99999</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-gold/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-cream font-heading text-sm tracking-widest mb-1">ADDRESS</h3>
                    <p className="text-silver/60 font-body">Noida, India</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-cream font-heading text-xs tracking-widest block mb-2">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black/50 border border-border text-cream px-4 py-3 text-sm font-body placeholder:text-silver/30 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-cream font-heading text-xs tracking-widest block mb-2">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-black/50 border border-border text-cream px-4 py-3 text-sm font-body placeholder:text-silver/30 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="text-cream font-heading text-xs tracking-widest block mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full bg-black/50 border border-border text-cream px-4 py-3 text-sm font-body placeholder:text-silver/30 focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  isLoading={sending}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
