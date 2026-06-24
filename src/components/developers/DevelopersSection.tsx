"use client";

import { motion } from "framer-motion";
import { useDevelopers } from "@/hooks/useDevelopers";
import { ApiState } from "@/components/ui/ApiState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { theme } from "@/styles/theme";

export function DevelopersSection() {
  const { data, isLoading, isError, error } = useDevelopers({ limit: 12 });

  return (
    <section
      id="developers"
      className="mx-auto w-full max-w-[1280px] bg-[#F7F7F7] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]"
      aria-labelledby="developers-heading"
    >
      <SectionHeader
        eyebrow="Trusted Partners"
        title="Dubai's Finest Developers"
        subtitle="Invest with confidence alongside Emaar, DAMAC, Sobha, and the emirate's most respected names in luxury development."
      />

      <ApiState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        loadingMessage="Loading developers…"
        emptyTitle="No developers listed"
        emptyMessage="Developer profiles will appear when the API is live."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data?.data.map((developer, index) => (
            <Reveal key={developer.id} delay={index * 0.06}>
              <motion.article
                className={`h-full p-6 text-center ${theme.components.card.base} ${theme.components.card.hover}`}
                whileHover={{ y: -4 }}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-black/10 bg-white">
                  {developer.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={developer.logoUrl}
                      alt={developer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-[family-name:var(--font-display)] text-2xl text-[#C8102E]">
                      {developer.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-black">
                  {developer.name}
                </h3>
                {developer.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/55">
                    {developer.description}
                  </p>
                )}
                {developer.projectCount != null && (
                  <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-[#C8102E] uppercase">
                    {developer.projectCount} Projects
                  </p>
                )}
              </motion.article>
            </Reveal>
          ))}
        </div>
      </ApiState>
    </section>
  );
}
