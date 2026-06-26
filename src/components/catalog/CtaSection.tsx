"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

interface CtaSectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  dark?: boolean;
}

export function CtaSection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  dark = true,
}: CtaSectionProps) {
  return (
    <section className={dark ? "relative overflow-hidden bg-black text-white" : "bg-[#F7F7F7]"}>
      {dark && (
        <>
          <div className="consultation-bg absolute inset-0 opacity-20" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80"
            aria-hidden="true"
          />
        </>
      )}
      <div className="relative mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]">
        <Reveal className="max-w-2xl">
          {eyebrow && (
            <p
              className={`mb-4 text-[0.6875rem] font-semibold tracking-[0.28em] uppercase ${
                dark ? "text-[#E63946]" : "text-[#C8102E]"
              }`}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className={`font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] ${
              dark ? "text-white" : "text-black"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-4 text-base leading-relaxed ${dark ? "text-white/75" : "text-black/65"}`}
          >
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={primaryHref} variant="primary">
              {primaryLabel}
            </Button>
            {secondaryLabel && secondaryHref && (
              <a
                href={secondaryHref}
                className={`inline-flex items-center justify-center rounded-xl border-2 px-6 py-3.5 text-sm font-medium tracking-[0.14em] uppercase transition-colors ${
                  dark
                    ? "border-white text-white hover:border-[#E63946] hover:text-[#E63946]"
                    : "border-black text-black hover:border-[#C8102E] hover:text-[#C8102E]"
                }`}
              >
                {secondaryLabel}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
