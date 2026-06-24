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
        className="rounded-3xl border border-black/10 bg-white p-7 shadow-[0_24px_64px_rgba(0,0,0,0.12)] sm:p-9"
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="mb-8 space-y-5">
          <AuthLogo variant="light" />
          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.25rem)] font-normal text-black">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-black/65">{subtitle}</p>
          </div>
        </div>

        {children}
      </motion.div>
    </motion.div>
  );
}
