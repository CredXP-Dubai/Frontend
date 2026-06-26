"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PropertyListItem } from "@/types/catalog";
import {
  formatArea,
  formatPrice,
  propertyLocation,
  propertyTitle,
} from "@/lib/format/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { theme } from "@/styles/theme";

const PLACEHOLDER_IMAGES = [
  "/cinematic/frame_0048.jpg",
  "/cinematic/frame_0035.jpg",
  "/cinematic/frame_0020.jpg",
  "/cinematic/frame_0012.jpg",
] as const;

function getPlaceholderImage(slug: string): string {
  return PLACEHOLDER_IMAGES[slug.charCodeAt(0) % PLACEHOLDER_IMAGES.length];
}

interface PropertyCardProps {
  property: PropertyListItem;
  featured?: boolean;
}

export function PropertyCard({ property, featured }: PropertyCardProps) {
  const imageSrc = getPlaceholderImage(property.slug);
  const location = propertyLocation(property);
  const title = propertyTitle(property);

  return (
    <motion.article
      className={`group overflow-hidden ${theme.components.card.base} ${theme.components.card.hover}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {featured && (
            <span className="absolute top-4 left-4 rounded-sm bg-[#C8102E] px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase">
              Featured
            </span>
          )}
          {property.availability && (
            <Badge className="absolute top-4 right-4 bg-white/95 text-black">
              {property.availability.replace(/_/g, " ")}
            </Badge>
          )}
        </div>

        <div className="space-y-4 p-5 md:p-6">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#C8102E] uppercase">
              {property.developer?.name ?? "CredXP Collection"}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl leading-snug text-black">
              {title}
            </h3>
            {location && <p className="mt-1 text-sm text-black/55">{location}</p>}
          </div>

          <p className="text-lg font-semibold text-black">
            {formatPrice(property.price, property.currency)}
          </p>

          <div className="flex flex-wrap gap-3 text-xs font-medium tracking-wide text-black/45 uppercase">
            {property.bedrooms != null && <span>{property.bedrooms} Beds</span>}
            {property.bathrooms != null && <span>{property.bathrooms} Baths</span>}
            {property.areaSqft != null && <span>{formatArea(property.areaSqft)}</span>}
            {property.propertyType && <span>{property.propertyType.name}</span>}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 md:px-6 md:pb-6">
        <Button href={`/properties/${property.slug}`} variant="primary" size="sm" className="w-full">
          View Details
        </Button>
      </div>
    </motion.article>
  );
}
