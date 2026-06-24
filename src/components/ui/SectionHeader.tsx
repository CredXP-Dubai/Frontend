"use client";

import { Reveal } from "./Reveal";
import { theme } from "@/styles/theme";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  variant?: "light" | "dark";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  variant = "light",
  className = "",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const isDark = variant === "dark";

  return (
    <Reveal className={`mb-12 max-w-3xl ${alignment} ${className}`}>
      {eyebrow && <p className={theme.components.section.eyebrow}>{eyebrow}</p>}
      <h2
        className={
          isDark ? theme.components.section.titleOnDark : theme.components.section.title
        }
      >
        {title}
      </h2>
      {subtitle && (
        <p className={isDark ? theme.components.section.subtitleOnDark : theme.components.section.subtitle}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
