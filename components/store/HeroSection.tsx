"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

const heroImages = [
  "/images/hero/hero-jeep.jpg",
  "/images/hero/hero-black-product.jpg",
  "/images/hero/hero-navy-product.jpg",
  "/images/hero/hero-grey-model.jpg",
  "/images/hero/hero-black-model.jpg",
  "/images/hero/hero-shower.jpg",
  "/images/hero/hero-bathtub.jpg",
  "/images/hero/hero-couch.jpg",
  "/images/hero/hero-comfort.jpg",
  "/images/hero/hero-lifestyle.jpg",
];

const AUTO_SCROLL_INTERVAL = 4000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="w-full bg-black pt-20">
      {/* ═══════════════════════════════════════════════ */}
      {/* MOBILE: Image on top, text below               */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="block md:hidden">
        {/* Image Carousel */}
        <div className="relative w-full" style={{ height: "55vh" }}>
          {heroImages.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: i === current ? 1 : 0,
                backgroundImage: `url(${src})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          ))}

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 left-3 w-8 h-8 flex items-center justify-center bg-black/50 text-white/80 rounded-full"
            style={{ zIndex: 2 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 right-3 w-8 h-8 flex items-center justify-center bg-black/50 text-white/80 rounded-full"
            style={{ zIndex: 2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 2 }}>
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}>
                <div className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-cream" : "w-2 bg-white/30"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Text Content Below Image */}
        <div className="px-6 py-8">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
            <span className="text-gold text-[10px] font-heading tracking-[0.2em]">
              ESSENTIAL LUXURY
            </span>
          </div>

          <h1 className="text-cream font-heading text-5xl leading-[0.9] tracking-wider mb-4">
            HIT
            <br />
            <span className="text-gold">DIFFERENT.</span>
          </h1>

          <p className="text-silver/60 font-body text-sm mb-6 max-w-xs">
            Premium underwear engineered for the modern man. Designed for confidence.
          </p>

          <div className="flex gap-3 mb-8">
            <Link href="/shop">
              <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Shop Now
              </Button>
            </Link>
            <Link href="/shop?category=pack">
              <Button variant="secondary">View Packs</Button>
            </Link>
          </div>

          <div className="flex gap-6">
            {[
              { value: "50K+", label: "Customers" },
              { value: "4.8★", label: "Rating" },
              { value: "100%", label: "Cotton" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-cream font-heading text-lg tracking-wider">{stat.value}</p>
                <p className="text-silver/30 text-[9px] font-body mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* DESKTOP: Split layout — text left, image right */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-row" style={{ height: "calc(100vh - 80px)" }}>
        {/* Left — Static Text */}
        <div className="w-[45%] flex items-center px-12 lg:px-16">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-gold text-xs font-heading tracking-[0.2em]">
                ESSENTIAL LUXURY
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-cream font-heading text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-wider mb-6"
            >
              HIT
              <br />
              <span className="text-gold">DIFFERENT.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-silver/60 font-body text-lg mb-8 max-w-sm"
            >
              Premium underwear engineered for the modern man. Designed for confidence, crafted for comfort.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/shop">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Shop Now
                </Button>
              </Link>
              <Link href="/shop?category=pack">
                <Button variant="secondary" size="lg">View Packs</Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex gap-8 mb-10"
            >
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "4.8★", label: "Average Rating" },
                { value: "100%", label: "Premium Cotton" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-cream font-heading text-xl lg:text-2xl tracking-wider">{stat.value}</p>
                  <p className="text-silver/30 text-[10px] lg:text-xs font-body mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Slide indicators in text panel */}
            <div className="flex items-center gap-3">
              {heroImages.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} className="group relative">
                  <div className={`h-[2px] transition-all duration-500 ${i === current ? "w-8 bg-cream" : "w-4 bg-silver/20 group-hover:bg-silver/50"}`} />
                  {i === current && (
                    <motion.div
                      className="absolute top-0 left-0 h-[2px] bg-gold"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTO_SCROLL_INTERVAL / 1000, ease: "linear" }}
                      key={`p-${current}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Image Panel */}
        <div className="w-[55%] relative">
          {/* Images with crossfade using background-image */}
          {heroImages.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: i === current ? 1 : 0,
                backgroundImage: `url(${src})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          ))}

          {/* Left edge blend */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" style={{ zIndex: 1 }} />

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 left-4 w-11 h-11 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/50 transition-all rounded-full"
            style={{ zIndex: 2 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 right-4 w-11 h-11 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/50 transition-all rounded-full"
            style={{ zIndex: 2 }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 right-6 text-white/30 font-heading text-sm tracking-widest" style={{ zIndex: 2 }}>
            <span className="text-white">{String(current + 1).padStart(2, "0")}</span>
            <span className="mx-1">/</span>
            <span>{String(heroImages.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
