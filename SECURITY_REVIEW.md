# CredXP Dubai — Security Review

**Review date:** 2026-06-24 (post SOW cleanup)  
**Scope:** Authentication, authorization, API security, input validation  
**Supersedes:** `SECURITY_AUDIT.md` (prior audit; this review reflects cleanup changes)

---

## Executive Summary

| Area | Rating | Change from Prior Audit |
|------|--------|-------------------------|
| Authentication | **Good** | Unchanged |
| Session handling | **Moderate** | Unchanged — localStorage tokens |
| Route protection | **Moderate** | Improved — debug route removed |
| API client | **Good** | Improved — debug logging removed |
| Input validation | **Good** | Unchanged |
| XSS / CSRF | **Good / Low risk** | Unchanged |
| Role permissions | **Not implemented** | Expected — SOW broker/admin RBAC pending |
| Rate limiting | **Backend only** | Unchanged |

**Overall:** Security posture improved by removing `/auth-debug` and auth payload logging. Production readiness still requires middleware and backend domain API authorization.

---

## 1. Authentication

### Implemented (SOW-required)

| Control | Status | Location |
|---------|--------|----------|
| JWT login | ✅ | `lib/api/auth.ts` |
| Token refresh on 401 | ✅ | `lib/api/client.ts` |
| Logout + session clear | ✅ | `AuthContext`, `session.ts` |
| Password strength (register) | ✅ | `lib/auth/utils.ts`, `PasswordStrength` |
| Public auth routes skip Bearer | ✅ | `client.ts` `isPublicAuthRoute()` |

### Removed (security improvement)

| Item | Risk Eliminated |
|------|-----------------|
| `/auth-debug` page | Raw credential testing surface |
| `authDebug.ts` | Request/response payload logging in console |
| `NEXT_PUBLIC_AUTH_DEBUG` | Accidental production debug exposure |

---

## 2. Authorization & Role Permissions

| Requirement | Status |
|-------------|--------|
| Broker vs admin vs public role routing | ❌ Not implemented |
| API-level role checks (frontend) | N/A — backend must enforce |
| Protected portal routes | ⚠ Client-side only |

**SOW alignment:** Broker and admin portals require RBAC. Current `(protected)/*` routes allow any authenticated user. Backend `/auth/me` should expose `role` for future guards.

**Recommendation:** Add `middleware.ts` + role checks when `/broker/*` and `/admin/*` routes are created — no UI change required.

---

## 3. Session Handling

| Storage | Keys | Risk |
|---------|------|------|
| `localStorage` | `credxp_access_token`, `credxp_refresh_token` | XSS token exfiltration |

**Mitigation path:** Migrate to HttpOnly cookies when backend supports `Set-Cookie` session responses.

---

## 4. API Security

| Control | Status |
|---------|--------|
| HTTPS base URL | ✅ `NEXT_PUBLIC_API_URL` |
| 30s request timeout | ✅ |
| Structured error parsing | ✅ `ApiError` |
| Single refresh flight | ✅ |
| Auto-redirect on persistent 401 | ✅ |
| Correlation ID in errors | ✅ |

**Secrets rule:** WhatsApp, email, and Puppeteer keys must use server-only API routes — never `NEXT_PUBLIC_*`.

---

## 5. Input Validation

| Surface | Validation |
|---------|------------|
| Login email/password | Client + backend |
| Register (name, email, password, terms) | Client + backend |
| Smart search criteria | Completion gate before submit |
| Future lead capture (phone) | Not yet implemented — add E.164 validation |

---

## 6. XSS Protection

| Check | Status |
|-------|--------|
| React default escaping | ✅ |
| `dangerouslySetInnerHTML` | None in critical paths |
| CMS property HTML (future) | ⚠ Add DOMPurify when rendering |

---

## 7. CSRF

Bearer token in `Authorization` header — CSRF not applicable for current SPA pattern. Re-evaluate if cookie auth is adopted.

---

## 8. Rate Limiting

Frontend cannot enforce rate limits. Backend OpenAPI documents 429 on auth routes. Domain APIs (properties, leads) must implement rate limiting when deployed.

---

## 9. Pre-Production Checklist

- [x] Remove `/auth-debug` route
- [x] Remove auth debug logging module
- [ ] Add `middleware.ts` for protected paths
- [ ] Add CSP headers in `next.config.ts`
- [ ] Role-based route guards for broker/admin
- [ ] Phone validation on lead capture
- [ ] Audit `NEXT_PUBLIC_*` env vars before deploy
- [ ] Penetration test on auth flows

---

## 10. Conclusion

The SOW cleanup removed the primary debug security surfaces. Core JWT auth remains sound for MVP. Remaining debt is architectural (localStorage, client-only guards, no RBAC) and should be addressed as broker/admin portals are built — without changing the approved UI.
