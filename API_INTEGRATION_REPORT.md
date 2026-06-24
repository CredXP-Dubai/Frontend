# CredXP Dubai — API Integration Report

**Generated:** 2026-06-24  
**Backend URL:** `https://backend-cumg.onrender.com`  
**API Version:** 0.3.0 (OpenAPI 3.0.3)  
**Discovery method:** Swagger UI at `/docs/` → `swagger-ui-init.js` + live HTTP probes

---

## Discovery Summary

| Probe | Result |
|-------|--------|
| `GET /` | 404 |
| `GET /api` | 404 |
| `GET /swagger` | 404 |
| `GET /docs` | 200 — Swagger UI |
| `GET /health` | 200 — `{"status":"ok","postgres":"connected","redis":"disabled"}` |
| `GET /api/v1/properties` | **404 NOT_FOUND** |
| `GET /api/v1/developers` | **404 NOT_FOUND** (timeout on first probe) |
| `GET /api/v1/projects` | **404 NOT_FOUND** |
| `GET /api/v1/users` | 401 UNAUTHORIZED (exists, requires JWT) |

**Conclusion:** Backend v0.3.0 ships **Health**, **Auth**, and **Users** only. Property/Developer/Project routes are **not deployed**. Frontend modules are wired and will activate automatically when those endpoints go live.

---

## Environment

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://backend-cumg.onrender.com` |

File: `.env.local` (see `.env.example`)

---

## Discovered Endpoints

### Health

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|--------------|----------|
| `GET` | `/health` | None | — | `{ status: "ok"\|"degraded", postgres: "connected"\|"disconnected", redis: "connected"\|"disconnected"\|"disabled" }` |

**Frontend:** `getHealth()` in `src/lib/api/client.ts`  
**Hook:** `useHealth()` → `BackendStatus` component

---

### Auth

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|--------------|----------|
| `POST` | `/api/v1/auth/login` | None | `{ email: string, password: string }` | `{ accessToken, refreshToken?, expiresIn, tokenType }` |
| `POST` | `/api/v1/auth/refresh` | None | `{ refreshToken: string }` | `{ accessToken, refreshToken?, expiresIn, tokenType }` |
| `POST` | `/api/v1/auth/logout` | Bearer | `{ refreshToken?: string }` | 204 |
| `POST` | `/api/v1/auth/logout-all` | Bearer | — | 204 |
| `GET` | `/api/v1/auth/me` | Bearer | — | User profile |

**Frontend:** `src/lib/api/auth.ts`  
**Types:** `src/types/api.ts` — `LoginRequest`, `AuthTokenResponse`, `User`

---

### Users

| Method | Endpoint | Auth | Query Params | Response |
|--------|----------|------|--------------|----------|
| `GET` | `/api/v1/users` | Bearer | `page`, `limit`, `search`, `status`, `roleId` | Paginated user list |
| `POST` | `/api/v1/users` | Bearer | — | 201 User created |
| `GET` | `/api/v1/users/{id}` | Bearer | — | User details |
| `PATCH` | `/api/v1/users/{id}` | Bearer | — | User updated |
| `DELETE` | `/api/v1/users/{id}` | Bearer | — | 204 |
| `PATCH` | `/api/v1/users/{id}/status` | Bearer | `{ status }` | User updated |

**Frontend:** `src/lib/api/users.ts`  
**Types:** `User`, `UserListParams`, `PaginatedResponse<User>`

---

### Properties (NOT DEPLOYED)

| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| `GET` | `/api/v1/properties` | **404** | Frontend wired in `src/lib/api/properties.ts` |
| `GET` | `/api/v1/properties/{id}` | **404** | Assumed REST pattern |

**Frontend hooks:** `useProperties()`, `useFeaturedProperties()`  
**Components:** `PropertyListings`, `FeaturedProperties`, `PropertySearch`, `PropertyCard`  
**Current UI:** Shows "API not available" empty state until backend deploys routes

---

### Developers (NOT DEPLOYED)

| Method | Endpoint | Status |
|--------|----------|--------|
| `GET` | `/api/v1/developers` | **404** |
| `GET` | `/api/v1/developers/{id}` | **404** |

**Frontend:** `src/lib/api/developers.ts`  
**Hook:** `useDevelopers()`  
**Component:** `DevelopersSection`

---

### Projects (NOT DEPLOYED)

| Method | Endpoint | Status |
|--------|----------|--------|
| `GET` | `/api/v1/projects` | **404** |
| `GET` | `/api/v1/projects/{id}` | **404** |

**Frontend:** `src/lib/api/projects.ts`  
**Hook:** `useProjects()`

---

## Error Envelope

All API errors return:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Route GET /api/v1/properties not found",
    "correlationId": "uuid"
  }
}
```

Parsed by `ApiError` class in `src/lib/api/client.ts`.

---

## Frontend Architecture

```
src/lib/api/
├── client.ts       # Axios instance, interceptors, health, token storage
├── auth.ts         # Login, refresh, logout, me
├── users.ts        # User CRUD (admin)
├── properties.ts   # Property listings (pending backend)
├── developers.ts   # Developer listings (pending backend)
└── projects.ts     # Project listings (pending backend)

src/lib/query/
├── client.ts       # TanStack Query client + retry rules
└── keys.ts         # Query key factory

src/hooks/
├── useHealth.ts
├── useProperties.ts
├── useDevelopers.ts
└── useProjects.ts

src/types/api.ts    # TypeScript interfaces
```

---

## Component → API Mapping

| Component | Hook | API Function | Endpoint |
|-----------|------|--------------|----------|
| `BackendStatus` | `useHealth` | `getHealth()` | `GET /health` |
| `FeaturedProperties` | `useFeaturedProperties` | `listProperties({ featured: true })` | `GET /api/v1/properties` ⚠️ |
| `PropertyListings` | `useProperties` | `listProperties(params)` | `GET /api/v1/properties` ⚠️ |
| `PropertySearch` | — | triggers `useProperties` refetch | `GET /api/v1/properties` ⚠️ |
| `DevelopersSection` | `useDevelopers` | `listDevelopers()` | `GET /api/v1/developers` ⚠️ |

⚠️ = Endpoint returns 404 on backend v0.3.0

---

## States Implemented

Every API-driven component uses `ApiState`:

- **Loading** — spinner + message
- **Error** — API error message; special copy for 404 "not deployed"
- **Empty** — no results after successful response
- **Success** — renders data grid

---

## Next Steps (Backend)

When the backend team adds property routes, the frontend requires **no code changes** if responses match:

```typescript
interface PaginatedResponse<Property> {
  data: Property[];
  meta: { page, limit, total, totalPages };
}
```

Re-run discovery after backend deploy:

```bash
curl -s https://backend-cumg.onrender.com/docs/swagger-ui-init.js | head -50
```
