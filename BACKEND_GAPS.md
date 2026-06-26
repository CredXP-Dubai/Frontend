# Backend API Gaps (OpenAPI v0.4.1)

Frontend is contract-driven. The following gaps block full type-safe integration.

## Missing Endpoints (not in `/docs.json`)

| Module | Suggested Endpoint |
|--------|-------------------|
| Properties | `GET /api/v1/properties`, `GET /api/v1/properties/{id}` |
| Developers | `GET /api/v1/developers`, `GET /api/v1/developers/{slug}` |
| Projects | `GET /api/v1/projects` |
| CRM Leads | `GET/POST /api/v1/crm/leads` |
| CRM Customers | `GET/POST /api/v1/crm/customers` |
| CRM Activities | `GET/POST /api/v1/crm/activities` |
| Proposals | `GET /api/v1/proposals`, `GET /api/v1/proposals/{id}`, `GET /api/v1/proposals/{id}/pdf` |
| Roles | `GET /api/v1/roles` (needed for invite UI role picker) |

## Missing OpenAPI Response Schemas (endpoints exist, schemas absent)

| Endpoint | Missing Schema |
|----------|----------------|
| `GET /api/v1/auth/me` | `User` response body |
| `GET /api/v1/users` | `PaginatedUserList` response body |
| `POST /api/v1/users` | Request body + `User` response |
| `GET /api/v1/users/{id}` | `User` response body |
| `PATCH /api/v1/users/{id}` | Request body + `User` response |
| `PATCH /api/v1/users/{id}/status` | Request body `{ status: UserStatus }` + response |

## Missing OpenAPI Component Schemas

Add to `components.schemas`:

- `User`
- `Role`
- `PaginatedMeta`
- `PaginatedUsers`
- `Property`
- `Developer`
- `Lead`
- `Proposal`
- `ApiError` (standard error envelope)

## Suggested Backend Changes

1. Publish full response schemas in OpenAPI for all 200/201 responses.
2. Document `POST /api/v1/users` request body (email, password, firstName, lastName, roleId).
3. Document `PATCH /api/v1/users/{id}/status` request body.
4. Add `GET /api/v1/roles` for RBAC-aware UI.
5. Deploy property and CRM modules or remove from product scope until ready.

Until schemas exist, the frontend uses `unknown` for undocumented responses and renders fields defensively.
