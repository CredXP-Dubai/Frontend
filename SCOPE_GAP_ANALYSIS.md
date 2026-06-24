# CredXP Dubai — Scope Gap Analysis

**Audit date:** 2026-06-24  
**Frontend:** `credxp-dubai-frontend` (Next.js 16)  
**Backend:** `https://backend-cumg.onrender.com` (OpenAPI **v0.4.1**)  
**Constraint:** Approved UI preserved — this audit covers functionality and architecture only.

---

## Executive Summary

| Category | ✅ Implemented | 🟡 Partial | ❌ Missing |
|----------|---------------|-----------|-----------|
| Platform core | 4 | 3 | 12 |
| Property discovery | 2 | 4 | 6 |
| Maps & location | 0 | 0 | 5 |
| Developer experience | 1 | 2 | 4 |
| Property detail tools | 0 | 1 | 9 |
| Lead capture & CRM | 0 | 2 | 8 |
| Broker portal | 1 | 2 | 9 |
| PDF proposals | 0 | 0 | 5 |
| Communications | 0 | 1 | 6 |
| Admin governance | 0 | 1 | 7 |
| AI | 0 | 0 | 4 |
| Performance & SEO | 2 | 5 | 6 |

**Overall compliance estimate:** ~18% fully implemented, ~22% partial, ~60% missing (backend dependency for many items).

---

## Phase 1 — Platform Foundation

### 1.1 Marketing Homepage & Brand Experience

| Status | **✅ Implemented** |
|--------|-------------------|
| **Current** | Cinematic hero (`CinematicHero`), featured properties, listings, developers, consultation CTA, footer, approved white/black/red design system |
| **Missing** | — |
| **Recommendation** | None — preserve as-is |
| **Complexity** | — |

### 1.2 Authentication (JWT)

| Status | **✅ Implemented** |
|--------|-------------------|
| **Current** | Login, register (`POST /api/v1/auth/register`), logout, refresh, `/auth/me`, protected routes, `localStorage` session, 401 interceptor |
| **Files** | `src/lib/api/auth.ts`, `src/context/AuthContext.tsx`, `src/lib/auth/session.ts` |
| **Missing** | Email verification page, resend verification UI, `logout-all` UI |
| **Recommendation** | Add `/verify-email` page using existing auth shell (no visual change) |
| **Complexity** | Low |

### 1.3 Password Recovery

| Status | **🟡 Partially Implemented** |
|--------|-------------------------------|
| **Current** | UI at `/forgot-password`, `/reset-password`; backend routes exist in v0.4.1 |
| **Missing** | End-to-end QA against live backend; resend verification flow |
| **Recommendation** | Verify live endpoints; enable `authCapabilities` flags |
| **Complexity** | Low |

### 1.4 Role-Based Access (Broker / Admin / Investor)

| Status | **❌ Missing** |
|--------|---------------|
| **Current** | Single investor portal; no role routing |
| **Missing** | Broker vs admin vs investor layouts, RBAC guards |
| **Recommendation** | Extend `User` type with `role`; add route groups without changing approved styling |
| **Complexity** | Medium |

---

## Phase 2 — Property Discovery

### 2.1 Smart Search (Currency → Budget → Type)

| Status | **🟡 Partially Implemented** (this audit) |
|--------|------------------------------------------|
| **Current** | `SmartSearchSteps` integrated into existing `PropertySearch` panel; search disabled until all 3 steps complete; dynamic budget labels per currency (`src/lib/search/`) |
| **Missing** | Live FX rates API; backend filter by `propertyType`; persistence of criteria |
| **Recommendation** | Wire `propertyType` to API query param when backend ships; add daily FX feed |
| **Complexity** | Low–Medium |

### 2.2 Property Listings API

| Status | **🟡 Partially Implemented** |
|--------|-------------------------------|
| **Current** | `GET /api/v1/properties` client, hooks, homepage sections, `ApiState` handling |
| **Missing** | Backend route returns **404** on v0.4.1 |
| **Recommendation** | Deploy properties API on backend; no frontend UI change needed |
| **Complexity** | Backend: High / Frontend: Low |

### 2.3 Property Detail Pages

| Status | **❌ Missing** |
|--------|---------------|
| **Current** | Cards link to `/#consultation` |
| **Missing** | `/properties/[id]` route, gallery, amenities, floor plans |
| **Recommendation** | Add route using existing `PropertyCard` / `PortalShell` visual language |
| **Complexity** | High |

### 2.4 Advanced Filters & Pagination

| Status | **🟡 Partially Implemented** |
|--------|-------------------------------|
| **Current** | Text search, location, bedrooms; pagination meta displayed |
| **Missing** | Page controls UI; developer/project filters |
| **Complexity** | Low |

### 2.5 Saved Properties / Shortlist

| Status | **🟡 Partially Implemented** |
|--------|-------------------------------|
| **Current** | `/saved-properties` placeholder page |
| **Missing** | Save API, heart toggle on cards, sync with user account |
| **Complexity** | Medium |

---

## Phase 3 — Mapbox 3D

| Item | Status |
|------|--------|
| Mapbox GL JS integration | **❌ Missing** |
| 3D buildings | **❌ Missing** |
| Day/night modes | **❌ Missing** |
| Property markers | **❌ Missing** |
| Developer markers | **❌ Missing** |
| Nearby infrastructure (schools, metro, airports) | **❌ Missing** |

| Field | Detail |
|-------|--------|
| **Current** | Location is text-only in search |
| **Recommendation** | Add `mapbox-gl` + `NEXT_PUBLIC_MAPBOX_TOKEN`; embed map section on future property detail using existing section spacing |
| **Complexity** | High |

---

## Phase 4 — Dynamic Developer Theming

| Item | Status |
|------|--------|
| CMS theme tokens (primary, secondary, accent, typography) | **🟡 Partially Implemented** |
| Developer detail pages | **❌ Missing** |
| Developers list API | **🟡 Partial** (client ready, backend 404) |

| Field | Detail |
|-------|--------|
| **Current** | `src/lib/theming/developerTheme.ts` — CSS variable injection (`--developer-primary`, etc.) |
| **Missing** | CMS API, developer `[slug]` pages, hook to apply theme on route enter |
| **Recommendation** | Extend `Developer` type in `types/api.ts`; call `applyDeveloperTheme()` in future developer layout |
| **Complexity** | Medium |

---

## Phase 5 — Property Detail Enhancements

| Feature | Status |
|---------|--------|
| ROI calculator | **🟡 Partial** — `src/lib/calculators/investment.ts` (logic only) |
| CAGR calculator | **🟡 Partial** — same module |
| Rental yield calculator | **🟡 Partial** — same module |
| Dubai vs India comparison | **🟡 Partial** — same module |
| Currency switching on detail | **❌ Missing** (search-level currency exists) |
| Download brochure | **❌ Missing** |
| Virtual tour embed | **❌ Missing** |
| Verified property badge | **❌ Missing** |
| Developer verification badge | **❌ Missing** |

| **Recommendation** | Mount calculators in property detail panel when route exists; reuse existing card/input styles |
| **Complexity** | Medium (UI), Low (calculator logic done) |

---

## Phase 6 — Lead Capture & CRM

| Feature | Status |
|---------|--------|
| Progressive lead capture (5 steps) | **❌ Missing** (UI) |
| CRM API integration | **🟡 Partial** — `src/lib/services/crm.ts` stub |
| Conversion event tracking | **🟡 Partial** — `src/lib/analytics/events.ts` |
| Consultation CTA | **🟡 Partial** — `mailto:` only |

| **Missing** | Multi-step lead form, `POST /api/v1/leads`, CRM webhook, admin lead inbox |
| **Recommendation** | Build `ProgressiveLeadCapture` using `AuthFloatingInput` / `Button` components (same approved styling) |
| **Complexity** | Medium |

---

## Phase 7 — Broker Portal

| Feature | Status |
|---------|--------|
| Investor dashboard shell | **🟡 Partial** |
| Lead pipeline | **❌ Missing** |
| Client management | **❌ Missing** |
| Proposal generation UI | **❌ Missing** |
| Activity feed | **❌ Missing** |
| WhatsApp activity log | **❌ Missing** |
| Email activity log | **❌ Missing** |
| Commission tracking | **❌ Missing** |
| Performance metrics | **❌ Missing** |
| Saved properties (functional) | **🟡 Partial** |

| **Current** | `/dashboard` with static stats and quick links |
| **Recommendation** | Add broker route group; populate dashboard widgets from CRM API when available |
| **Complexity** | High |

---

## Phase 8 — PDF Proposal System

| Feature | Status |
|---------|--------|
| Puppeteer PDF generation | **❌ Missing** |
| Property proposal template | **❌ Missing** |
| Broker branding on PDF | **❌ Missing** |
| Download / share PDF | **❌ Missing** |

| **Recommendation** | Next.js API route `app/api/proposals/[id]/route.ts` + Puppeteer; no change to approved marketing UI |
| **Complexity** | High |

---

## Phase 9 — WhatsApp + Email Automation

| Feature | Status |
|---------|--------|
| WhatsApp Cloud API | **❌ Missing** |
| Email provider (SendGrid/SES) | **❌ Missing** |
| Send proposal | **❌ Missing** |
| Follow-up automation | **❌ Missing** |
| Delivery/read tracking | **❌ Missing** |
| Conversation timeline | **❌ Missing** |

| **Recommendation** | `src/lib/services/communications.ts` service layer + backend webhooks |
| **Complexity** | High |

---

## Phase 10 — Admin Governance

| Feature | Status |
|---------|--------|
| Admin UI | **❌ Missing** |
| Broker management | **❌ Missing** |
| Property management | **❌ Missing** |
| Developer management | **❌ Missing** |
| Lead assignment | **❌ Missing** |
| Performance analytics | **❌ Missing** |
| Broadcast messaging | **❌ Missing** |
| Theme management (CMS) | **❌ Missing** |
| Users API client | **🟡 Partial** — `src/lib/api/users.ts` (no UI) |

| **Complexity** | Very High |

---

## Phase 11 — AI Features

| Feature | Status |
|---------|--------|
| AI chatbot | **❌ Missing** |
| Property/developer/FAQ knowledge base | **❌ Missing** |
| English + Hindi | **❌ Missing** |
| AI lead qualification | **❌ Missing** |
| CRM push for qualified leads | **❌ Missing** |

| **Recommendation** | RAG architecture via backend; frontend chat widget matching existing button/border styles |
| **Complexity** | Very High |

---

## Phase 12 — Performance & SEO

| Item | Status |
|------|--------|
| React Query caching | **✅ Implemented** |
| Image optimization (next/image) | **🟡 Partial** — cinematic JPGs; cards use `<img>` |
| Lazy loading | **🟡 Partial** — hero preloads frames |
| Route splitting | **🟡 Partial** — App Router defaults |
| SSR/ISR for listings | **❌ Missing** |
| Metadata per page | **🟡 Partial** — root metadata only |
| Lighthouse > 90 | **❌ Not verified** |

See `PERFORMANCE_REPORT.md` for detail.

---

## Phase 13 — Security

See `SECURITY_AUDIT.md` for full review.

| Item | Status |
|------|--------|
| JWT auth + refresh | **✅ Implemented** |
| Client-side route guard | **🟡 Partial** — no middleware |
| Token storage | **🟡 Partial** — localStorage (SPA pattern) |
| Input validation (auth) | **✅ Implemented** |
| XSS/CSRF | **🟡 Partial** — React defaults; no CSRF tokens |

---

## Backend API Availability (v0.4.1)

| Endpoint | Available |
|----------|-----------|
| `/health` | ✅ |
| `/api/v1/auth/*` | ✅ |
| `/api/v1/users/*` | ✅ |
| `/api/v1/properties` | ❌ |
| `/api/v1/developers` | ❌ |
| `/api/v1/projects` | ❌ |
| `/api/v1/leads` | ❌ |
| `/api/v1/crm/*` | ❌ |
| `/api/v1/admin/*` | ❌ |

---

## Code Added in This Audit (No UI Redesign)

| Path | Purpose |
|------|---------|
| `src/lib/search/currency.ts` | Currency conversion for smart search |
| `src/lib/search/budgetRanges.ts` | Dynamic budget ranges |
| `src/lib/search/smartSearch.ts` | Completion validation |
| `src/components/properties/SmartSearchSteps.tsx` | 3-step wizard (approved styling) |
| `src/lib/calculators/investment.ts` | ROI, CAGR, yield, comparison logic |
| `src/lib/theming/developerTheme.ts` | CMS CSS variable injection |
| `src/lib/services/crm.ts` | CRM submit stub |
| `src/lib/analytics/events.ts` | Conversion event hooks |

---

## Priority Order for Maximum Scope Compliance

1. **Backend:** Properties, developers, projects, leads APIs  
2. **Property detail route** + calculators + brochure  
3. **Progressive lead capture** + CRM wiring  
4. **Broker portal** data widgets  
5. **Mapbox** on property detail  
6. **PDF proposals** (API route + Puppeteer)  
7. **WhatsApp / email** services  
8. **Admin** governance panel  
9. **AI** chatbot + qualification  

See `IMPLEMENTATION_ROADMAP.md` for phased timeline.
