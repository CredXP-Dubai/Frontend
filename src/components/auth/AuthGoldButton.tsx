"use client";

import { motion } from "framer-motion";

interface AuthGoldButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export function AuthGoldButton({
  children,
  type = "button",
  disabled = false,
  onClick,
}: AuthGoldButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl px-6 py-4 text-sm font-semibold tracking-[0.16em] text-luxury-bg uppercase disabled:cursor-not-allowed disabled:opacity-60"
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.25 }}
    >
      <span className="absolute inset-0 bg-linear-to-r from-[#8b7028] via-luxury-gold to-luxury-gold-light" />
      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-[auth-shimmer_1.4s_ease-in-out_infinite]" />
      <span className="absolute inset-0 opacity-0 shadow-[0_0_40px_rgb(212_175_55/0.45)] transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
