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
      className="group relative w-full overflow-hidden rounded-xl bg-[#C8102E] px-6 py-4 text-sm font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#9B0C24] disabled:cursor-not-allowed disabled:opacity-60"
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.25 }}
    >
      <span className="absolute inset-0 opacity-0 shadow-[0_0_32px_rgba(200,16,46,0.4)] transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
