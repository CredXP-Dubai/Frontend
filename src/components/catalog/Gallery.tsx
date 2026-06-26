"use client";

import { useState } from "react";
import type { MediaItem } from "@/types/catalog";
import { cn } from "@/lib/utils/cn";

const PLACEHOLDER = "/cinematic/frame_0048.jpg";

interface GalleryProps {
  media?: MediaItem[];
  title: string;
  className?: string;
}

export function Gallery({ media, title, className }: GalleryProps) {
  const images =
    media?.filter((item) => item.type === "IMAGE" && item.url) ??
    [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active?.url ?? PLACEHOLDER}
          alt={active?.altText ?? title}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((item, index) => (
            <button
              key={`${item.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                index === activeIndex ? "border-[#C8102E]" : "border-transparent",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.altText ?? ""} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
