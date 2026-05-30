"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

const heroSlides = [
  {
    image: "/images/hero/hero-shower.jpg",
    title: "ELEVATE",
    titleAccent: "EVERY MOMENT.",
    subtitle: "Luxury you wear. Confidence you feel.",
    align: "left" as const,
  },
  {
    image: "/images/hero/hero-bathtub.jpg",
    title: "UNWIND.",
    titleAccent: "IN COMFORT.",
    subtitle: "Simple by design. Superior by nature.",
    align: "left" as const,
  },
  {
    image: "/images/hero/hero-couch.jpg",
    title: "DESIGNED FOR",
    titleAccent: "CONFIDENCE.",
    subtitle: "Premium underwear engineered for the modern man.",
    align: "right" as const,
  },
  {
    image: "/images/hero/hero-comfort.jpg",
    title: "COMFORT THAT",
    titleAccent: "MOVES WITH YOU.",
    subtitle: "Soft. Breathable. Made for everyday.",
    align: "left" as const,
  },
  {
    image: "/images/hero/hero-lifestyle.jpg",
    title: "ENJOY",
    titleAccent: "EVERY MOVE.",
    subtitle: "Underwear that keeps up with your life.",
    align: "left" as const,
  },
];

const AUTO_SCROLL_INTERVAL = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-scroll
  useEffect(() => {
    const timer = setInterval(next, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-30%" : "30%",
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Preload all images */}
      <div className="hidden">
        {heroSlides.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.image} src={s.image} alt="" />
        ))}
      </div>

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.image})`,
              willChange: "transform",
            }}
          />

          {/* Gradient Overlays — lighter for image clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content — always on top */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`max-w-xl ${
                slide.align === "right" ? "ml-auto text-right" : ""
              }`}
            >
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 bg-red/10 border border-red/20 px-4 py-1.5 mb-6 ${
                  slide.align === "right" ? "flex-row-reverse" : ""
                }`}
              >
                <span className="w-2 h-2 bg-red rounded-full animate-pulse" />
                <span className="text-red text-xs font-heading tracking-[0.2em]">
                  ESSENTIAL LUXURY
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-cream font-heading text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-wider mb-6">
                {slide.title}
                <br />
                <span className="text-red">{slide.titleAccent}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-silver/70 font-body text-lg md:text-xl mb-8 max-w-md">
                {slide.subtitle}
              </p>

              {/* CTAs */}
              <div
                className={`flex flex-wrap gap-4 ${
                  slide.align === "right" ? "justify-end" : ""
                }`}
              >
                <Link href="/shop">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    Shop Now
                  </Button>
                </Link>
                <Link href="/shop?category=pack">
                  <Button variant="secondary" size="lg">
                    View Packs
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div
                className={`flex gap-8 mt-12 ${
                  slide.align === "right" ? "justify-end" : ""
                }`}
              >
                {[
                  { value: "50K+", label: "Happy Customers" },
                  { value: "4.8★", label: "Average Rating" },
                  { value: "100%", label: "Premium Cotton" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-cream font-heading text-2xl md:text-3xl tracking-wider">
                      {stat.value}
                    </p>
                    <p className="text-silver/40 text-xs font-body mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute z-20 bottom-1/2 translate-y-1/2 left-4 md:left-8">
        <button
          onClick={prev}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/10 text-cream/60 hover:text-cream hover:bg-black/50 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute z-20 bottom-1/2 translate-y-1/2 right-4 md:right-8">
        <button
          onClick={next}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/10 text-cream/60 hover:text-cream hover:bg-black/50 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative"
          >
            <div
              className={`h-[2px] transition-all duration-500 ${
                i === current
                  ? "w-10 bg-cream"
                  : "w-5 bg-silver/30 group-hover:bg-silver/60"
              }`}
            />
            {/* Auto-scroll progress indicator */}
            {i === current && (
              <motion.div
                className="absolute top-0 left-0 h-[2px] bg-red"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: AUTO_SCROLL_INTERVAL / 1000,
                  ease: "linear",
                }}
                key={`progress-${current}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute z-20 bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-silver/30 text-[10px] font-heading tracking-[0.3em]">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-8 bg-gradient-to-b from-silver/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
