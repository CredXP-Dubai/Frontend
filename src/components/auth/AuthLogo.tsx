"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AuthLogo() {
  return (
    <Link href="/" className="group inline-flex flex-col gap-1">
      <motion.span
        className="font-[family-name:var(--font-display)] text-xl tracking-[0.28em] text-luxury-gold-light uppercase"
        whileHover={{ letterSpacing: "0.32em" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        CredXP
      </motion.span>
      <span className="text-[0.65rem] tracking-[0.42em] text-luxury-muted uppercase">
        Dubai
      </span>
    </Link>
  );
}
