"use client";

import { motion } from "framer-motion";
import { AuthLogo } from "./AuthLogo";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <motion.div
      className="w-full max-w-[480px]"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="rounded-3xl border border-luxury-gold/20 bg-white/4 p-7 shadow-[0_32px_80px_rgb(0_0_0/0.55),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-2xl sm:p-9"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="mb-8 space-y-5">
          <AuthLogo />
          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.25rem)] font-light text-white">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-luxury-muted">{subtitle}</p>
          </div>
        </div>

        {children}
      </motion.div>
    </motion.div>
  );
}
