"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, RefreshCw } from "lucide-react";
import HeroSection from "@/components/store/HeroSection";
import MarqueeStrip from "@/components/store/MarqueeStrip";
import ProductCard from "@/components/store/ProductCard";
import Button from "@/components/ui/Button";
import type { Product } from "@/types";
import toast from "react-hot-toast";

const features = [
  {
    icon: Star,
    title: "Premium Quality",
    desc: "95% combed cotton, 5% elastane for all-day comfort",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Free delivery on orders above ₹999",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    desc: "30-day hassle-free returns & exchanges",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "Don't love it? Send it back, no questions asked",
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

      {/* Marquee */}
      <MarqueeStrip />

      {/* Featured Products */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-cream font-heading text-4xl md:text-5xl tracking-widest mb-3">
              BEST SELLERS
            </h2>
            <p className="text-silver/50 font-body max-w-lg mx-auto">
              Our most loved products, trusted by thousands of men across India
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.slice(0, 6).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-12">
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

      {/* Lifestyle Section */}
      <section className="relative py-0">
        <div className="grid md:grid-cols-2">
          <div className="relative h-[500px] md:h-[600px]">
            <Image
              src="/images/products/product-2.jpg"
              alt="KNOKS Lifestyle"
              fill
              className="object-cover"
            />
          </div>
          <div className="bg-charcoal flex items-center p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-red text-xs font-heading tracking-[0.3em]">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-cream font-heading text-4xl md:text-5xl tracking-wider mt-4 mb-6">
                BUILT DIFFERENT.
                <br />
                <span className="text-red">WORN BETTER.</span>
              </h2>
              <p className="text-silver/60 font-body leading-relaxed mb-8">
                Every pair of KNOKS underwear is engineered from the ground up.
                We obsess over fabric selection, fit engineering, and design
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

      {/* Features */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <feature.icon className="w-8 h-8 text-red mx-auto mb-4" />
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

      {/* Newsletter */}
      <section className="py-20 bg-charcoal border-t border-b border-border">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-cream font-heading text-3xl md:text-4xl tracking-widest mb-3">
              JOIN THE KNOKS CLUB
            </h2>
            <p className="text-silver/50 font-body mb-8">
              Get 15% off your first order + exclusive drops & early access
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-card border border-border text-cream px-4 py-3 text-sm font-body placeholder:text-silver/30 focus:outline-none focus:border-red"
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
