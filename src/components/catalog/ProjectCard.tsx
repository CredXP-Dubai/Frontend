"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectListItem } from "@/types/catalog";
import { formatDate } from "@/lib/format/catalog";
import { Badge } from "@/components/ui/badge";
import { theme } from "@/styles/theme";

const PLACEHOLDER_IMAGES = [
  "/cinematic/frame_0035.jpg",
  "/cinematic/frame_0020.jpg",
  "/cinematic/frame_0012.jpg",
] as const;

function getPlaceholderImage(slug: string): string {
  return PLACEHOLDER_IMAGES[slug.charCodeAt(0) % PLACEHOLDER_IMAGES.length];
}

interface ProjectCardProps {
  project: ProjectListItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const handover = formatDate(project.handoverDate);

  return (
    <motion.article
      className={`group overflow-hidden ${theme.components.card.base} ${theme.components.card.hover}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPlaceholderImage(project.slug)}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {project.status && (
            <Badge className="absolute top-4 left-4">{project.status.name}</Badge>
          )}
        </div>

        <div className="space-y-3 p-5 md:p-6">
          {project.developer && (
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#C8102E] uppercase">
              {project.developer.name}
            </p>
          )}
          <h3 className="font-[family-name:var(--font-display)] text-xl leading-snug text-black transition-colors group-hover:text-[#C8102E]">
            {project.name}
          </h3>
          <p className="text-sm text-black/55">
            {[project.area, project.city].filter(Boolean).join(", ")}
          </p>
          {handover && (
            <p className="text-xs font-medium tracking-wide text-black/45 uppercase">
              Handover {handover}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
