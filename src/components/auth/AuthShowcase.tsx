"use client";

import { motion, type Variants } from "framer-motion";
import { AuthLogo } from "./AuthLogo";

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
    <section className="relative flex min-h-[42vh] flex-col justify-end overflow-hidden bg-black lg:min-h-screen lg:justify-between">
      <div
        className="auth-showcase-bg absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat opacity-60 motion-safe:animate-[auth-ken-burns_24s_ease-in-out_infinite_alternate]"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black/50" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(200,16,46,0.2),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 hidden p-10 lg:block">
        <AuthLogo variant="dark" />
      </div>

      <motion.div
        className="relative z-10 flex flex-col gap-8 p-6 pb-8 sm:p-8 lg:max-w-2xl lg:p-14 lg:pb-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="lg:hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C8102E]/40 bg-[#C8102E]/10 px-3 py-1.5">
            <span className="h-1 w-1 rounded-full bg-[#E63946]" />
            <span className="text-[0.6rem] tracking-[0.18em] text-white/80 uppercase">
              Exclusive Dubai Real Estate
            </span>
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.08] font-normal text-white">
            Own Dubai&apos;s Most
            <span className="block text-[#E63946]">Prestigious Properties</span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Access private listings, premium developer projects, and exclusive
            investment opportunities.
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-3 gap-3 border-t border-white/15 pt-6 sm:gap-6"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="font-[family-name:var(--font-display)] text-lg text-white sm:text-2xl">
                {stat.value}
              </p>
              <p className="text-[0.62rem] leading-snug tracking-[0.12em] text-[#E63946] uppercase sm:text-[0.7rem]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
