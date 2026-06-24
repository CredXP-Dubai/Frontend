"use client";

import dynamic from "next/dynamic";

const CinematicHero = dynamic(
  () => import("@/components/hero").then((m) => m.CinematicHero),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#C8102E]" />
      </div>
    ),
  },
);

export function HomeHero() {
  return <CinematicHero />;
}
