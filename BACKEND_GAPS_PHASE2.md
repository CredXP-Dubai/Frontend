# Phase 2 Backend Gaps — CredXP Dubai Frontend

Generated against OpenAPI **v1.1.0** (`GET /docs.json`).

## Catalog Admin CRUD

| Module | Missing Endpoint | Expected Endpoint | Current Response | Required Backend Change | Priority |
|--------|------------------|-------------------|------------------|-------------------------|----------|
| Developer Management | Create/Update/Delete | `POST/PATCH/DELETE /api/v1/developers` | Only `GET` public routes exist | Add authenticated admin developer CRUD + media upload | **High** |
| Project Management | Create/Update/Delete | `POST/PATCH/DELETE /api/v1/projects` | Only `GET` public routes exist | Add project admin CRUD, amenities, payment plans, SEO fields | **High** |
| Property Management | Create/Update/Delete | `POST/PATCH/DELETE /api/v1/properties` | Only `GET` public routes exist | Add property admin CRUD, availability, pricing, media | **High** |

**Frontend status:** Read-only catalog tables at `/workspace/developers`, `/workspace/projects`, `/workspace/properties`.

## CRM

| Module | Missing Endpoint | Expected Endpoint | Current Response | Required Backend Change | Priority |
|--------|------------------|-------------------|------------------|-------------------------|----------|
| Customers | Customer list | `GET /api/v1/crm/customers` | Not in Swagger | Add customers module or document leads-as-customers | Medium |

## Auth / RBAC

| Module | Missing Schema | Expected | Current Response | Required Backend Change | Priority |
|--------|----------------|----------|------------------|-------------------------|----------|
| `/auth/me` | `permissions[]` in OpenAPI | Documented `permissions` array on me response | Undocumented body; may return `roleId` only | Document AuthMe schema with `permissions`, `role.code` | **High** |
| All modules | Response schemas | `components.schemas` in OpenAPI | `schemas: never` | Add User, Lead, Proposal, Property entity schemas | **High** |

## Proposals

| Module | Missing Detail | Expected | Current Response | Required Backend Change | Priority |
|--------|----------------|----------|------------------|-------------------------|----------|
| Proposal Wizard | Request body on POST/PATCH | Documented create/update payloads | `requestBody?: never` in OpenAPI | Document theme, template, leadId, propertyIds fields | Medium |
| Version history | Dedicated endpoint or field | `versions[]` on proposal detail | Unknown | Expose version list on GET `/proposals/{id}` | Medium |
