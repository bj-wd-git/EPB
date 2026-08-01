# Feature Report: notification-retry

## Status: example
## EPB Vision: applied
## Skills Applied: epb-vision, mcp-routing
## Team: maintained by BOSS
## Agents: product-manager, solution-architect, backend-developer, qa-engineer, documentation-versioning, security-review
## MCPs: gbrain, github

---

## 1. Product (product-manager)

- **Goals:** Add configurable retry with exponential backoff to notification platform
- **Acceptance criteria:**
  - Failed deliveries retry up to N times with backoff
  - Dead-letter after max retries
  - Tenant-configurable retry policy
- **Priority:** High
- **Out of scope:** New notification channels

## 2. Requirements (business-analyst)

- As a platform operator, I want failed notifications retried automatically so that transient failures do not require manual resend
- FRD: Extend notification event with `retryPolicy`; scheduler handles retry jobs
- Handbook ref (gbrain): Volume-2 `15-notification-platform.md`, ADR-006

## 3. Architecture (solution-architect)

- **ADR refs:** ADR-006 (event-driven notification)
- **API contracts:** `PATCH /api/v1/notifications/policies/{tenantId}`
- **Platform services:** Notification Platform, Scheduler Platform, Queue Platform

## 4. Design (ui-ux-designer)

- *Not required for this feature*

## 5. Implementation

### Backend (backend-developer)

- Retry processor in notification service; scheduler cron for backoff
- Dead-letter queue integration

### Frontend (frontend-developer)

- *Not required for this feature*

## 6. Code Review (solution-architect)

**Result:** PASS (example)

## 7. QA (qa-engineer)

**Result:** PASS (example) — unit + integration tests for retry and dead-letter

## 8. UAT (business-analyst)

**Result:** PASS (example)

## 9. Security (solution-architect)

**Result:** PASS (example)

## 10. Documentation (documentation-versioning)

- CHANGELOG: Added notification retry policy API
- Semver: minor bump

## 11. Release (devops-engineer)

- *Pending in real delivery*

## 12. MCP Tools Used

| MCP | Tools called | Purpose |
|-----|--------------|---------|
| gbrain | search | ADR-006 and notification platform chapter lookup |
| github | — | Reserved for PR/release in real delivery |

## 13. Specialist Findings

### bugbot

**Result:** N/A (example — not run)

### security-review

**Result:** PASS (example) — retry policy API requires tenant auth; no PII in dead-letter payload

### ci-investigator

**Result:** N/A

## Open Questions

- Default max retries: 3 or 5?
