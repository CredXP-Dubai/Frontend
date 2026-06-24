# CredXP Dubai — Removed Features Log

**Date:** 2026-06-24  
**Reason:** SOW alignment cleanup — remove functionality outside the approved Scope of Work.

**UI impact:** None. No colors, layouts, or approved components were modified.

---

## 1. Auth Debug Page

| Field | Detail |
|-------|--------|
| **Feature name** | `/auth-debug` temporary login debugger |
| **Why removed** | Not in SOW; bypassed `AuthContext` and API interceptors; security risk in production |
| **Files removed** | `src/app/auth-debug/page.tsx` |
| **Dependencies removed** | Navbar `isAuthPage` check for `/auth-debug` |
| **Related docs** | `AUTH_DEBUG_REPORT.md` retained as historical record |

---

## 2. Auth Debug Logging Module

| Field | Detail |
|-------|--------|
| **Feature name** | `authDebug.ts` console logging |
| **Why removed** | Debug infrastructure; not required by SOW; logged request payloads in dev |
| **Files removed** | `src/lib/api/authDebug.ts` |
| **Dependencies removed** | Imports from `src/lib/api/auth.ts`, `src/lib/api/client.ts` |
| **Env removed** | `NEXT_PUBLIC_AUTH_DEBUG` no longer referenced |

---

## 3. Backend Status Component

| Field | Detail |
|-------|--------|
| **Feature name** | `BackendStatus` health indicator |
| **Why removed** | Component always returned `null`; never mounted; dead code |
| **Files removed** | `src/components/ui/BackendStatus.tsx` |
| **Dependencies removed** | `useHealth` hook |

---

## 4. Health Check Hook

| Field | Detail |
|-------|--------|
| **Feature name** | `useHealth()` React Query hook |
| **Why removed** | Only consumer was removed `BackendStatus`; no SOW requirement for health UI |
| **Files removed** | `src/hooks/useHealth.ts` |
| **Retained** | `getHealth()` in `lib/api/client.ts` for future ops/admin use |

---

## 5. Duplicate Auth Hooks

| Field | Detail |
|-------|--------|
| **Feature name** | `hooks/useAuth.ts` React Query mutations |
| **Why removed** | Orphaned duplicate of `AuthContext`; never imported; violated single source of truth |
| **Files removed** | `src/hooks/useAuth.ts` |
| **Retained** | `src/context/AuthContext.tsx` + `useAuth()` from context |

---

## 6. Duplicate Featured Properties API

| Field | Detail |
|-------|--------|
| **Feature name** | `getFeaturedProperties()` in properties API |
| **Why removed** | Duplicate of `useFeaturedProperties()` → `listProperties({ featured: true })` |
| **Files modified** | `src/lib/api/properties.ts` (function removed) |
| **Retained** | `hooks/useProperties.ts` `useFeaturedProperties()` |

---

## 7. Duplicate Cinematic Frame Assets

| Field | Detail |
|-------|--------|
| **Feature name** | `ezgif-13a7502a6419b27a-jpg/` source frames (51 JPGs) |
| **Why removed** | Duplicate of deployed `public/cinematic/` assets; not referenced by build scripts |
| **Files removed** | `ezgif-13a7502a6419b27a-jpg/*` (entire directory) |
| **Retained** | `public/cinematic/`, `scripts/generate-cinematic-frames.mjs` |

---

## Not Removed (Clarification)

These were reviewed and **kept** because they are SOW-required scaffolds:

| Item | SOW Requirement |
|------|-----------------|
| `lib/calculators/investment.ts` | ROI / CAGR / yield calculators |
| `lib/theming/developerTheme.ts` | CMS developer branding |
| `lib/services/crm.ts` | Lead → CRM integration |
| `lib/analytics/events.ts` | Conversion event tracking |
| `lib/search/*` | Smart search flow |
| `hooks/useProjects.ts` | Developer/project pages (future) |
| `lib/api/users.ts` | Admin broker management (future) |
| Investor portal pages (`/dashboard`, etc.) | Broker portal foundation per SOW |

---

## Post-Removal Verification

```
npm run build — ✅ passes (12 routes)
/auth-debug — ✅ removed from route table
```
