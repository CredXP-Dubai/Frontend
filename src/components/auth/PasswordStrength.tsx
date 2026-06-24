"use client";

import { motion } from "framer-motion";

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

function getPasswordStrength(password: string): { level: StrengthLevel; label: string } {
  if (!password) return { level: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["", "Weak", "Fair", "Good", "Strong"] as const;
  return { level: score as StrengthLevel, label: labels[score] };
}

const barColors = [
  "bg-white/10",
  "bg-red-400/70",
  "bg-amber-400/80",
  "bg-luxury-gold/80",
  "bg-luxury-gold-light",
];

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { level, label } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              level >= segment ? barColors[level] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className="text-xs tracking-wide text-luxury-muted">
        Password strength:{" "}
        <span className="text-luxury-gold-light">{label || "Too short"}</span>
      </p>
    </motion.div>
  );
}
