# Development Docs: {{name}}

> **For BOSS delivery.** Generated from approved PRD.  
> PRD: `PRD.md` (same folder)  
> Slug: `{{slug}}`

## Meta

| Field | Value |
|-------|-------|
| **Status** | Ready for BOSS \| In Progress \| Complete |
| **BOSS mode** | standard \| full |
| **PRD version** | 1.0 |
| **EPB Vision** | applied \| not applicable |

---

## 1. Implementation Summary

_What BOSS will build — 3–5 sentences._

---

## 2. BOSS Delivery Config

| Setting | Value |
|---------|-------|
| **Command** | `BOSS deliver {{slug}}` |
| **Mode** | standard \| full |
| **Roles** | product-manager, business-analyst, solution-architect, backend-developer, qa-engineer, … |
| **Specialists** | bugbot, security-review |
| **MCPs** | gbrain, github |
| **Skills** | epb-vision, mcp-routing, prd-developer |

---

## 3. Task Breakdown (ordered)

Tasks BOSS assigns to role agents. Execute in order unless marked parallel.

| # | Task | Role | Depends | Done when |
|---|------|------|---------|-----------|
| T-001 | | backend-developer | — | |
| T-002 | | qa-engineer | T-001 | |

---

## 4. API Contracts

### {{endpoint-name}}

**Method:** `GET | POST | PATCH | DELETE`  
**Path:** `/api/v1/...`  
**Auth:** required \| optional

**Request:**

```json
{}
```

**Response:**

```json
{}
```

**Errors:**

| Code | When |
|------|------|
| 400 | |
| 401 | |
| 404 | |

---

## 5. Data Model

### Entities

| Entity | Fields | Notes |
|--------|--------|-------|
| | | |

### Migrations

-

---

## 6. Platform Services (EPB)

| Service | Usage |
|---------|-------|
| Notification Platform | |
| Scheduler Platform | |
| Identity / Auth | |

**Do not reimplement** platform catalog capabilities.

---

## 7. Architecture Decisions

| ADR | Decision needed |
|-----|-----------------|
| ADR-006 | |

**New ADR required:** yes \| no

---

## 8. Frontend / UX (if applicable)

| Screen | Route | Key components |
|--------|-------|----------------|
| | | |

**BFF endpoints:**

-

---

## 9. Test Plan

| ID | Type | Scenario | Expected |
|----|------|----------|----------|
| TP-001 | Unit | | |
| TP-002 | Integration | | |
| TP-003 | E2E | | |

---

## 10. Acceptance Criteria (from PRD)

Copy testable criteria — BOSS QA gate validates against these.

- [ ] AC-001:
- [ ] AC-002:

---

## 11. Dependencies & Sequence

```text
T-001 → T-002 → (T-003 + T-004 parallel) → T-005
```

---

## 12. Out of Scope (reminder)

-

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
| | | |

---

## Handoff

When this doc is **Ready for BOSS**:

```text
Use BOSS to deliver "{{slug}}"
Read dev-docs at .cursor/team/prds/{{slug}}/dev-docs.md
```
