# EPB SDLC Team (BOSS)

**BOSS** (Build Orchestration Supervisory System) is the manager agent that composes SDLC teams, specialist agents, MCP servers, and skills dynamically — then writes consolidated feature reports.

**Public reference:** [BOSS.md](../../BOSS.md) — shareable link for any project.

## Quick Start

```text
Use BOSS to fix "broken link in README"
Use BOSS to deliver "my-feature-name"
Use BOSS to continue "my-feature-name"
Use BOSS to init
Use BOSS to mcp list
```

## Delivery Modes

| Mode | Command | Gates |
|------|---------|-------|
| fix | `BOSS fix <desc>` | `validation.json` only |
| standard | `BOSS deliver <feature>` | code-review, qa, uat |
| full | `BOSS deliver <feature> --full` | all gates + security |

## Gate Enforcement

Gate artifacts: [gates/README.md](gates/README.md)

```bash
node scripts/validate-boss-gates.js --feature notification-retry
```

CI: `.github/workflows/boss-gates.yml` runs on PRs.

## Checkpoints (multi-session)

Resume delivery: `Use BOSS to continue <feature>`

Schema: [checkpoints/CHECKPOINT-SCHEMA.md](checkpoints/CHECKPOINT-SCHEMA.md)

GitHub trigger: label issue `boss:deliver` or run **BOSS Deliver** workflow.

## Structure

```text
.cursor/
├── agents/
│   ├── boss.md              ← invoke this
│   ├── roles/               ← SDLC role catalog (9)
│   ├── specialists/         ← specialist agents (6)
│   └── teams/<feature>/     ← dynamic per-feature teams
├── mcps/
│   ├── catalog.json         ← MCP catalog
│   └── templates/           ← per-MCP config snippets
├── mcp.json                 ← active MCP config (BOSS maintains)
├── skills/
│   ├── boss/                ← BOSS workflow
│   ├── sdlc-roles/          ← SDLC playbooks
│   ├── specialist-roles/    ← specialist playbooks
│   ├── mcp-routing/         ← when to call which MCP
│   ├── skills-catalog/      ← invocable skills index
│   └── epb-vision/          ← use when required
└── team/
    ├── registry.json        ← teams + MCPs + skills (v2)
    ├── checkpoints/         ← multi-session state
    ├── gates/               ← gate artifacts
    ├── reports/             ← one report per feature
    ├── REPORT-TEMPLATE.md
    ├── REPORT-FAST-TEMPLATE.md
    └── bootstrap.ps1        ← copy to other projects
```

## Reports

One consolidated report per feature: `.cursor/team/reports/<feature-slug>.md`

Includes SDLC sections, MCP tools used, and specialist findings.

Example: [reports/_example/notification-retry.md](reports/_example/notification-retry.md)

## MCPs

| MCP | EPB default | Purpose |
|-----|-------------|---------|
| gbrain | Enabled | Handbook/repo search |
| github | Enabled | PRs, CI, releases |
| linear | Optional | Issue tracking |
| slack | Optional | Team comms |
| sentry | Optional | Error monitoring |

See [mcps/README.md](../mcps/README.md) for setup and auth.

## Vision & Skills

| Skill | When |
|-------|------|
| [epb-vision](../skills/epb-vision/SKILL.md) | EPB platform/architecture work |
| [project-vision](../skills/project-vision/SKILL.md) | Template for other projects |
| [mcp-routing](../skills/mcp-routing/SKILL.md) | Before MCP tool calls |
| [skills-catalog](../skills/skills-catalog/SKILL.md) | All invocable skills |

## Bootstrap to Another Project

```powershell
.\.cursor\team\bootstrap.ps1 -TargetPath C:\path\to\your-project
```

Copies BOSS agent, skills, role/specialist catalogs, MCP catalog, validator script, workflows, and team folder skeleton.

## Agents Index

See [`.cursor/agents/README.md`](../agents/README.md)
