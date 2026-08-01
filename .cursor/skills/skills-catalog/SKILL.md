---
name: skills-catalog
description: >-
  Index of all invocable project skills with trigger conditions. BOSS reads this
  when composing teams and recording applied skills in feature reports.
---

# Skills Catalog

BOSS applies skills dynamically based on task context. Record applied skills in the feature report header.

## Project Skills

| Skill | Path | Trigger |
|-------|------|---------|
| `boss` | `.cursor/skills/boss/SKILL.md` | Team orchestration, delivery, sync |
| `epb-vision` | `.cursor/skills/epb-vision/SKILL.md` | Platform architecture, handbook, ADRs |
| `project-vision` | `.cursor/skills/project-vision/SKILL.md` | Non-EPB project context |
| `mcp-routing` | `.cursor/skills/mcp-routing/SKILL.md` | Before any MCP tool call |
| `prd-developer` | `.cursor/skills/prd-developer/SKILL.md` | PRD + dev-docs authoring |

## Role Playbooks (SDLC)

| Skill | Path | Trigger |
|-------|------|---------|
| `prd-developer` | `.cursor/skills/sdlc-roles/prd-developer.md` | Full PRD, dev-docs for BOSS |
| `product-manager` | `.cursor/skills/sdlc-roles/product-manager.md` | Goals, acceptance criteria |
| `business-analyst` | `.cursor/skills/sdlc-roles/business-analyst.md` | Requirements, UAT |
| `solution-architect` | `.cursor/skills/sdlc-roles/solution-architect.md` | Architecture, reviews |
| `ui-ux-designer` | `.cursor/skills/sdlc-roles/ui-ux-designer.md` | UI design, a11y |
| `frontend-developer` | `.cursor/skills/sdlc-roles/frontend-developer.md` | Frontend, BFF client |
| `backend-developer` | `.cursor/skills/sdlc-roles/backend-developer.md` | APIs, business logic |
| `qa-engineer` | `.cursor/skills/sdlc-roles/qa-engineer.md` | Testing, regression |
| `documentation-versioning` | `.cursor/skills/sdlc-roles/documentation-versioning.md` | Docs, CHANGELOG |
| `devops-engineer` | `.cursor/skills/sdlc-roles/devops-engineer.md` | CI/CD, release |

## Specialist Playbooks

| Skill | Path | Trigger |
|-------|------|---------|
| `explore` | `.cursor/skills/specialist-roles/explore.md` | Broad codebase search |
| `shell` | `.cursor/skills/specialist-roles/shell.md` | Git, CI, scripts |
| `bugbot` | `.cursor/skills/specialist-roles/bugbot.md` | Post-implementation review |
| `security-review` | `.cursor/skills/specialist-roles/security-review.md` | Security gate |
| `ci-investigator` | `.cursor/skills/specialist-roles/ci-investigator.md` | Failed PR checks |
| `cursor-guide` | `.cursor/skills/specialist-roles/cursor-guide.md` | Cursor product questions |

## BOSS Selection Rules

| Task type | Skills to apply |
|-----------|-----------------|
| New feature PRD | `prd-developer`, `epb-vision` |
| EPB platform feature | `epb-vision`, `mcp-routing`, `prd-developer` |
| Handbook content | `epb-vision`, `gbrain` MCP |
| Non-EPB project | `project-vision` |
| Any MCP usage | `mcp-routing` |
| Security gate | `epb-vision`, `security-review` playbook |

## Report Header

Record in feature report:

```markdown
## Skills Applied
- epb-vision, mcp-routing
```

## Registry

Skills catalog path registered in `.cursor/team/registry.json` → `skills.catalog`.
