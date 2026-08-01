# Product Requirements Document: Notification Retry

## Meta

| Field | Value |
|-------|-------|
| **Slug** | notification-retry |
| **Status** | Approved |
| **Version** | 1.0 |
| **Author** | prd-developer (BOSS) |
| **Created** | 2026-08-01 |
| **EPB Vision** | applied |
| **Dev docs** | `.cursor/team/prds/_example/notification-retry/dev-docs.md` |

---

## 1. Executive Summary

Add configurable retry with exponential backoff to the EPB Notification Platform so failed deliveries recover from transient errors automatically without operator intervention. Tenants configure retry policy per organization. Dead-letter queue captures permanent failures.

---

## 2. Problem Statement

### Current state

Notifications fail permanently on first transient error (network blip, provider timeout).

### Pain points

- Manual resend required
- No tenant-level control over retry behavior
- Operations overhead at scale

### Opportunity

Reuse Scheduler and Queue platform services for industry-standard retry patterns.

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Reduce manual resends | Ops tickets for failed notifications | −80% |
| Improve delivery rate | Successful delivery within 24h | ≥99% for transient failures |
| Tenant control | Tenants with custom retry policy | ≥1 policy API consumer |

---

## 4. Scope

### In scope

- Retry policy configuration API (tenant-scoped)
- Exponential backoff retry processor
- Dead-letter after max retries
- Audit events for retry attempts

### Out of scope

- New notification channels (SMS, push additions)
- UI admin console (API only in v1)

### Assumptions

- Scheduler Platform available
- Queue Platform supports delayed messages

---

## 5. Stakeholders & Personas

| Persona | Role | Needs |
|---------|------|-------|
| Platform operator | SRE / DevOps | Visibility, DLQ monitoring |
| Tenant admin | App integrator | Configure retry per tenant |
| EPB developer | Service author | Clear API, platform reuse |

---

## 6. User Stories & Acceptance Criteria

### US-001: Automatic retry on transient failure

**As a** platform operator  
**I want** failed notifications retried automatically with backoff  
**So that** transient provider errors do not require manual resend

**Acceptance criteria:**

- [ ] AC-001: Failed delivery retries up to `maxRetries` (default 3)
- [ ] AC-002: Backoff follows `initialDelayMs * 2^attempt` capped at `maxDelayMs`
- [ ] AC-003: After max retries, message moves to dead-letter queue

### US-002: Tenant retry policy

**As a** tenant admin  
**I want** to configure retry policy for my tenant  
**So that** retry behavior matches my SLA

**Acceptance criteria:**

- [ ] AC-004: `PATCH /api/v1/notifications/policies/{tenantId}` updates policy
- [ ] AC-005: Policy validated (maxRetries 1–10, delays positive)

---

## 7. Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Store retry policy per tenant | Must | |
| FR-002 | Retry processor consumes failed events | Must | Event-driven |
| FR-003 | Scheduler triggers delayed retries | Must | |
| FR-004 | Dead-letter on exhaustion | Must | |
| FR-005 | Emit audit event per retry attempt | Should | |

---

## 8. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Retry scheduling &lt; 100ms p99 overhead |
| Scalability | Horizontal retry workers |
| Availability | Retry path independent of send path |
| Security | Tenant auth on policy API; no PII in DLQ payload |
| Observability | Metrics: retry_count, dlq_count |
| Accessibility | N/A (API only) |

---

## 9. Data Requirements

### Entities

| Entity | Description | Owner service |
|--------|-------------|---------------|
| RetryPolicy | maxRetries, delays, tenantId | Notification Platform |
| RetryAttempt | attempt number, timestamp, error | Notification Platform |

### Data flows

Send fails → event → retry processor → scheduler → resend or DLQ

---

## 10. Integrations & Dependencies

| System | Type | Direction | Purpose |
|--------|------|-----------|---------|
| Scheduler Platform | API | Out | Delayed retry jobs |
| Queue Platform | Event | In/Out | Failed events, DLQ |
| Audit Platform | Event | Out | Retry audit trail |

---

## 11. API Outline (high level)

| Method | Path | Purpose |
|--------|------|---------|
| PATCH | `/api/v1/notifications/policies/{tenantId}` | Update retry policy |
| GET | `/api/v1/notifications/policies/{tenantId}` | Get retry policy |

---

## 12. UX Requirements

API only v1 — no UI. Future: admin screen in platform console.

---

## 13. Security & Compliance

| Concern | Requirement |
|---------|-------------|
| Authentication | BFF → platform JWT |
| Authorization | Tenant-scoped policy access |
| Data protection | No message body in DLQ metadata |
| Audit | All policy changes logged |

---

## 14. EPB Platform Mapping

| Capability | Platform service | Build vs reuse |
|------------|------------------|----------------|
| Notifications | Notification Platform | Extend |
| Scheduling | Scheduler Platform | Reuse |
| Queuing | Queue Platform | Reuse |
| Audit | Audit Platform | Reuse |

**ADR candidates:** ADR-006 (event-driven notification)

---

## 15. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Retry storm | High | Medium | Cap maxRetries, exponential backoff |
| DLQ growth | Medium | Medium | Alerts, retention policy |

---

## 16. Open Questions

| ID | Question | Owner | Status |
|----|----------|-------|--------|
| OQ-001 | Default maxRetries: 3 or 5? | PM | Open |

---

## 17. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product | prd-developer | 2026-08-01 | Approved |
| Engineering | solution-architect | 2026-08-01 | Approved |

**Approved PRD unlocks:** `BOSS deliver notification-retry`

---

## 18. Requirements Summary

| Type | Count | IDs |
|------|-------|-----|
| User stories | 2 | US-001, US-002 |
| Functional reqs | 5 | FR-001–FR-005 |
| Acceptance criteria | 5 | AC-001–AC-005 |
| Open questions | 1 | OQ-001 |

_Quality target: validate-prd.js score ≥ 85_
