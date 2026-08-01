# Development Docs: Notification Retry

> **For BOSS delivery.** Generated from approved PRD.  
> PRD: [PRD.md](./PRD.md)  
> Slug: `notification-retry`

## Meta

| Field | Value |
|-------|-------|
| **Status** | Ready for BOSS |
| **BOSS mode** | standard |
| **PRD version** | 1.0 |
| **EPB Vision** | applied |

---

## 1. Implementation Summary

Extend Notification Platform with tenant retry policies, event-driven retry processor, scheduler integration for backoff, and dead-letter queue handoff. API-only v1.

---

## 2. BOSS Delivery Config

| Setting | Value |
|---------|-------|
| **Command** | `BOSS deliver notification-retry` |
| **Mode** | standard |
| **Roles** | product-manager, business-analyst, solution-architect, backend-developer, qa-engineer, documentation-versioning, security-review |
| **Specialists** | bugbot |
| **MCPs** | gbrain, github |
| **Skills** | epb-vision, mcp-routing, prd-developer |

---

## 3. Task Breakdown (ordered)

| # | Task | Role | Depends | Done when |
|---|------|------|---------|-----------|
| T-001 | Confirm ADR-006 alignment, API contract review | solution-architect | — | Contract doc in report §3 |
| T-002 | Implement RetryPolicy entity + PATCH/GET API | backend-developer | T-001 | Endpoints pass integration tests |
| T-003 | Retry processor + scheduler integration | backend-developer | T-002 | Retry + DLQ flow works |
| T-004 | Unit + integration tests | qa-engineer | T-003 | Test plan TP-001–003 pass |
| T-005 | CHANGELOG + API docs | documentation-versioning | T-004 | Docs merged |

---

## 4. API Contracts

### Update retry policy

**Method:** `PATCH`  
**Path:** `/api/v1/notifications/policies/{tenantId}`  
**Auth:** required (tenant scope)

**Request:**

```json
{
  "maxRetries": 3,
  "initialDelayMs": 1000,
  "maxDelayMs": 60000
}
```

**Response:**

```json
{
  "tenantId": "string",
  "maxRetries": 3,
  "initialDelayMs": 1000,
  "maxDelayMs": 60000,
  "updatedAt": "2026-08-01T00:00:00Z"
}
```

**Errors:**

| Code | When |
|------|------|
| 400 | Invalid policy values |
| 401 | Unauthenticated |
| 403 | Wrong tenant |

---

## 5. Data Model

### Entities

| Entity | Fields | Notes |
|--------|--------|-------|
| RetryPolicy | tenantId, maxRetries, initialDelayMs, maxDelayMs | One per tenant |
| RetryAttempt | notificationId, attempt, errorCode, at | Audit trail |

### Migrations

Add `notification_retry_policies` table; extend notification events with retry metadata.

---

## 6. Platform Services (EPB)

| Service | Usage |
|---------|-------|
| Notification Platform | Extend with retry |
| Scheduler Platform | Delayed retry jobs |
| Queue Platform | Failed events, DLQ |
| Audit Platform | Policy change + retry events |

---

## 7. Architecture Decisions

| ADR | Decision needed |
|-----|-----------------|
| ADR-006 | Event-driven retry — confirm pattern |

**New ADR required:** no

---

## 8. Frontend / UX (if applicable)

N/A — API only v1.

---

## 9. Test Plan

| ID | Type | Scenario | Expected |
|----|------|----------|----------|
| TP-001 | Unit | Backoff calculation | Correct delay per attempt |
| TP-002 | Integration | PATCH policy + failed send | Retries then DLQ |
| TP-003 | Integration | Invalid policy | 400 response |

---

## 10. Acceptance Criteria (from PRD)

- [ ] AC-001: Retries up to maxRetries
- [ ] AC-002: Exponential backoff with cap
- [ ] AC-003: Dead-letter after exhaustion
- [ ] AC-004: PATCH policy API works
- [ ] AC-005: Policy validation enforced

---

## 11. Dependencies & Sequence

```text
T-001 → T-002 → T-003 → T-004 → T-005
```

---

## 12. Out of Scope (reminder)

- New notification channels
- Admin UI

---

## 13. Gate Checklist for BOSS

| Gate | Artifact | Owner |
|------|----------|-------|
| code-review | `code-review.json` | solution-architect |
| qa | `qa.json` | qa-engineer |
| uat | `uat.json` | business-analyst |
| security-review | `security-review.json` | security-review |

---

## 14. Open Questions

| ID | Question | Blocks |
|----|----------|--------|
| OQ-001 | Default maxRetries: 3 or 5? | Default config only |

---

## Handoff

```text
Use BOSS to deliver "notification-retry"
Read dev-docs at .cursor/team/prds/_example/notification-retry/dev-docs.md
```
