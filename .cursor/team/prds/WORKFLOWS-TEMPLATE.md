# Workflows: {{name}}

> **Pipeline stage 3 of 6.** Business process flows before UI/UX.  
> PRD: [PRD.md](./PRD.md) · Dev docs: [dev-docs.md](./dev-docs.md)  
> Slug: `{{slug}}`

## Meta

| Field | Value |
|-------|-------|
| **Status** | Draft \| In Review \| Approved |
| **PRD version** | 1.0 |
| **Author** | business-analyst (BOSS) |

---

## 1. Workflow Summary

_One paragraph: key business processes this feature touches._

---

## 2. Actors

| Actor | Role | System access |
|-------|------|---------------|
| | | |

---

## 3. Process Flows

### WF-001: _Primary flow name_

**Trigger:**  
**Preconditions:**  
**Postconditions:**

```text
[Actor] → Step 1 → Step 2 → Decision? → Step 3 → End
```

| Step | Actor | Action | System | Output |
|------|-------|--------|--------|--------|
| 1 | | | | |

**Alternate paths:**

- **WF-001-A:** Error / rejection path
- **WF-001-B:** Admin override path

---

## 4. State Machines

| State | Description | Allowed transitions |
|-------|-------------|---------------------|
| draft | | → confirmed |

---

## 5. Business Rules

| ID | Rule | Applies to |
|----|------|------------|
| BR-001 | | WF-001 |

---

## 6. Traceability to PRD

| Workflow | User story | Functional req |
|----------|------------|----------------|
| WF-001 | US-001 | FR-001 |

---

## 7. Handoff

**Next stage:** `BOSS prd ux {{slug}}`
