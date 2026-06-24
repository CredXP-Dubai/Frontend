"use client";

import { Reveal } from "@/components/ui/Reveal";

interface PortalShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function PortalShell({ eyebrow, title, subtitle, children }: PortalShellProps) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b-4 border-[#C8102E] bg-black text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,16,46,0.15),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-16 md:py-20">
          <Reveal>
            <p className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#E63946] uppercase">
              {eyebrow}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,3.5rem)] font-normal text-white">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">{subtitle}</p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-12 md:py-16">
        {children}
      </div>
    </main>
  );
}
