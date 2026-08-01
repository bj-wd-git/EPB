# EPB SDLC Agents

## BOSS — Your Entry Point

Invoke **BOSS** for all coordinated SDLC work:

```text
Use BOSS to deliver "notification-retry"
Use BOSS to init
Use BOSS to sync
Use BOSS to mcp list
Use BOSS to mcp enable sentry
```

**BOSS** = Build Orchestration Supervisory System

| File | Purpose |
|------|---------|
| [boss.md](boss.md) | Manager — composes teams, MCPs, skills, coordinates agents, writes reports |
| [roles/](roles/) | Shared SDLC role agent catalog (9) |
| [specialists/](specialists/) | Specialist agent catalog (6) |
| [teams/](teams/) | Per-feature dynamic teams (created by BOSS) |

## SDLC Role Catalog

| Agent | Role |
|-------|------|
| [product-manager](roles/product-manager.md) | Goals, acceptance criteria, priority |
| [business-analyst](roles/business-analyst.md) | User stories, FRD, UAT |
| [solution-architect](roles/solution-architect.md) | Architecture, API design, reviews |
| [ui-ux-designer](roles/ui-ux-designer.md) | Wireframes, design system, a11y |
| [frontend-developer](roles/frontend-developer.md) | UI, BFF integration |
| [backend-developer](roles/backend-developer.md) | APIs, business logic |
| [qa-engineer](roles/qa-engineer.md) | Testing, regression |
| [documentation-versioning](roles/documentation-versioning.md) | Docs, CHANGELOG, semver |
| [devops-engineer](roles/devops-engineer.md) | CI/CD, deploy, release |

## Specialist Catalog

| Agent | subagent_type | When |
|-------|---------------|------|
| [explore](specialists/explore.md) | explore | Broad codebase search |
| [shell](specialists/shell.md) | shell | Git, CI, scripts |
| [bugbot](specialists/bugbot.md) | bugbot | Post-implementation review |
| [security-review](specialists/security-review.md) | security-review | Security gate |
| [ci-investigator](specialists/ci-investigator.md) | ci-investigator | Failed PR checks |
| [cursor-guide](specialists/cursor-guide.md) | cursor-guide | Cursor product questions |

## MCPs

BOSS manages MCPs from [`.cursor/mcps/catalog.json`](../mcps/catalog.json). Active config: [`.cursor/mcp.json`](../mcp.json).

| MCP | EPB default |
|-----|-------------|
| gbrain | Yes |
| github | Yes |
| linear, slack, sentry | Optional |

## Direct Invoke (Advanced)

```text
Use product-manager subagent for acceptance criteria on feature X
Use security-review subagent for security scan
```

## Skills

| Skill | Path |
|-------|------|
| BOSS workflow | `.cursor/skills/boss/SKILL.md` |
| SDLC playbooks | `.cursor/skills/sdlc-roles/` |
| Specialist playbooks | `.cursor/skills/specialist-roles/` |
| MCP routing | `.cursor/skills/mcp-routing/SKILL.md` |
| Skills catalog | `.cursor/skills/skills-catalog/SKILL.md` |
| EPB Vision | `.cursor/skills/epb-vision/SKILL.md` |

## Team Workspace

Reports and registry: [`.cursor/team/`](../team/README.md)

## Bootstrap to Another Project

```powershell
.\.cursor\team\bootstrap.ps1 -TargetPath C:\path\to\project
```
