"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { DeveloperListItem } from "@/types/catalog";
import { theme } from "@/styles/theme";

interface DeveloperCardProps {
  developer: DeveloperListItem;
  projectCount?: number;
}

export function DeveloperCard({ developer, projectCount }: DeveloperCardProps) {
  const logoUrl = developer.logo;

  return (
    <motion.article
      className={`group h-full p-6 text-center ${theme.components.card.base} ${theme.components.card.hover}`}
      whileHover={{ y: -4 }}
    >
      <Link href={`/developers/${developer.slug}`} className="block">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-black/10 bg-white">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={developer.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-[family-name:var(--font-display)] text-2xl text-[#C8102E]">
              {developer.name.charAt(0)}
            </span>
          )}
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-xl text-black transition-colors group-hover:text-[#C8102E]">
          {developer.name}
        </h3>
        {developer.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/55">
            {developer.description}
          </p>
        )}
        {projectCount != null && (
          <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-[#C8102E] uppercase">
            {projectCount} Active Projects
          </p>
        )}
      </Link>
    </motion.article>
  );
}
