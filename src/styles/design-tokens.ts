export const designTokens = {
  colors: {
    white: "#FFFFFF",
    offWhite: "#F7F7F7",
    black: "#000000",
    charcoal: "#1A1A1A",
    red: {
      primary: "#C8102E",
      dark: "#9B0C24",
      light: "#E63946",
      border: "rgba(200, 16, 46, 0.2)",
      borderStrong: "rgba(200, 16, 46, 0.45)",
      glow: "rgba(200, 16, 46, 0.25)",
    },
    bg: {
      primary: "#FFFFFF",
      secondary: "#F7F7F7",
      dark: "#000000",
      card: "#FFFFFF",
      cardDark: "#1A1A1A",
    },
    text: {
      onLight: "#000000",
      onLightMuted: "rgba(0, 0, 0, 0.65)",
      onLightFaint: "rgba(0, 0, 0, 0.45)",
      onDark: "#FFFFFF",
      onDarkMuted: "rgba(255, 255, 255, 0.75)",
      onDarkFaint: "rgba(255, 255, 255, 0.5)",
    },
    border: {
      light: "rgba(0, 0, 0, 0.1)",
      dark: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontDisplay: "var(--font-display)",
    fontBody: "var(--font-body)",
    eyebrow: {
      size: "0.6875rem",
      tracking: "0.28em",
      weight: 600,
    },
    h1: {
      size: "clamp(2.5rem, 6vw, 4.5rem)",
      weight: 400,
      leading: 1.05,
    },
    h2: {
      size: "clamp(2rem, 4.5vw, 3.25rem)",
      weight: 400,
      leading: 1.1,
    },
    h3: {
      size: "clamp(1.35rem, 2.5vw, 1.75rem)",
      weight: 400,
      leading: 1.2,
    },
    body: {
      size: "1rem",
      leading: 1.7,
    },
    small: {
      size: "0.875rem",
      leading: 1.6,
    },
  },
  spacing: {
    sectionY: "clamp(4rem, 10vw, 7rem)",
    sectionX: "clamp(1.25rem, 4vw, 2rem)",
    container: "1280px",
    narrow: "720px",
  },
  radii: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.75rem",
    full: "9999px",
  },
  shadows: {
    card: "0 12px 40px rgba(0, 0, 0, 0.08)",
    cardHover: "0 20px 50px rgba(0, 0, 0, 0.12)",
    glow: "0 0 32px rgba(200, 16, 46, 0.2)",
    inset: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  },
  motion: {
    easeLuxury: [0.22, 1, 0.36, 1] as const,
    duration: {
      fast: 0.25,
      base: 0.45,
      slow: 0.8,
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
