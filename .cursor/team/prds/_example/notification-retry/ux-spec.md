# UI/UX Specification: Notification Retry

> Pipeline stage 4 · Slug: `notification-retry`

## Meta

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **PRD version** | 1.0 |

---

## 1. UX Summary

API-only v1 — no admin UI. UX spec documents API consumer experience and future admin console placeholders.

---

## 2. User Journeys

### Journey J-001: Update retry policy (API)

| Step | Screen | User action | Feedback |
|------|--------|-------------|----------|
| 1 | API client | PATCH policy | 200 + JSON body |
| 2 | API client | Invalid values | 400 + error detail |

**Maps to workflow:** WF-001

---

## 3. Screen Specifications

### SCR-001: API policy response (reference)

| Field | Value |
|-------|-------|
| **Route** | N/A (API) |
| **Roles** | tenant admin |
| **Workflow** | WF-001 |

**Components:** JSON response card showing maxRetries, delays (for future admin UI).

---

## 4. HTML Design Handoff

| Screen ID | HTML file | Priority |
|-----------|-----------|----------|
| SCR-001 | `designs/policy-api.html` | Must |
