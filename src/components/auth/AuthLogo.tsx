"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AuthLogo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isDark = variant === "dark";

  return (
    <Link href="/" className="group inline-flex flex-col gap-1">
      <motion.span
        className={`font-[family-name:var(--font-display)] text-xl font-semibold tracking-[0.2em] uppercase ${
          isDark ? "text-white group-hover:text-[#E63946]" : "text-black group-hover:text-[#C8102E]"
        }`}
        whileHover={{ letterSpacing: "0.24em" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        CredXP
      </motion.span>
      <span
        className={`text-[0.65rem] tracking-[0.42em] uppercase ${
          isDark ? "text-white/55" : "text-black/45"
        }`}
      >
        Dubai
      </span>
    </Link>
  );
}
