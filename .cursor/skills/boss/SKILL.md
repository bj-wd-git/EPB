---
name: boss
description: >-
  BOSS workflow for dynamic SDLC team composition, specialist agents, MCP orchestration,
  skills routing, gates, and consolidated reporting. Use with the boss agent or when
  managing SDLC delivery.
---

# BOSS Skill — Team Orchestration

## Workflow: Deliver a Feature

1. **Analyze** — parse request, pick SDLC roles, specialists, MCPs, skills; create feature slug
2. **Compose** — create `.cursor/agents/teams/<slug>/`, scaffold agents from templates
3. **Enable MCPs** — merge required templates into `.cursor/mcp.json` from catalog
4. **Register** — update `.cursor/team/registry.json` (v2: teams, mcps, skills)
5. **Report shell** — create `.cursor/team/reports/<slug>.md` from `REPORT-TEMPLATE.md`
6. **Execute phases** — invoke agents, call MCP tools per mcp-routing, update report
7. **Gate check** — code review, bugbot, UAT, security-review — block on FAIL
8. **Finalize** — set status Complete, summarize for user

## SDLC + Specialist Phase Order

```text
1. product-manager
2. business-analyst          (gbrain for handbook refs)
3. solution-architect        (gbrain for ADRs)
4. ui-ux-designer + backend-developer (parallel)
5. frontend-developer
6. solution-architect (code review) + bugbot (parallel)
7. qa-engineer               (sentry if production errors)
8. business-analyst (UAT)
9. solution-architect + security-review (parallel, security gate)
10. documentation-versioning
11. devops-engineer          (github for release)
12. ci-investigator          (if CI fails on PR)
```

Skip phases not applicable. Invoke `explore` early for unfamiliar codebases. Use `shell` for git/CI/scripts.

## Dynamic Composition Rules

| Rule | Detail |
|------|--------|
| Minimum viable team | Only agents, MCPs, skills needed for the request |
| Parallel limit | Max 4 Task subagents at once |
| Multiple instances | Suffix with `-1`, `-2` for parallel same-role work |
| Shared catalogs | `.cursor/agents/roles/`, `.cursor/agents/specialists/` |
| Feature teams | `.cursor/agents/teams/<slug>/` for feature-specific agents |
| MCP minimum | Enable only MCPs required; EPB defaults: gbrain + github |

## MCP Management

### Commands

| Command | Action |
|---------|--------|
| `BOSS mcp list` | Read catalog + GetMcpTools for active status |
| `BOSS mcp enable <id>` | Merge `.cursor/mcps/templates/<id>.json` into mcp.json |
| `BOSS mcp sync` | GetMcpTools on each active server; report needsAuth/errors |
| `BOSS mcp auth <id>` | Call mcp_auth, retry |

### Catalog

`.cursor/mcps/catalog.json` — see [MCP README](../../mcps/README.md)

| MCP | Default (EPB) | When |
|-----|---------------|------|
| gbrain | Yes | Handbook, ADR, chapter lookup |
| github | Yes | PR, CI, release |
| linear | No | Sprint, backlog sync |
| slack | No | Team comms |
| sentry | No | Production errors |

Routing details: [mcp-routing skill](../mcp-routing/SKILL.md)

## Specialist Agents

| Specialist | subagent_type | When | Template |
|------------|---------------|------|----------|
| explore | explore | Broad codebase search | `templates-specialists/explore.md` |
| shell | shell | Git, CI, scripts | `templates-specialists/shell.md` |
| bugbot | bugbot | Post-implementation review | `templates-specialists/bugbot.md` |
| security-review | security-review | Security gate | `templates-specialists/security-review.md` |
| ci-investigator | ci-investigator | Failed PR checks | `templates-specialists/ci-investigator.md` |
| cursor-guide | cursor-guide | Cursor product questions | `templates-specialists/cursor-guide.md` |

Playbooks: `.cursor/skills/specialist-roles/`

## Skills Policy

Read [skills-catalog](../skills-catalog/SKILL.md) before delegating. Record applied skills in report header.

| Task | Skills |
|------|--------|
| EPB platform work | epb-vision, mcp-routing |
| Non-EPB project | project-vision |
| Any MCP call | mcp-routing |
| Orchestration | boss (meta) |

## Registry Format (v2)

`.cursor/team/registry.json`:

```json
{
  "version": "2.0",
  "maintained-by": "boss",
  "mcps": {
    "active": ["gbrain", "github"],
    "catalog": ".cursor/mcps/catalog.json"
  },
  "skills": {
    "catalog": ".cursor/skills/skills-catalog/SKILL.md"
  },
  "teams": [
    {
      "slug": "notification-retry",
      "status": "in_progress",
      "agents": ["product-manager", "backend-developer", "security-review"],
      "mcps": ["gbrain", "github"],
      "skills": ["epb-vision", "mcp-routing"],
      "report": ".cursor/team/reports/notification-retry.md"
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

SDLC: copy from `.cursor/skills/boss/templates/<role>.md`
Specialists: copy from `.cursor/skills/boss/templates-specialists/<name>.md`

Replace `{{FEATURE}}` with feature slug, `{{DATE}}` with ISO date.

## Gate Definitions

| Gate | Owner | Blocks |
|------|-------|--------|
| Code review | solution-architect | QA |
| Bugbot review | bugbot | QA (on FAIL) |
| UAT | business-analyst | Documentation |
| Security | solution-architect + security-review | Documentation, DevOps |

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

- SDLC role agents: `.cursor/skills/boss/templates/`
- Specialist agents: `.cursor/skills/boss/templates-specialists/`

## Related

- [agents README](../../agents/README.md)
- [team README](../../team/README.md)
- [MCP catalog](../../mcps/README.md)
- [skills-catalog](../skills-catalog/SKILL.md)
- [mcp-routing](../mcp-routing/SKILL.md)
- [epb-vision](../epb-vision/SKILL.md)
