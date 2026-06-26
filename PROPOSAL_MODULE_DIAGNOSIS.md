# Proposal Module — Diagnosis Report

**Date:** 2026-06-26  
**Frontend:** `credxp-dubai-frontend`  
**Configured API:** `NEXT_PUBLIC_API_URL` from `.env.local`  
**Swagger verified:** `https://backend-cumg.onrender.com/docs.json` (OpenAPI **v0.4.1**)

---

## Root Cause

The Proposal page is **not misconfigured on the frontend**. It calls `GET /api/v1/proposals` correctly, but the **backend does not implement this route**.

The deployed API returns:

```json
HTTP 404
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Route GET /api/v1/proposals not found",
    "correlationId": "..."
  }
}
```

The UI maps any **404** on this request to the placeholder message **"Proposals API not available"** via `isProposalsModuleAvailable()` → `ApiPageState`.

This is intentional fallback behavior for missing backend modules — not a connection bug.

---

## Files Inspected

| File | Role |
|------|------|
| `src/app/(workspace)/workspace/proposals/page.tsx` | Proposals page; uses `useProposals()` + `ApiPageState` |
| `src/hooks/useProposals.ts` | React Query hook → `listProposals()` |
| `src/lib/api/proposals.ts` | `GET /api/v1/proposals`, `getProposal`, `downloadProposalPdf`, `isProposalsModuleAvailable` |
| `src/lib/api/client.ts` | Axios instance, Bearer interceptor, base URL |
| `src/components/ui/api-page-state.tsx` | Renders **"{Module} API not available"** on 404 |
| `src/lib/query/keys.ts` | `queryKeys.proposals.list()` |
| `src/types/openapi.generated.ts` | No `proposal` paths (generated from Swagger) |
| `.env.local` | `NEXT_PUBLIC_API_URL=https://backend-cumg.onrender.com` |
| `BACKEND_GAPS.md` | Documents missing proposals endpoints |

---

## Problem Found

### 1. Where the message is rendered

`src/components/ui/api-page-state.tsx` lines 33–47:

```typescript
if (isError) {
  const unavailable =
    moduleName === "Proposals"
      ? !isProposalsModuleAvailable(error)
      : ...;

  if (unavailable) {
    return (
      <EmptyState
        title={`${moduleName ?? "Module"} API not available`}
        ...
      />
    );
  }
}
```

`isProposalsModuleAvailable` (`src/lib/api/proposals.ts`):

```typescript
export function isProposalsModuleAvailable(error: unknown): boolean {
  return !(error instanceof ApiError && error.isNotFound);
}
```

→ **404 = show placeholder** (exact message user sees).

### 2. Request actually sent

| Layer | Value |
|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://backend-cumg.onrender.com` |
| `PROPOSALS_BASE` | `/api/v1/proposals` |
| **Full URL** | `https://backend-cumg.onrender.com/api/v1/proposals` |
| Method | `GET` |
| Auth | `Authorization: Bearer <accessToken>` (attached by interceptor for non-public routes) |

Axios path construction is **correct** (base URL must **not** include `/api/v1` — paths already include it).

### 3. Swagger comparison (source of truth)

**OpenAPI v0.4.1 paths — NO proposal routes:**

```
/health
/api/v1/auth/*
/api/v1/users/*
```

**Not present:**

- `GET /api/v1/proposals`
- `GET /api/v1/proposals/{id}`
- `GET /api/v1/proposals/{id}/pdf`
- `POST /download` (or any download variant)

`src/types/openapi.generated.ts` contains **zero** matches for `proposal`.

### 4. Live HTTP probe (2026-06-26)

```bash
curl https://backend-cumg.onrender.com/api/v1/proposals
# → 404 NOT_FOUND "Route GET /api/v1/proposals not found"

curl https://backend-cumg.onrender.com/api/v1/proposals -H "Authorization: Bearer invalid"
# → 404 NOT_FOUND (same — route missing, not auth)
```

| Failure type | Ruled out? |
|--------------|------------|
| 401 Unauthorized | ✅ Not the issue (404 without valid route) |
| 403 Forbidden | ✅ Not the issue |
| 500 Server error | ✅ Not the issue |
| CORS | ✅ N/A for server-side curl; browser would show network error, not this placeholder |
| Wrong path on frontend | ✅ Path matches expected convention |
| Missing token | ✅ 404 occurs even with Bearer header |

### 5. Environment variables

**Current `.env.local`:**

```
NEXT_PUBLIC_API_URL=https://backend-cumg.onrender.com
```

**Note:** The project expects:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

(without `/api/v1` suffix — the client appends `/api/v1/...` per route).

**Local `http://localhost:3000` today:** serves the **Next.js frontend** (`npm run dev`), not the API. `GET http://localhost:3000/docs.json` → 404 HTML. Backend must run on a **different port** (e.g. 3001) or use the Render URL.

### 6. React Query

| Setting | Value | Assessment |
|---------|-------|------------|
| Query key | `["proposals", "list", params]` | ✅ Correct |
| `queryFn` | `listProposals` | ✅ Correct |
| `retry` | `false` | ✅ Correct for 404 (no pointless retries) |
| Loading | `TableSkeleton` via `ApiPageState` | ✅ |
| Error | Maps 404 → placeholder | ✅ By design |
| Cache | Default React Query | ✅ |

### 7. Authentication

`attachAuthHeader()` in `src/lib/api/client.ts` adds `Bearer` token to all non-public routes. Proposals requests **do** include auth when the user is logged in. Auth is **not** blocking — the route itself does not exist.

---

## Required Code Changes

**None on the frontend** until the backend ships proposal routes.

When backend adds endpoints:

1. Run `npm run generate:api-types` against updated Swagger
2. Type `listProposals` / `getProposal` responses from generated OpenAPI types
3. Replace placeholder `src/app/(workspace)/workspace/proposals/page.tsx` with real list/detail UI
4. Remove or narrow `isProposalsModuleAvailable` 404 → placeholder logic once API is live

---

## Backend Changes Needed

```
Missing Endpoint:
  GET /api/v1/proposals
  GET /api/v1/proposals/{id}
  GET /api/v1/proposals/{id}/pdf  (or documented download route)

Expected:
  Paginated proposal list + single proposal + PDF download per SOW

Actual:
  HTTP 404 NOT_FOUND — route not registered on API v0.4.1

Required Backend Change:
  Implement proposals module and publish routes in OpenAPI /docs.json

Suggested Routes:
  GET    /api/v1/proposals              — list (page, limit, filters)
  GET    /api/v1/proposals/{id}         — detail
  GET    /api/v1/proposals/{id}/pdf     — download PDF blob
  POST   /api/v1/proposals              — create (if required)
  PATCH  /api/v1/proposals/{id}         — update (if required)
```

Also add `Proposal` schema to `components.schemas` in OpenAPI so the frontend can generate types.

---

## Final Status

**Blocked**

**Exact reason:** `GET /api/v1/proposals` returns **404 NOT_FOUND** on the configured backend (`https://backend-cumg.onrender.com`). The route is **not defined** in OpenAPI v0.4.1. The frontend placeholder is working as designed — it cannot connect to an API that does not exist.

**To unblock:**

1. Deploy proposals routes on the backend
2. Confirm they appear in `GET /docs.json`
3. Point `NEXT_PUBLIC_API_URL` at that backend (host only, no `/api/v1` suffix)
4. Regenerate OpenAPI types and wire the proposals page to real data
