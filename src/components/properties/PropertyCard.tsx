"use client";

import { motion } from "framer-motion";
import type { Property } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { theme } from "@/styles/theme";

const PLACEHOLDER_IMAGES = [
  "/cinematic/frame_0048.jpg",
  "/cinematic/frame_0035.jpg",
  "/cinematic/frame_0020.jpg",
  "/cinematic/frame_0012.jpg",
] as const;

function formatPrice(price: number, currency = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function getPlaceholderImage(id: string): string {
  const index = id.charCodeAt(0) % PLACEHOLDER_IMAGES.length;
  return PLACEHOLDER_IMAGES[index];
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageSrc = property.images?.[0] ?? getPlaceholderImage(property.id);

  return (
    <motion.article
      className={`group overflow-hidden ${theme.components.card.base} ${theme.components.card.hover}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {property.featured && (
          <span className="absolute top-4 left-4 rounded-sm bg-[#C8102E] px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase">
            Featured
          </span>
        )}
      </div>

      <div className="space-y-4 p-5 md:p-6">
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#C8102E] uppercase">
            {property.developerId ? "Premium Developer" : "CredXP Collection"}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl leading-snug text-black">
            {property.title}
          </h3>
          {property.location && (
            <p className="mt-1 text-sm text-black/55">{property.location}</p>
          )}
        </div>

        <p className="text-lg font-semibold text-black">{formatPrice(property.price, property.currency)}</p>

        <div className="flex flex-wrap gap-3 text-xs font-medium tracking-wide text-black/45 uppercase">
          {property.bedrooms != null && <span>{property.bedrooms} Beds</span>}
          {property.bathrooms != null && <span>{property.bathrooms} Baths</span>}
          {property.areaSqft != null && (
            <span>{property.areaSqft.toLocaleString()} Sq Ft</span>
          )}
        </div>

        <Button href="/#consultation" variant="primary" size="sm" className="w-full">
          Request Details
        </Button>
      </div>
    </motion.article>
  );
}
