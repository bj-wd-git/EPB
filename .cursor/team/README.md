# EPB SDLC Team (BOSS)

**BOSS** (Build Orchestration Supervisory System) is the manager agent that composes SDLC teams dynamically, coordinates role agents, and writes consolidated feature reports.

## Quick Start

```text
Use BOSS to deliver "my-feature-name"
Use BOSS to init
Use BOSS to sync
```

## Structure

```text
.cursor/
├── agents/
│   ├── boss.md              ← invoke this
│   ├── roles/               ← shared role catalog
│   └── teams/<feature>/     ← dynamic per-feature teams
├── skills/
│   ├── boss/                ← BOSS workflow
│   ├── sdlc-roles/          ← role playbooks
│   └── epb-vision/          ← use when required
└── team/
    ├── registry.json        ← active teams
    ├── reports/             ← one report per feature
    └── bootstrap.ps1        ← copy to other projects
```

## Reports

One consolidated report per feature: `.cursor/team/reports/<feature-slug>.md`

Example: [reports/_example/notification-retry.md](reports/_example/notification-retry.md)

## Vision Skills

| Skill | When |
|-------|------|
| [epb-vision](../skills/epb-vision/SKILL.md) | EPB platform/architecture work |
| [project-vision](../skills/project-vision/SKILL.md) | Template for other projects |

## Bootstrap to Another Project

```powershell
.\.cursor\team\bootstrap.ps1 -TargetPath C:\path\to\your-project
```

Copies BOSS agent, skills, role catalog templates, and team folder skeleton.

## Agents Index

See [`.cursor/agents/README.md`](../agents/README.md)
