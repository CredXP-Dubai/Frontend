import { CinematicHero } from "@/components/hero";

export default function Home() {
  return (
    <main className="relative bg-black">
      <CinematicHero />

      <section
        id="properties"
        className="relative z-10 min-h-screen bg-[#0a0a0a] px-6 py-32 text-center"
      >
        <p className="font-[family-name:var(--font-body)] text-sm uppercase tracking-[0.3em] text-[#C9A962]">
          Coming Soon
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-light text-white md:text-5xl">
          Property Listings
        </h2>
      </section>

      <section
        id="consultation"
        className="relative z-10 min-h-[50vh] bg-[#050505] px-6 py-24 text-center"
      >
        <p className="font-[family-name:var(--font-body)] text-zinc-400">
          Book a private consultation with our Dubai specialists.
        </p>
      </section>
    </main>
  );
}
