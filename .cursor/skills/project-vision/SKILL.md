---
name: project-vision
description: >-
  Template vision skill for non-EPB projects. Copy and customize for your product's
  mission, architecture constraints, and engineering standards. Used by BOSS when
  epb-vision does not apply.
---

# Project Vision (Template)

Use this skill as a **starting point** for projects that are not the EPB handbook repo. BOSS reads this when `epb-vision` is not applicable.

## Customize This File

Replace each section with your project's specifics:

### 1. Mission

- What problem does this product solve?
- Who are the primary users?
- What does success look like?

### 2. Architecture Constraints

- Layer stack (e.g., Frontend → API → Services → Data)
- Non-negotiable rules (auth, data ownership, API style)
- Technology choices and rationale

### 3. Engineering Standards

- Naming conventions
- Error handling and logging
- Testing expectations
- Documentation requirements

### 4. Scope Boundaries

- What the platform/core owns vs what applications own
- Out-of-scope items

### 5. Repo Map

```text
your-project/
├── src/
├── docs/
└── ...
```

## When BOSS Uses This

| Scenario | Vision skill |
|----------|--------------|
| EPB handbook / platform work | `epb-vision` |
| This project (customized) | `project-vision` |
| Neither present | BOSS uses request context only |

## Bootstrap

When copying the BOSS kit to another project via `bootstrap.ps1`, customize this file before first delivery.

## Related

- [BOSS skill](../boss/SKILL.md)
- [EPB Vision](../epb-vision/SKILL.md) — reference for structure
