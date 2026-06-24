import { designTokens } from "./design-tokens";

export const theme = {
  ...designTokens,
  components: {
    button: {
      primary:
        "relative overflow-hidden rounded-xl bg-[#C8102E] px-6 py-3.5 text-sm font-medium tracking-[0.14em] text-white uppercase transition-all duration-300 hover:bg-[#9B0C24] hover:shadow-[0_0_32px_rgba(200,16,46,0.35)]",
      secondary:
        "rounded-xl border-2 border-black bg-transparent px-6 py-3.5 text-sm font-medium tracking-[0.14em] text-black uppercase transition-all duration-300 hover:border-[#C8102E] hover:text-[#C8102E]",
      ghost:
        "text-sm tracking-wide text-black/65 transition-colors hover:text-[#C8102E]",
      ghostOnDark:
        "text-sm tracking-wide text-white/75 transition-colors hover:text-[#E63946]",
    },
    card: {
      base: "rounded-2xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
      hover:
        "transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(200,16,46,0.25)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]",
      dark: "rounded-2xl border border-white/12 bg-[#1A1A1A] shadow-[0_24px_64px_rgba(0,0,0,0.45)]",
    },
    input: {
      light:
        "w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-black outline-none transition-all duration-300 placeholder:text-black/35 focus:border-[#C8102E] focus:shadow-[0_0_0_1px_rgba(200,16,46,0.2)]",
      dark:
        "w-full rounded-xl border border-white/12 bg-[#1A1A1A] px-4 py-3.5 text-white outline-none transition-all duration-300 placeholder:text-white/35 focus:border-[#C8102E] focus:shadow-[0_0_0_1px_rgba(200,16,46,0.3)]",
    },
    section: {
      wrapper: "mx-auto w-full max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]",
      eyebrow:
        "mb-4 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#C8102E] uppercase",
      title:
        "font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-black",
      titleOnDark:
        "font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-white",
      subtitle: "mt-4 max-w-2xl text-base leading-relaxed text-black/65",
      subtitleOnDark: "mt-4 max-w-2xl text-base leading-relaxed text-white/75",
    },
    navbar: {
      transparent:
        "fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent",
      solid:
        "fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl shadow-sm",
      solidOnDark:
        "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl",
    },
  },
} as const;

export type Theme = typeof theme;
