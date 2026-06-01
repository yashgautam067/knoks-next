"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
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
              OUR STORY
            </span>
            <h1 className="text-cream font-heading text-4xl md:text-6xl tracking-widest mb-4">
              ABOUT KNOKS
            </h1>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="text-silver/60 font-body text-lg max-w-2xl mx-auto leading-relaxed">
              We&apos;re not just another underwear brand. We&apos;re a movement for men who
              refuse to settle for less.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Mission */}
      <section className="py-20 bg-charcoal">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-gradient font-heading text-3xl md:text-4xl tracking-widest mb-6">
              OUR MISSION
            </h2>
            <p className="text-silver/60 font-body leading-relaxed mb-6">
              At KNOKS, we believe that what you wear underneath shapes how you feel on the
              outside. Our mission is to deliver 100% premium cotton underwear that combines
              superior comfort with timeless design.
            </p>
            <p className="text-silver/60 font-body leading-relaxed">
              Every stitch, every seam, every detail is obsessed over to create underwear
              that doesn&apos;t just fit — it transforms how you move through your day with
              unmatched confidence and comfort.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Values */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-cream font-heading text-3xl md:text-4xl tracking-widest mb-4">
              WHAT WE STAND FOR
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "QUALITY FIRST",
                desc: "100% premium cotton, rigorously tested for durability, softness, and performance.",
              },
              {
                title: "BUILT FOR MEN",
                desc: "Designed with the modern man in mind — every product is engineered for real-world comfort.",
              },
              {
                title: "NO COMPROMISE",
                desc: "From fabric selection to final packaging, we never cut corners. Period.",
              },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border/50 p-8 text-center hover:border-gold/30 transition-all duration-500"
              >
                <h3 className="text-gold font-heading text-sm tracking-widest mb-4">
                  {value.title}
                </h3>
                <p className="text-silver/50 font-body text-sm leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
