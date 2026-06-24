"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function ConsultationSection() {
  return (
    <section id="consultation" className="relative overflow-hidden bg-black text-white">
      <div className="consultation-bg absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]">
        <Reveal className="max-w-2xl">
          <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#E63946] uppercase">
            Private Advisory
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-white">
            Book a Private Consultation
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Speak with our Dubai property specialists about exclusive off-plan launches,
            ready investments, and portfolio strategy tailored to your ambitions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="mailto:invest@credxp.com" variant="primary">
              Schedule Consultation
            </Button>
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white px-6 py-3.5 text-sm font-medium tracking-[0.14em] text-white uppercase transition-colors hover:border-[#E63946] hover:text-[#E63946]"
            >
              Join CredXP
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
