# CredXP Dubai — Auth Debug Report

**Generated:** 2026-06-24  
**Backend:** `https://backend-cumg.onrender.com`  
**OpenAPI version:** v0.4.1

---

## Executive Summary

The frontend **was already sending the correct login payload**. The backend expects **Option A**:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

A `401` with `"Invalid credentials"` is the **actual backend error message**, not a generic frontend fallback.

The most likely causes of login failure are:

1. **Wrong email/password**
2. **Email not verified** (registration creates `PENDING` accounts)
3. **Account not `ACTIVE`**
4. **Registration previously used the wrong endpoint** (`POST /api/v1/users`, admin-only) instead of `POST /api/v1/auth/register`

---

## Step 1 — Frontend Login Implementation

### Endpoint used

```
POST https://backend-cumg.onrender.com/api/v1/auth/login
```

### Request payload (frontend)

```json
{
  "email": "<trimmed email>",
  "password": "<password>"
}
```

Source: `src/lib/api/auth.ts` → `login()`

### Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: (omitted on login — public auth route)
```

### Credentials mode

- Axios default (`withCredentials: false`)
- Backend returns JWT tokens in JSON body (not HttpOnly cookies)

### Response handling (success)

Expected shape per OpenAPI v0.4.1:

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": 900,
  "tokenType": "Bearer"
}
```

Frontend flow after success:

1. `saveAuthSession()` → `localStorage` (`credxp_access_token`, `credxp_refresh_token`, `credxp_token_meta`)
2. `GET /api/v1/auth/me` with `Authorization: Bearer <accessToken>`
3. `AuthContext` sets `currentUser` and `isAuthenticated`

---

## Step 2 — Backend Contract Verification

### Live Swagger inspection

`GET /docs/swagger-ui-init.js` → `/api/v1/auth/login`

| Field | Backend expects |
|-------|-----------------|
| `email` | Required, email format |
| `password` | Required, min 8 chars |
| `username` | Returns `400` — `email: Required` |
| `identifier` | Returns `400` — `email: Required` |

### Live curl comparison

**Option A — `{ email, password }`**

```http
HTTP 401
{"error":{"code":"UNAUTHORIZED","message":"Invalid credentials"}}
```

**Option B — `{ username, password }`**

```http
HTTP 400
{"error":{"code":"VALIDATION_ERROR","message":"Invalid login payload","details":{"fieldErrors":{"email":["Required"]}}}}
```

**Option C — `{ identifier, password }`**

```http
HTTP 400
{"error":{"code":"VALIDATION_ERROR","message":"Invalid login payload","details":{"fieldErrors":{"email":["Required"]}}}}
```

**Conclusion:** Frontend payload shape is correct.

### Backend login requirements (documented)

> "Requires ACTIVE status and verified email."

So `401 Invalid credentials` may also mean:

- Account exists but email is unverified
- Account status is `PENDING`, `LOCKED`, or `SUSPENDED`

---

## Step 3 — Debug Logging Added

### Console logging (development)

Enabled when `NODE_ENV=development` or `NEXT_PUBLIC_AUTH_DEBUG=true`.

Logs via `src/lib/api/authDebug.ts`:

- Request method, URL, headers, body
- Response status + body (auth routes)
- Error status + body

### Temporary debug page

```
/auth-debug
```

Shows raw request payload, response, error, status, and localStorage session snapshot.

**Remove `/auth-debug` after authentication is confirmed working.**

---

## Step 4 — Response Parsing

Backend returns a **flat** token object. Frontend `normalizeAuthTokenResponse()` supports:

- `accessToken` (primary)
- `refreshToken`, `expiresIn`, `tokenType`
- Fallback aliases: `token`, `jwt`, `data.token`

Error envelope includes optional `details.fieldErrors` — now surfaced in UI.

---

## Step 5 — Authentication Persistence

| Storage | Key |
|---------|-----|
| `localStorage` | `credxp_access_token`, `credxp_refresh_token`, `credxp_token_meta` |

Persistence path is correct — login failure occurs before tokens are saved.

---

## Step 6 — Identified Issues & Fixes Applied

| Issue | Fix |
|-------|-----|
| Payload mismatch | Not the issue — already correct |
| Stale Bearer on login | Skip auth header on public auth routes |
| Register used `POST /api/v1/users` | Switched to `POST /api/v1/auth/register` |
| Weak register password validation | Aligned with backend (uppercase, lowercase, number) |
| Field errors not shown | `parseApiError()` includes `details.fieldErrors` |
| Email whitespace | Login trims email before send |

---

## Step 7 — Error Handling

Example for failed login:

```
Invalid credentials · Login requires an ACTIVE account with a verified email address (per backend API).
```

Validation example:

```
Invalid login payload · email: Invalid email · password: String must contain at least 8 character(s)
```

---

## Auth Mechanism

| Layer | Mechanism |
|-------|-----------|
| Login | Email + password → JWT tokens in JSON |
| API calls | `Authorization: Bearer <accessToken>` |
| Refresh | `POST /api/v1/auth/refresh` |
| Persistence | `localStorage` |
| Profile | `GET /api/v1/auth/me` |
