"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield } from "lucide-react";
import HeroSection from "@/components/store/HeroSection";
import ProductCard from "@/components/store/ProductCard";
import Button from "@/components/ui/Button";
import type { Product } from "@/types";
import toast from "react-hot-toast";

const features = [
  {
    icon: Star,
    title: "Premium Quality",
    desc: "100% premium cotton for all-day comfort & confidence",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Quick dispatch & delivery across India",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    desc: "Built to last — premium in every stitch",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetch("/api/products?limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(console.error);
  }, []);

  const handleSubscribe = async () => {
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setEmail("");
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <HeroSection />


      {/* Promotional Banner */}
      <section className="w-full bg-black">
        <Link href="/shop?category=pack" className="block relative group">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/banner-pack.jpg"
                alt="KNOKS Pack - Buy 4 for ₹799"
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
                style={{ imageRendering: "auto" }}
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-all duration-500" />
            </div>
            {/* Shop Now Button */}
            <div className="flex justify-center mt-6">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-goldLight text-black px-8 py-3 text-sm font-heading tracking-[0.2em] uppercase shadow-lg group-hover:shadow-gold/30 transition-all duration-300 group-hover:scale-105">
                SHOP NOW
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-black gold-bg-pattern relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-xs font-heading tracking-[0.4em] block mb-4">
              CURATED FOR YOU
            </span>
            <h2 className="text-cream font-heading text-4xl md:text-6xl tracking-widest mb-4">
              BEST SELLERS
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
            <p className="text-silver/50 font-body max-w-lg mx-auto">
              Our most loved products, trusted by thousands of men across India
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.slice(0, 6).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/shop">
              <Button
                variant="secondary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* Lifestyle / Philosophy Section */}
      <section className="relative py-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-[500px] md:h-[650px]">
            {/* Use hero image as lifestyle shot */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url(/images/hero/hero-jeep.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal md:hidden" />
          </div>
          <div className="bg-charcoal flex items-center p-8 md:p-16 gold-bg-pattern relative">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <span className="text-gradient text-xs font-heading tracking-[0.4em]">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-cream font-heading text-4xl md:text-5xl tracking-wider mt-4 mb-2">
                BUILT DIFFERENT.
              </h2>
              <h2 className="text-gradient font-heading text-4xl md:text-5xl tracking-wider mb-6">
                WORN BETTER.
              </h2>
              <div className="w-12 h-[1px] bg-gradient-to-r from-gold to-transparent mb-6" />
              <p className="text-silver/60 font-body leading-relaxed mb-8">
                Every pair of KNOKS underwear is crafted from 100% premium cotton.
                We obsess over fabric quality, fit engineering, and design
                details that other brands overlook. The result? Underwear that
                feels like a second skin and lasts wash after wash.
              </p>
              <Link href="/shop">
                <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Explore Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* Features */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 border border-border/50 hover:border-gold/30 transition-all duration-500 group"
              >
                <div className="w-14 h-14 mx-auto mb-4 border border-gold/20 flex items-center justify-center group-hover:border-gold/50 transition-colors">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-cream text-sm font-heading tracking-widest mb-2">
                  {feature.title}
                </h3>
                <p className="text-silver/40 text-xs font-body">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* Newsletter */}
      <section className="py-24 bg-charcoal relative gold-bg-pattern">
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-xs font-heading tracking-[0.4em] block mb-4">
              EXCLUSIVE ACCESS
            </span>
            <h2 className="text-cream font-heading text-3xl md:text-5xl tracking-widest mb-3">
              JOIN THE KNOKS CLUB
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
            <p className="text-silver/50 font-body mb-8">
              Get 15% off your first order + exclusive drops & early access
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-black/50 border border-gold/20 text-cream px-4 py-3 text-sm font-body placeholder:text-silver/30 focus:outline-none focus:border-gold transition-colors"
              />
              <Button
                variant="primary"
                onClick={handleSubscribe}
                isLoading={subscribing}
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
