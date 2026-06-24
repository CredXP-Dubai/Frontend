# CredXP Dubai — Dependency Audit

**Audit date:** 2026-06-24  
**Aligned with:** [Dubai Real Estate Website SOW](https://docs.google.com/document/d/1IRCZGDfmlKz4TWs_cZkPHqiUQvdxT8JsUIn2CJMDQ9E/edit?usp=sharing)

---

## Production Dependencies

| Package | Version | Usage | Decision | Reason |
|---------|---------|-------|----------|--------|
| `next` | 16.2.9 | App Router, fonts, links, navigation | **Kept** | Core framework |
| `react` | 19.2.4 | UI runtime | **Kept** | Core framework |
| `react-dom` | 19.2.4 | DOM rendering | **Kept** | Core framework |
| `@tanstack/react-query` | ^5.101.1 | Properties, developers, auth cache | **Kept** | SOW data layer; single cache source |
| `axios` | ^1.18.1 | `lib/api/client.ts` HTTP client | **Kept** | SOW API integration |
| `framer-motion` | ^12.41.0 | Auth, navbar, cards, hero CTA, reveals | **Kept** | Approved UI animations |
| `gsap` | ^3.15.0 | `CinematicSequence` ScrollTrigger hero | **Kept** | Approved cinematic homepage |
| `react-hot-toast` | ^2.6.0 | Auth feedback toasts | **Kept** | UX for auth flows |

**Removed:** None — all production dependencies are actively used.

---

## Dev Dependencies

| Package | Version | Usage | Decision | Reason |
|---------|---------|-------|----------|--------|
| `tailwindcss` | ^4 | Utility styling | **Kept** | Design system |
| `@tailwindcss/postcss` | ^4 | PostCSS integration | **Kept** | Tailwind build |
| `typescript` | ^5 | Type checking | **Kept** | Type safety |
| `eslint` | ^9 | Linting | **Kept** | Code quality |
| `eslint-config-next` | 16.2.9 | Next.js lint rules | **Kept** | Code quality |
| `@types/node` | ^20 | Node types | **Kept** | TS support |
| `@types/react` | ^19 | React types | **Kept** | TS support |
| `@types/react-dom` | ^19 | React DOM types | **Kept** | TS support |
| `sharp` | ^0.35.2 | `scripts/generate-cinematic-frames.mjs` | **Kept** | Cinematic asset pipeline |

**Removed:** None.

---

## Packages Not Installed (SOW — Future)

| Package | SOW Requirement | Status |
|---------|-----------------|--------|
| `mapbox-gl` | Mapbox 3D experience | Not installed — add at property detail phase |
| `puppeteer` | PDF proposals | Not installed — add as server-only API route dep |
| `@react-pdf/renderer` | Alternative PDF | Not chosen — SOW specifies Puppeteer |
| `zustand` / `redux` | State management | Not needed — React Query + Context sufficient |
| `zod` | Validation | Not installed — client validation inline; consider for forms |
| `dompurify` | XSS sanitization | Not installed — add when rendering CMS HTML |

---

## Duplicate Library Check

| Concern | Finding |
|---------|---------|
| Multiple HTTP clients | ✅ Single `axios` instance in `lib/api/client.ts` |
| Multiple animation libs | ✅ `gsap` for hero scroll; `framer-motion` for UI — complementary, not duplicate |
| Multiple state managers | ✅ Only React Query + AuthContext |
| Multiple date libs | ✅ None installed |
| Multiple icon libs | ✅ None installed (inline SVG) |

---

## Bundle Impact Notes

| Package | Approx. Impact | Mitigation Applied |
|---------|----------------|-------------------|
| `gsap` | High | Dynamic import via `HomeHero` client wrapper |
| `framer-motion` | Medium | Loaded on all pages (navbar) — acceptable for approved UI |
| `@tanstack/react-query` | Low | Tree-shaken |
| `axios` | Low | Single instance |

---

## Scripts

| Script | Command | Purpose | Kept |
|--------|---------|---------|------|
| `dev` | `next dev` | Development | ✅ |
| `build` | `next build` | Production build | ✅ |
| `start` | `next start` | Production server | ✅ |
| `lint` | `eslint` | Linting | ✅ |
| `generate:frames` | `node scripts/...` | Cinematic frames | ✅ |
| `sync:manifest` | `node scripts/...` | Manifest sync | ✅ |

---

## Summary

| Metric | Value |
|--------|-------|
| Production deps | 8 |
| Unused production deps | 0 |
| Removed in this audit | 0 packages |
| Future SOW deps | 2 (`mapbox-gl`, `puppeteer`) |

All current dependencies directly support SOW-required functionality or the approved UI experience.
