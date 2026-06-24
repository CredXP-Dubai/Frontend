# CredXP Dubai — Performance Report

**Audit date:** 2026-06-24  
**Target:** Lighthouse Performance / SEO / Best Practices > 90  
**Constraint:** No UI redesign — optimization only.

---

## Current State Summary

| Metric | Estimated | Verified |
|--------|-----------|----------|
| Lighthouse Performance | 65–80 | ❌ Not run in CI |
| Lighthouse SEO | 70–85 | ❌ Not run in CI |
| Lighthouse Accessibility | 80–90 | ❌ Not run in CI |
| Lighthouse Best Practices | 85–95 | ❌ Not run in CI |
| Production build | ✅ Passes | `npm run build` |
| First load JS (App Router) | Moderate | Static prerender for all routes |

---

## 1. Bundle & Dependencies

| Package | Size impact | Notes |
|---------|-------------|-------|
| `gsap` + ScrollTrigger | High | Cinematic hero only — home page |
| `framer-motion` | Medium | Auth, cards, reveals |
| `@tanstack/react-query` | Low | Appropriate |
| `axios` | Low | Appropriate |
| `mapbox-gl` | Not installed | Future: lazy-load on detail page only |
| `puppeteer` | Not installed | Server-only when added |

### Recommendations

| Priority | Action | Impact |
|----------|--------|--------|
| High | Dynamic import `CinematicHero` on home page | Reduces initial JS for `/login`, `/dashboard` |
| High | `next/dynamic` for `framer-motion` sections below fold | Medium |
| Medium | Tree-shake GSAP plugins — import only ScrollTrigger | Low |
| Low | Analyze with `@next/bundle-analyzer` | Diagnostic |

```typescript
// Example — no visual change
const CinematicHero = dynamic(() => import('@/components/hero').then(m => m.CinematicHero), {
  ssr: false,
  loading: () => <LoadingScreen progress={0} />,
});
```

---

## 2. Images

| Asset | Current | Recommendation |
|-------|---------|----------------|
| Cinematic frames (51 JPG) | `/public/cinematic/frame_*.jpg` | ✅ Already on disk; consider WebP variants |
| Property card images | `<img>` + placeholder JPGs | Migrate to `next/image` with `sizes` |
| Developer logos | `<img>` | `next/image` with width/height |
| Hero preload | 20 frames preloaded | Good UX; caps initial bandwidth |

### `next.config.ts` additions (recommended)

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'backend-cumg.onrender.com' },
    // CDN when property images ship
  ],
},
```

**Complexity:** Low — no layout change.

---

## 3. React Query Caching

**File:** `src/lib/query/client.ts`

| Setting | Value | Assessment |
|---------|-------|------------|
| `staleTime` | 60s | ✅ Good for listings |
| `gcTime` | 5 min | ✅ |
| `refetchOnWindowFocus` | false | ✅ Reduces churn |
| Retry policy | Skips 401/404 | ✅ |

### Recommendations

| Action | Detail |
|--------|--------|
| Per-query `staleTime` for `/auth/me` | 30s — already implicit |
| Properties list | 2–5 min when API live |
| Prefetch property detail on card hover | Future optimization |

---

## 4. Rendering Strategy

| Route | Current | Recommended |
|-------|---------|---------------|
| `/` | Static (○) | Keep static shell; dynamic hero client component |
| `/login`, `/register` | Static | ✅ |
| `/dashboard` | Static shell + client auth | OK |
| `/properties/[id]` (future) | — | **ISR** `revalidate: 300` for SEO |
| Admin (future) | — | SSR + auth check |

**No ISR today** — all 13 routes statically prerendered. Good for auth pages; property detail should use ISR when added.

---

## 5. SEO

| Item | Status |
|------|--------|
| Root `metadata` in `layout.tsx` | ✅ |
| Per-page `metadata` | ❌ Missing on `/login`, `/dashboard`, etc. |
| `robots.txt` | ❌ Missing |
| `sitemap.xml` | ❌ Missing |
| Semantic HTML (`main`, `section`, headings) | ✅ |
| Open Graph tags | ❌ Missing |
| Structured data (RealEstateListing) | ❌ Missing |

### Quick wins (no UI change)

```typescript
// app/(auth)/login/page.tsx
export const metadata = { title: 'Sign In | CredXP Dubai', robots: { index: false } };
```

Add `app/sitemap.ts` and `app/robots.ts` — Next.js built-in.

**Complexity:** Low

---

## 6. Core Web Vitals (Estimated Bottlenecks)

| Vital | Likely issue | Fix |
|-------|--------------|-----|
| **LCP** | Cinematic hero canvas + large JPG frames | Preload fewer frames; optimize LCP frame |
| **INP** | GSAP ScrollTrigger on home | `useReducedMotion` already exists — ensure respect |
| **CLS** | Low — fixed layouts | ✅ |
| **TTFB** | Static prerender | ✅ Good |
| **FCP** | Loading screen on hero | Acceptable for cinematic experience |

**File:** `src/lib/hero/hooks/useReducedMotion.ts` — verify cinematic hero respects preference.

---

## 7. Network

| Item | Status |
|------|--------|
| API base URL single origin | ✅ |
| No request waterfall on auth bootstrap | ✅ Sequential: refresh → me |
| Properties parallel fetch | ✅ Featured + listings independent |
| HTTP/2 | CDN/hosting dependent |

### Backend on Render

Cold starts may add 1–3s to first API call. Consider:
- Stale-while-revalidate in React Query
- Health ping keep-alive (backend concern)

---

## 8. Code Splitting

| Area | Status |
|------|--------|
| App Router automatic splitting | ✅ Per route |
| Shared `Navbar` + `AuthProvider` on all pages | Loads auth context globally |
| Hero isolated to `/` | ✅ Not imported on auth pages |

---

## 9. CSS

| Item | Status |
|------|--------|
| Tailwind 4 purge | ✅ Build-time |
| `globals.css` legacy BEM rules | 🟡 ~900 lines — some unused auth BEM from earlier iteration |
| Critical CSS | Not inlined — acceptable for Next |

### Recommendation

Remove unused legacy CSS classes (auth-page BEM duplicates) in a cleanup pass — **no visual change**.

---

## 10. Analytics & Third Party

| Script | Impact |
|--------|--------|
| None currently | ✅ |
| Future GTM | Load async after consent |
| Mapbox | Lazy on interaction |
| WhatsApp widget | Defer |

---

## 11. Performance Budget (Proposed)

| Resource | Budget |
|----------|--------|
| First load JS (non-home) | < 200 KB gzip |
| First load JS (home) | < 400 KB gzip (hero exception) |
| Largest image | < 300 KB per frame |
| API response (listings) | < 500ms p95 |

---

## 12. Lighthouse Improvement Plan

| Step | Action | Est. gain |
|------|--------|-----------|
| 1 | Run `npx lighthouse http://localhost:3000 --view` | Baseline |
| 2 | `next/image` on property cards | +5–10 performance |
| 3 | Dynamic import cinematic hero | +5–15 on non-home routes |
| 4 | Add metadata + sitemap | +10–20 SEO |
| 5 | Compress cinematic JPGs (mozjpeg) | +5 LCP |
| 6 | Preconnect to API origin | +1–3 TTFB on API calls |
| 7 | Remove `/auth-debug` from prod build | Best practices |

---

## 13. Monitoring (Recommended)

| Tool | Purpose |
|------|---------|
| Vercel Analytics / Web Vitals | RUM |
| Lighthouse CI on PR | Regression gate |
| React Query Devtools | Dev only |
| Sentry | Error + performance traces |

---

## 14. What Was NOT Changed (Per Audit Scope)

- No color, typography, or layout modifications
- No removal of cinematic hero experience
- No change to approved component visual design

---

## Conclusion

The app builds cleanly and uses React Query appropriately. The main performance opportunities are **image optimization**, **dynamic imports for the cinematic hero**, and **SEO metadata** — all achievable without redesigning the approved UI. Lighthouse > 90 is realistic for non-home routes immediately; home route may target 85+ due to intentional cinematic weight unless frame assets are further optimized.

**Next step:** Run Lighthouse locally and attach scores to this document in CI.
