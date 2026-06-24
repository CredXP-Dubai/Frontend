"use client";

import { motion, type Variants } from "framer-motion";

const stats = [
  { value: "AED 50B+", label: "Property Inventory" },
  { value: "100+", label: "Premium Projects" },
  { value: "25+", label: "Trusted Developers" },
] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function AuthShowcase() {
  return (
    <section className="relative flex min-h-[42vh] flex-col justify-end overflow-hidden lg:min-h-screen lg:justify-between">
      <div
        className="auth-showcase-bg absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat motion-safe:animate-[auth-ken-burns_24s_ease-in-out_infinite_alternate]"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-linear-to-br from-luxury-bg via-luxury-bg/75 to-luxury-bg/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-luxury-bg via-transparent to-luxury-bg/30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(212_175_55/0.12),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 hidden p-10 lg:block">
        <div className="inline-flex items-center gap-2 rounded-full border border-luxury-gold/25 bg-luxury-gold/10 px-4 py-2 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-luxury-gold shadow-[0_0_12px_rgb(212_175_55/0.8)]" />
          <span className="text-[0.68rem] tracking-[0.22em] text-luxury-gold-light uppercase">
            Exclusive Dubai Real Estate Platform
          </span>
        </div>
      </div>

      <motion.div
        className="relative z-10 flex flex-col gap-8 p-6 pb-8 sm:p-8 lg:max-w-2xl lg:p-14 lg:pb-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="lg:hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-luxury-gold/25 bg-luxury-gold/10 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1 w-1 rounded-full bg-luxury-gold" />
            <span className="text-[0.6rem] tracking-[0.18em] text-luxury-gold-light uppercase">
              Exclusive Dubai Real Estate
            </span>
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.08] font-light text-white">
            Own Dubai&apos;s Most
            <span className="block text-luxury-gold-light">Prestigious Properties</span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-luxury-muted sm:text-base">
            Access private listings, premium developer projects, and exclusive
            investment opportunities.
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-6"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="font-[family-name:var(--font-display)] text-lg text-luxury-gold-light sm:text-2xl">
                {stat.value}
              </p>
              <p className="text-[0.62rem] leading-snug tracking-[0.12em] text-luxury-muted uppercase sm:text-[0.7rem]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
