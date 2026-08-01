---
name: boss
description: >-
  BOSS workflow for dynamic SDLC team composition, role agent scaffolding, coordination
  gates, and consolidated reporting. Use with the boss agent or when managing SDLC delivery.
---

# BOSS Skill — Team Orchestration

## Workflow: Deliver a Feature

1. **Analyze** — parse request, pick roles, create feature slug
2. **Compose** — create `.cursor/agents/teams/<slug>/`, scaffold role agents from templates
3. **Register** — update `.cursor/team/registry.json`
4. **Report shell** — create `.cursor/team/reports/<slug>.md` from `REPORT-TEMPLATE.md`
5. **Execute phases** — invoke role agents, update report sections
6. **Gate check** — code review, UAT, security — block on FAIL
7. **Finalize** — set status Complete, summarize for user

## SDLC Phase Order

```text
1. product-manager
2. business-analyst
3. solution-architect
4. ui-ux-designer + backend-developer (parallel)
5. frontend-developer (after UX)
6. solution-architect (code review gate)
7. qa-engineer
8. business-analyst (UAT gate)
9. solution-architect (security gate)
10. documentation-versioning
11. devops-engineer
```

Skip phases not applicable to the request (e.g., docs-only skips FE/BE/UX).

## Dynamic Composition Rules

| Rule | Detail |
|------|--------|
| Minimum viable team | Only roles needed for the request |
| Parallel limit | Max 4 Task subagents at once |
| Multiple instances | Suffix with `-1`, `-2` for parallel same-role work |
| Shared catalog | Prefer `.cursor/agents/roles/` for generic roles |
| Feature teams | `.cursor/agents/teams/<slug>/` for feature-specific agents |

## Registry Format

`.cursor/team/registry.json`:

```json
{
  "teams": [
    {
      "slug": "notification-retry",
      "status": "in_progress",
      "agents": ["product-manager", "solution-architect", "backend-developer"],
      "report": ".cursor/team/reports/notification-retry.md",
      "created": "2026-08-01",
      "maintained-by": "boss"
    }
  ]
}
```

## Vision Skill Policy

Read `.cursor/skills/epb-vision/SKILL.md` when:
- Designing platform services or architecture
- Writing handbook content
- Evaluating platform vs application boundaries

Skip for generic CRUD, UI-only fixes, or non-EPB projects (use `project-vision` if present).

## Agent Scaffolding

Copy from `.cursor/skills/boss/templates/<role>.md` to target path. Replace:
- `{{FEATURE}}` — feature slug
- `{{DATE}}` — ISO date

## Gate Definitions

| Gate | Owner | Blocks |
|------|-------|--------|
| Code review | solution-architect | QA |
| UAT | business-analyst | Documentation |
| Security | solution-architect | Documentation, DevOps |

## Role Playbooks

| Role | Playbook |
|------|----------|
| product-manager | `.cursor/skills/sdlc-roles/product-manager.md` |
| business-analyst | `.cursor/skills/sdlc-roles/business-analyst.md` |
| solution-architect | `.cursor/skills/sdlc-roles/solution-architect.md` |
| ui-ux-designer | `.cursor/skills/sdlc-roles/ui-ux-designer.md` |
| frontend-developer | `.cursor/skills/sdlc-roles/frontend-developer.md` |
| backend-developer | `.cursor/skills/sdlc-roles/backend-developer.md` |
| qa-engineer | `.cursor/skills/sdlc-roles/qa-engineer.md` |
| documentation-versioning | `.cursor/skills/sdlc-roles/documentation-versioning.md` |
| devops-engineer | `.cursor/skills/sdlc-roles/devops-engineer.md` |

## Templates

Role agent templates: `.cursor/skills/boss/templates/`

## Related

- [agents README](../agents/README.md)
- [team README](../team/README.md)
- [epb-vision](../epb-vision/SKILL.md)
