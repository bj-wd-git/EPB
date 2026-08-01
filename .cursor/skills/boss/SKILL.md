---
name: boss
description: >-
  BOSS workflow for dynamic SDLC team composition, specialist agents, MCP orchestration,
  skills routing, gates, and consolidated reporting. Use with the boss agent or when
  managing SDLC delivery.
---

# BOSS Skill — Team Orchestration

## PRD → Dev-docs → Deliver (recommended for new features)

```text
1. BOSS prd <slug>     → prd-developer authors PRD.md + dev-docs.md
2. validate-prd.js     → completeness check
3. BOSS prd approve    → prd-meta.json status: approved
4. BOSS deliver <slug> → reads dev-docs as source of truth
```

### BOSS prd workflow

1. Parse brief → slug
2. Invoke **prd-developer** (optionally PM + BA + Architect in parallel for input)
3. Write `.cursor/team/prds/<slug>/PRD.md` from [PRD-TEMPLATE](../../team/prds/PRD-TEMPLATE.md)
4. Write `.cursor/team/prds/<slug>/dev-docs.md` from [DEV-DOCS-TEMPLATE](../../team/prds/DEV-DOCS-TEMPLATE.md)
5. Write `prd-meta.json` with `status: draft`
6. Run `node scripts/validate-prd.js --feature <slug>`
7. Register in `registry.json` → `prds` array

### BOSS prd approve

1. Run `node scripts/validate-prd.js --feature <slug> --score` — must pass with score ≥ 85
2. Set `prd-meta.json` → `status: approved`, `approved: <date>`, `qualityScore: <score>`
3. Confirm dev-docs status → `Ready for BOSS`

### BOSS prd revise

1. Set `prd-meta.json` → `status: draft`, bump `version` (semver patch)
2. Re-run prd-developer with revision notes
3. Re-validate before re-approve

### BOSS deliver with dev-docs

When `.cursor/team/prds/<slug>/dev-docs.md` exists:

1. Read dev-docs **before** triage
2. Use **BOSS Delivery Config** section for mode, roles, MCPs, skills
3. Execute **Task Breakdown** T-001… in order
4. Validate against **Acceptance Criteria** and **Test Plan**
5. If PRD status is `draft`, warn user — recommend `BOSS prd approve` first

Skill: [prd-developer](../prd-developer/SKILL.md)

## Delivery Modes (Triage)

| Mode | Command | Subagents | Gates | Report template |
|------|---------|-----------|-------|-----------------|
| **fix** | `BOSS fix <desc>` | None (BOSS inline) | `validation.json` | `REPORT-FAST-TEMPLATE.md` |
| **standard** | `BOSS deliver <feature>` | 3–7 roles | code-review, bugbot, qa, uat | `REPORT-TEMPLATE.md` |
| **full** | `BOSS deliver <feature> --full` | All 9 + specialists | All gates + security-review | `REPORT-TEMPLATE.md` |

### Auto-triage (when mode not specified)

```text
fix      → typo, broken link, rename, < 50 lines, no new API
full     → platform feature, new service, security-sensitive, EPB handbook chapter
standard → everything else
```

## Workflow: Deliver a Feature

1. **Triage** — select fix / standard / full
2. **Analyze** — parse request, pick SDLC roles, specialists, MCPs, skills; create feature slug
3. **Checkpoint** — create/update `.cursor/team/checkpoints/<slug>.json`
4. **Compose** — create `.cursor/team/reports/<slug>.md` and team agents (skip for fix mode)
5. **Enable MCPs** — merge required templates into `.cursor/mcp.json` from catalog
6. **Register** — update `.cursor/team/registry.json` (v2)
7. **Execute phases** — invoke agents (or inline for fix), write gate artifacts
8. **Validate** — `node scripts/validate-boss-gates.js --feature <slug>`
9. **Gate check** — block on FAIL; artifacts must exist for every PASS
10. **Finalize** — set checkpoint `status: complete`, summarize for user

## Workflow: BOSS fix (fast path)

1. Create slug from description
2. Create report from `REPORT-FAST-TEMPLATE.md`
3. BOSS implements change inline (no Task subagents)
4. Run validation (`check-links`, lint, or tests as applicable)
5. Write `.cursor/team/gates/<slug>/validation.json` with result
6. Run `node scripts/validate-boss-gates.js --feature <slug> --mode fix`
7. Mark report Complete

## Workflow: BOSS continue (multi-session)

1. Read `.cursor/team/checkpoints/<slug>.json`
2. If `status: blocked` → report blocker, stop
3. Load report and registry entry
4. Resume from `phasesRemaining[0]` or phase after `phaseName`
5. After each phase: update checkpoint (`phasesCompleted`, `phase`, `lastUpdated`)
6. If `unattended: true` → do not prompt user; document open questions in report
7. Commit checkpoint + report when a phase completes (recommended for cloud agents)

## Unattended Rules

| Rule | Detail |
|------|--------|
| No user prompts | When `unattended: true`, unless `blockedOn` is set |
| Blockers | Set `blockedOn` + `blockedReason` + `status: blocked` |
| Max phases per session | Complete up to 4 phases, then update checkpoint and exit cleanly |
| Auth failures | MCP `needsAuth` → set blockedOn: `mcp:<id>` |
| Ambiguity | Pick conservative default; log in Open Questions |

## GitHub Automation

| Trigger | Workflow | Action |
|---------|----------|--------|
| PR changes `.cursor/team/**` | `boss-gates.yml` | check-links + validate-boss-gates |
| Manual / issue label `boss:deliver` | `boss-deliver.yml` | Scaffold checkpoint, post Cursor instructions |

Issue title format for auto-slug: `[boss:my-feature] Description here`

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

| Gate | Owner | Artifact | Blocks |
|------|-------|----------|--------|
| Validation | BOSS / scripts | `validation.json` | Complete (fix mode) |
| Code review | solution-architect | `code-review.json` | QA |
| Bugbot review | bugbot | `bugbot.json` | QA (on FAIL) |
| QA | qa-engineer | `qa.json` | UAT |
| UAT | business-analyst | `uat.json` | Documentation |
| Security | security-review | `security-review.json` | Documentation, DevOps |

Validate: `node scripts/validate-boss-gates.js --feature <slug>`

See [gates README](../../team/gates/README.md) and [checkpoint schema](../../team/checkpoints/CHECKPOINT-SCHEMA.md).

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
