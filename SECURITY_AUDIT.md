# CredXP Dubai — Security Audit

**Audit date:** 2026-06-24  
**Scope:** Frontend authentication, API client, session handling, input validation  
**Backend:** `https://backend-cumg.onrender.com` (v0.4.1)

---

## Executive Summary

| Area | Rating | Notes |
|------|--------|-------|
| Authentication flow | **Good** | JWT login, refresh, logout implemented correctly |
| Session storage | **Moderate risk** | Tokens in `localStorage` (XSS exposure) |
| Route protection | **Moderate risk** | Client-side only; no Next.js middleware |
| API client security | **Good** | Bearer injection, 401 handling, public route exclusions |
| Input validation | **Good** | Auth forms validated client-side; backend validates server-side |
| XSS | **Good** | React escaping; no `dangerouslySetInnerHTML` in auth flows |
| CSRF | **Low risk** | Bearer tokens (not cookies) — CSRF less relevant for API calls |
| Secrets management | **Good** | API URL in `.env.local`; no secrets in repo |
| Rate limiting | **N/A frontend** | Must be enforced on backend |
| Debug surfaces | **Low risk** | `/auth-debug` should be removed before production |

**Overall:** Acceptable for MVP SPA auth. Production hardening should prioritize middleware, remove debug routes, and evaluate HttpOnly cookies when backend supports them.

---

## 1. Authentication

### 1.1 Login Flow

| Check | Status | Detail |
|-------|--------|--------|
| Correct payload shape | ✅ | `{ email, password }` per OpenAPI |
| Email trim | ✅ | `src/lib/api/auth.ts` |
| Password min length (client) | ✅ | 8 chars on login |
| Error messages from backend | ✅ | `parseApiError` + `formatApiErrorMessage` |
| No token logged in production | ✅ | Debug logging dev-only |

### 1.2 Registration

| Check | Status | Detail |
|-------|--------|--------|
| Strong password rules | ✅ | Upper, lower, number, 8+ chars |
| Terms checkbox gate | ✅ | Client validation |
| Uses `/api/v1/auth/register` | ✅ | Affiliate broker flow per backend |

### 1.3 Token Lifecycle

```
Login → saveAuthSession(localStorage)
     → GET /auth/me
Refresh on 401 → POST /auth/refresh → retry request
Logout → POST /auth/logout → clearAuthSession()
```

| Check | Status |
|-------|--------|
| Access token attached to protected routes | ✅ |
| Public auth routes skip Bearer header | ✅ |
| Refresh single-flight (no thundering herd) | ✅ |
| Redirect to login on invalid session | ✅ |
| `logout-all` available but not exposed in UI | 🟡 |

---

## 2. Session Storage

**File:** `src/lib/auth/session.ts`

| Storage key | Content | Risk |
|-------------|---------|------|
| `credxp_access_token` | JWT access token | XSS can exfiltrate |
| `credxp_refresh_token` | JWT refresh token | XSS can exfiltrate |
| `credxp_token_meta` | Expiry metadata | Low |

### Recommendations

| Priority | Action |
|----------|--------|
| High | If backend adds `Set-Cookie` HttpOnly session, migrate away from localStorage |
| Medium | Add Content-Security-Policy headers in `next.config.ts` |
| Medium | Sanitize any future user-generated HTML (property descriptions) |
| Low | Consider `sessionStorage` for access-only (still XSS-vulnerable but shorter lived) |

**Why localStorage today:** Backend returns tokens in JSON body, not cookies. This is a deliberate SPA tradeoff documented in `AUTH_INTEGRATION_REPORT.md`.

---

## 3. Route Protection

**File:** `src/components/auth/ProtectedRoute.tsx`

| Check | Status | Detail |
|-------|--------|--------|
| Blocks unauthenticated users | ✅ | Redirects to `/login?redirect=` |
| Loading state prevents flash | ✅ | Spinner during bootstrap |
| Server-side enforcement | ❌ | No `middleware.ts` |

### Risk

Protected page HTML/JS is still delivered to the browser. A determined user can inspect client bundles. **True security must be enforced by backend on every API call** — which is ✅ via Bearer JWT.

### Recommendation

```typescript
// Future: src/middleware.ts
// Redirect unauthenticated users at edge for protected paths
// Still keep client guard for UX
```

**Complexity:** Low  
**Does not change UI.**

---

## 4. API Client Security

**File:** `src/lib/api/client.ts`

| Feature | Status |
|---------|--------|
| HTTPS base URL | ✅ (`NEXT_PUBLIC_API_URL`) |
| 30s timeout | ✅ |
| Structured `ApiError` | ✅ |
| No retry on 401/404 | ✅ |
| Refresh retry once | ✅ |
| Auto-redirect on persistent 401 | ✅ |
| Correlation ID surfaced | ✅ |

### Public routes excluded from Bearer attachment

- `/api/v1/auth/login`
- `/api/v1/auth/register`
- `/api/v1/auth/refresh`
- `/api/v1/auth/forgot-password`
- `/api/v1/auth/reset-password`
- `/api/v1/auth/verify-email`
- `/api/v1/auth/resend-verification`

---

## 5. Input Validation

| Surface | Validation |
|---------|------------|
| Login email | Regex + backend |
| Login password | Min 8 chars |
| Register password | Upper + lower + number + 8 chars |
| Register terms | Required checkbox |
| Property search | Smart search completion gate |
| API payloads | TypeScript interfaces; backend Zod/schemas |

### Missing

| Item | Risk |
|------|------|
| Phone number format validation (future lead form) | Low |
| Server-side validation on Next API routes | N/A — no API routes yet |

---

## 6. XSS Protection

| Check | Status |
|-------|--------|
| React default escaping | ✅ |
| `dangerouslySetInnerHTML` usage | None found in auth/critical paths |
| User content rendering | N/A — no UGC yet |
| Third-party scripts | None |

### Future risk

Property descriptions from CMS/API rendered as HTML would require sanitization (DOMPurify).

---

## 7. CSRF Protection

| Context | Assessment |
|---------|------------|
| API calls with `Authorization: Bearer` | CSRF not applicable (custom header) |
| Cookie-based auth (future) | Would require CSRF tokens |
| `withCredentials` | Not used |

---

## 8. Environment & Secrets

| Variable | Exposure | Safe? |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | Public | ✅ Intended |
| Mapbox token (future) | Public | ✅ Intended (URL-restricted) |
| WhatsApp API keys | Must be server-only | ⚠️ Use API routes |
| Puppeteer | Server-only | ⚠️ Use API routes |

**Rule:** Never prefix secret keys with `NEXT_PUBLIC_`.

---

## 9. Debug & Development Surfaces

| Route | Risk | Action |
|-------|------|--------|
| `/auth-debug` | Exposes raw login testing | **Remove before production** |
| `authDebug.ts` console logs | Dev only | ✅ Gated by `NODE_ENV` |

---

## 10. Backend Security (Observed)

| Feature | Status |
|---------|--------|
| Error envelope with correlation ID | ✅ |
| Rate limit on auth (429) | ✅ per OpenAPI |
| Email verification required for login | ✅ documented |
| User status enforcement (ACTIVE) | ✅ documented |
| Properties/leads authorization | ❌ APIs not deployed |

---

## 11. Security Checklist — Pre-Production

- [ ] Remove `/auth-debug` route
- [ ] Add `middleware.ts` for protected path redirects
- [ ] Add CSP headers in `next.config.ts`
- [ ] Confirm HTTPS-only API URL in production env
- [ ] Audit `NEXT_PUBLIC_*` env vars
- [ ] Enable backend rate limiting on all public endpoints
- [ ] Penetration test on auth flows
- [ ] Evaluate HttpOnly cookie migration with backend team
- [ ] Add security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`

---

## 12. Incident Response

| Scenario | Frontend behavior |
|----------|-------------------|
| Stolen access token | Refresh fails → logout → redirect login |
| Stolen refresh token | Backend should revoke; `logout-all` available |
| XSS attack | **High impact** due to localStorage — prioritize CSP + cookie migration |
| API compromise | User sees `ApiError` messages; no silent failures |

---

## Conclusion

The authentication implementation follows standard SPA JWT patterns correctly. The primary security debt is **localStorage token storage** and **client-only route guards** — both common and addressable without UI changes. Backend API authorization for domain resources remains unverified until properties/CRM endpoints ship.
