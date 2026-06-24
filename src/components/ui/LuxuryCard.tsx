"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { theme } from "@/styles/theme";

interface LuxuryCardProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  hover?: boolean;
}

export function LuxuryCard({ children, href, className = "", hover = true }: LuxuryCardProps) {
  const classes = `${theme.components.card.base} ${hover ? theme.components.card.hover : ""} ${className}`;

  if (href) {
    return (
      <motion.div whileHover={hover ? { y: -4 } : undefined} transition={{ duration: 0.4 }}>
        <Link href={href} className={`block p-6 ${classes}`}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`p-6 ${classes}`}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
