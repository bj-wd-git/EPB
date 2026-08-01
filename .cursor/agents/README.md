# EPB SDLC Agents

## BOSS — Your Entry Point

Invoke **BOSS** for all coordinated SDLC work:

```text
Use BOSS to deliver "notification-retry"
Use BOSS to init
Use BOSS to sync
```

**BOSS** = Build Orchestration Supervisory System

| File | Purpose |
|------|---------|
| [boss.md](boss.md) | Manager — composes teams, coordinates roles, writes reports |
| [roles/](roles/) | Shared reusable role agent catalog |
| [teams/](teams/) | Per-feature dynamic teams (created by BOSS) |

## Role Catalog

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

## Direct Role Invoke (Advanced)

```text
Use product-manager subagent for acceptance criteria on feature X
```

## Skills

| Skill | Path |
|-------|------|
| BOSS workflow | `.cursor/skills/boss/SKILL.md` |
| Role playbooks | `.cursor/skills/sdlc-roles/` |
| EPB Vision | `.cursor/skills/epb-vision/SKILL.md` |

## Team Workspace

Reports and registry: [`.cursor/team/`](../team/README.md)

## Bootstrap to Another Project

```powershell
.\.cursor\team\bootstrap.ps1 -TargetPath C:\path\to\project
```
