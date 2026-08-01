# Workflows: Notification Retry

> Pipeline stage 3 · Slug: `notification-retry`

## Meta

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **PRD version** | 1.0 |

---

## 1. Workflow Summary

Tenant admins configure retry policies; failed notifications are retried with exponential backoff until max retries, then moved to dead-letter queue.

---

## 2. Actors

| Actor | Role | System access |
|-------|------|---------------|
| Platform operator | SRE | Monitor DLQ, audit |
| Tenant admin | API consumer | PATCH retry policy |

---

## 3. Process Flows

### WF-001: Configure retry policy

**Trigger:** Tenant admin updates policy  
**Preconditions:** Valid tenant auth  
**Postconditions:** Policy stored; audit event emitted

```text
Tenant admin → PATCH policy → Validate → Save → Audit → 200 OK
```

| Step | Actor | Action | System | Output |
|------|-------|--------|--------|--------|
| 1 | Tenant admin | PATCH /policies/{tenantId} | BFF | Policy JSON |
| 2 | System | Validate ranges | API | 400 or continue |
| 3 | System | Persist + audit | DB | Updated policy |

### WF-002: Automatic retry on failure

**Trigger:** Notification delivery fails  
**Preconditions:** Retry policy exists  
**Postconditions:** Retry scheduled or DLQ

```text
Failed event → Read policy → Schedule retry → Attempt → Success | Retry | DLQ
```

---

## 4. Traceability to PRD

| Workflow | User story | Functional req |
|----------|------------|----------------|
| WF-001 | US-002 | FR-001 |
| WF-002 | US-001 | FR-002, FR-003, FR-004 |
