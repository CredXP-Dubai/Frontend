"use client";

import { motion } from "framer-motion";
import { designTokens } from "@/styles/design-tokens";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: designTokens.motion.duration.slow,
        ease: designTokens.motion.easeLuxury,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
