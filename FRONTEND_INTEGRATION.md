# CredXP Frontend Integration Layer

**OpenAPI version:** 0.4.1  
**Generated types:** `src/types/openapi.generated.ts` (`npm run generate:api-types`)  
**Backend gaps:** `BACKEND_GAPS.md`

---

## What the Backend Actually Exposes (v0.4.1)

| Module | Endpoints | Frontend Status |
|--------|-----------|-----------------|
| Health | `GET /health` | ✅ Integrated |
| Auth | `/api/v1/auth/*` | ✅ Full integration |
| Users | `/api/v1/users/*` | ✅ Workspace UI + hooks |
| Properties | — | ❌ Not in OpenAPI (marketing calls live URL, 404 until deployed) |
| CRM | — | ❌ Placeholder routes + `ApiPageState` |
| Proposals | — | ❌ Placeholder routes + `ApiPageState` |

No mock APIs or fake data were added.

---

## Architecture

```
src/
├── app/
│   ├── (workspace)/          # Dashboard shell (Admin/Broker/Sales)
│   │   └── workspace/
│   │       ├── page.tsx      # Overview
│   │       ├── users/        # User management (live API)
│   │       ├── properties/   # Property listings (live API when deployed)
│   │       ├── crm/          # Leads, customers (awaiting backend)
│   │       └── proposals/    # Awaiting backend
│   └── unauthorized/         # 403 page
├── components/
│   ├── dashboard/            # Sidebar, top nav, breadcrumb, shell
│   └── ui/                   # Badge, skeleton, empty/error states, modal
├── features/
│   └── users/                # UserManagementFeature
├── hooks/
│   ├── useUsers.ts
│   ├── useCrm.ts
│   └── useProposals.ts
├── lib/
│   ├── api/
│   │   ├── api.ts            # Barrel export
│   │   ├── client.ts         # Axios + interceptors
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── properties.ts
│   │   ├── crm.ts
│   │   └── proposals.ts
│   └── errors/http-error.ts  # ApiError + parseApiError (400–500)
├── store/ui-store.ts         # Zustand (sidebar, theme)
├── types/
│   ├── openapi.generated.ts  # Auto-generated — do not edit
│   └── openapi-helpers.ts    # Request types from OpenAPI
└── utils/record.ts           # Safe access for undocumented responses
```

---

## Auth

- JWT login, refresh, logout, session persistence (`localStorage`)
- Axios interceptor: auto refresh, retry once, redirect on 401/403
- `PermissionGuard` for workspace routes
- `/unauthorized` for forbidden access

---

## OpenAPI Types

Run when backend changes:

```bash
OPENAPI_URL=http://localhost:3000/docs.json npm run generate:api-types
```

**Important:** OpenAPI v0.4.1 has **no response schemas** for `User`, paginated lists, etc.  
`AuthMeResponse`, `UserListResponse` are typed as `unknown` until backend adds `components.schemas`.  
UI uses `utils/record.ts` for safe field reads — not invented shapes.

---

## Workspace Routes

| Route | Feature |
|-------|---------|
| `/workspace` | Overview stats |
| `/workspace/users` | List, search, paginate, invite, status, delete |
| `/workspace/properties` | Property search (GET /api/v1/properties) |
| `/workspace/crm/leads` | Awaiting CRM API |
| `/workspace/crm/customers` | Awaiting CRM API |
| `/workspace/proposals` | Awaiting proposals API |

Navbar: **Workspace** link for authenticated users.

---

## Error Handling

| Code | Behavior |
|------|----------|
| 400 | User-friendly validation message |
| 401 | Refresh token → retry → login redirect |
| 403 | Redirect `/unauthorized` |
| 404 | Module unavailable UI or empty state |
| 409 | Conflict message (invite, register) |
| 429 | Rate limit message |
| 500 | Generic server error (no raw stack) |

---

## Dependencies Added

- `zod`, `react-hook-form`, `@hookform/resolvers`
- `zustand`
- `openapi-typescript` (dev)
- Radix UI primitives + `lucide-react` (shadcn-style components)

---

## Local Backend URL

Set in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> If Next.js also runs on port 3000, run the frontend on `3001` (`next dev -p 3001`) or the API on another port.

---

## Next Backend Requirements

See `BACKEND_GAPS.md` for the full list. Priority:

1. Add OpenAPI response schemas (`User`, `PaginatedUsers`, `Role`)
2. `GET /api/v1/roles` for invite form
3. Properties module OpenAPI + endpoints
4. CRM + Proposals modules
