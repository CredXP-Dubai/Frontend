"use client";

import { motion } from "framer-motion";
import { HERO_COPY } from "@/lib/cinematic/constants";

interface CinematicCTAProps {
  visible: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function CinematicCTA({ visible }: CinematicCTAProps) {
  return (
    <motion.div
      className="cinematic-cta"
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="cinematic-cta__gradient" />

      <motion.h1
        className="cinematic-cta__heading"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 36,
        }}
        transition={{ duration: 0.9, ease, delay: visible ? 0.05 : 0 }}
      >
        {HERO_COPY.heading}
      </motion.h1>

      <motion.p
        className="cinematic-cta__subheading"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 28,
        }}
        transition={{ duration: 0.9, ease, delay: visible ? 0.12 : 0 }}
      >
        {HERO_COPY.subheading}
      </motion.p>

      <div className="cinematic-cta__actions">
        <motion.a
          href="#properties"
          className="cinematic-cta__btn cinematic-cta__btn--primary"
          initial={false}
          animate={{
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 24,
          }}
          transition={{ duration: 0.85, ease, delay: visible ? 0.2 : 0 }}
        >
          {HERO_COPY.ctaPrimary}
        </motion.a>

        <motion.a
          href="#consultation"
          className="cinematic-cta__btn cinematic-cta__btn--secondary"
          initial={false}
          animate={{
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 24,
          }}
          transition={{ duration: 0.85, ease, delay: visible ? 0.28 : 0 }}
        >
          {HERO_COPY.ctaSecondary}
        </motion.a>
      </div>
    </motion.div>
  );
}
