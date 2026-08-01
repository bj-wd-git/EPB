# BOSS — Build Orchestration Supervisory System

**One agent. Full SDLC delivery.**

BOSS is a Cursor agent kit that composes SDLC teams, specialist agents, MCP servers, and skills dynamically — then writes one consolidated report per feature.

Use this document as a **public reference** for any project. Share the link:

`https://github.com/bj-wd-git/EPB/blob/main/BOSS.md`

---

## What BOSS Does

| Responsibility | Detail |
|----------------|--------|
| **Compose** | Picks only the agents, MCPs, and skills needed per task |
| **Coordinate** | Runs SDLC phases with quality gates (review, UAT, security) |
| **Manage MCPs** | Enables tools from a catalog (gbrain, GitHub, Linear, Slack, Sentry) |
| **Report** | Merges all outputs into one file per feature |

You talk to **BOSS** only. BOSS delegates to role agents, specialists, and MCP tools.

---

## Adopt in Any Project

### Option A — Bootstrap (recommended)

```powershell
git clone https://github.com/bj-wd-git/EPB.git
.\EPB\.cursor\team\bootstrap.ps1 -TargetPath C:\path\to\your-project
```

This copies the full `.cursor/` kit: BOSS agent, SDLC roles, specialists, MCP catalog, skills, and team workspace.

### Option B — Reference from Cursor

In any project chat:

```text
Read https://github.com/bj-wd-git/EPB/blob/main/BOSS.md
Use BOSS to init
Use BOSS to deliver "my-feature"
```

Or attach this file with `@BOSS.md` after cloning the repo.

---

## Quick Start

```text
Use BOSS to init
Use BOSS to fix "broken link in README"
Use BOSS to deliver "my-feature-name"
Use BOSS to continue "my-feature-name"
Use BOSS to mcp list
```

---

## Delivery Modes

| Mode | Command | Speed | Gates |
|------|---------|-------|-------|
| **fix** | `BOSS fix <desc>` | Fastest — BOSS inline, no subagents | `validation.json` |
| **standard** | `BOSS deliver <feature>` | Balanced | code-review, qa, uat |
| **full** | `BOSS deliver <feature> --full` | Thorough | All gates + security-review |

BOSS auto-triages if you don't specify a mode.

---

## Hard Gates (CI-enforced)

Reports cannot claim **PASS** without gate artifact files:

```text
.cursor/team/gates/<feature-slug>/
├── validation.json      # fix mode
├── code-review.json
├── qa.json
├── uat.json
└── security-review.json
```

Validate locally:

```bash
node scripts/validate-boss-gates.js --feature notification-retry
```

CI runs **BOSS Gates** workflow on PRs (`.github/workflows/boss-gates.yml`).

---

## Multi-Session / Unattended Delivery

Checkpoints track progress across sessions:

```text
.cursor/team/checkpoints/<feature-slug>.json
```

```text
Use BOSS to continue notification-retry
```

For cloud agents or GitHub-triggered delivery:
- Label issue `boss:deliver` or run **BOSS Deliver** workflow
- Title format: `[boss:my-feature] Description`
- Set `unattended: true` in checkpoint for hands-off runs

---

## What You Get

### SDLC Roles (9)

| Agent | Role |
|-------|------|
| product-manager | Goals, acceptance criteria, priority |
| business-analyst | User stories, FRD, UAT |
| solution-architect | Architecture, API design, reviews |
| ui-ux-designer | Wireframes, design system, accessibility |
| frontend-developer | UI, BFF integration |
| backend-developer | APIs, business logic |
| qa-engineer | Testing, regression |
| documentation-versioning | Docs, CHANGELOG, semver |
| devops-engineer | CI/CD, deploy, release |

### Specialist Agents (6)

| Agent | When |
|-------|------|
| explore | Broad codebase search |
| shell | Git, CI, validation scripts |
| bugbot | Post-implementation code review |
| security-review | Security gate scan |
| ci-investigator | Failed PR checks |
| cursor-guide | Cursor product questions |

### MCP Catalog (5)

| MCP | Default (EPB) | Purpose |
|-----|-----------------|---------|
| gbrain | Enabled | Handbook/repo search |
| github | Enabled | PRs, CI, releases |
| linear | Optional | Issue tracking |
| slack | Optional | Team comms |
| sentry | Optional | Error monitoring |

### Skills

| Skill | When |
|-------|------|
| epb-vision | EPB platform/architecture work |
| project-vision | Non-EPB project context (customize this) |
| mcp-routing | Before any MCP tool call |
| boss | Team orchestration workflow |

---

## Delivery Flow

```text
PM → BA → Architect → UX+BE (parallel) → FE
  → Code review + bugbot (parallel)
  → QA → UAT
  → Security review (architect + security-review)
  → Docs → DevOps
  → ci-investigator (if CI fails)
```

MCP calls happen within phases — e.g. gbrain for handbook refs, github for releases.

**One report per feature:** `.cursor/team/reports/<feature-slug>.md`

---

## For Non-EPB Projects

1. Bootstrap the kit into your project
2. Customize [`.cursor/skills/project-vision/SKILL.md`](.cursor/skills/project-vision/SKILL.md) with your mission, architecture, and standards
3. Enable MCPs as needed: `Use BOSS to mcp enable github`
4. Deliver: `Use BOSS to deliver "user-auth"`

You do **not** need the EPB handbook volumes. BOSS works standalone.

---

## Repo Structure

```text
.cursor/
├── agents/
│   ├── boss.md              ← invoke this
│   ├── roles/               ← 9 SDLC agents
│   ├── specialists/         ← 6 specialist agents
│   └── teams/<feature>/     ← per-feature dynamic teams
├── mcps/
│   ├── catalog.json
│   └── templates/
├── mcp.json                 ← active MCP config
├── skills/
│   ├── boss/
│   ├── sdlc-roles/
│   ├── specialist-roles/
│   ├── mcp-routing/
│   └── skills-catalog/
└── team/
    ├── registry.json
    ├── checkpoints/         ← multi-session state
    ├── gates/               ← machine-checkable gate artifacts
    ├── reports/
    └── bootstrap.ps1
scripts/
└── validate-boss-gates.js   ← gate validator (CI + local)
.github/workflows/
├── boss-gates.yml           ← PR gate enforcement
└── boss-deliver.yml         ← issue / manual delivery trigger
```

---

## BOSS Commands

| Command | Action |
|---------|--------|
| `BOSS init` | Scaffold role + specialist catalogs, MCP defaults |
| `BOSS sync` | Update agents, refresh MCP health |
| `BOSS fix <desc>` | Fast inline fix + validation gate |
| `BOSS deliver <feature>` | Standard delivery (auto-triage) |
| `BOSS deliver <feature> --full` | Full SDLC + all gates |
| `BOSS continue <feature>` | Resume from checkpoint |
| `BOSS mcp list` | Show MCP catalog and active status |
| `BOSS mcp enable <id>` | Add MCP from catalog |
| `BOSS mcp sync` | Health-check active MCPs |

---

## Example Report

See [notification-retry example](.cursor/team/reports/_example/notification-retry.md) for a filled report with SDLC sections, MCP usage, and specialist findings.

---

## Deep Documentation

| Doc | Path |
|-----|------|
| Team workspace | [.cursor/team/README.md](.cursor/team/README.md) |
| Gate artifacts | [.cursor/team/gates/README.md](.cursor/team/gates/README.md) |
| Checkpoints | [.cursor/team/checkpoints/CHECKPOINT-SCHEMA.md](.cursor/team/checkpoints/CHECKPOINT-SCHEMA.md) |
| Agents index | [.cursor/agents/README.md](.cursor/agents/README.md) |
| MCP catalog | [.cursor/mcps/README.md](.cursor/mcps/README.md) |
| Skills catalog | [.cursor/skills/skills-catalog/SKILL.md](.cursor/skills/skills-catalog/SKILL.md) |
| BOSS workflow | [.cursor/skills/boss/SKILL.md](.cursor/skills/boss/SKILL.md) |
| EPB Vision | [.cursor/skills/epb-vision/SKILL.md](.cursor/skills/epb-vision/SKILL.md) |

---

## About EPB

This repo also contains the **Enterprise Platform Blueprint** — a 192-chapter handbook for building enterprise applications. BOSS and the handbook are independent: use BOSS in any project, with or without EPB content.

Handbook entry: [README.md](README.md)

---

*BOSS · Framework-agnostic · Domain-neutral · Repo-local · Bootstrap to any project*
