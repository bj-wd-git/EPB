---
name: mcp-routing
description: >-
  When to invoke which MCP server and tool. Use before any MCP tool call, when
  BOSS composes feature teams, or when enabling MCPs for a task.
---

# MCP Routing

BOSS reads this skill before calling MCP tools or enabling MCPs for a feature.

## Discovery

1. Call `GetMcpTools` to list available servers and tool schemas
2. Check `serverStatus` — if `needsAuth`, call `mcp_auth` before retrying
3. Read [catalog.json](../../mcps/catalog.json) for when-to-use signals
4. Record MCP usage in feature report section 12

## Routing Table

| Task signal | MCP | Typical tools | Phase |
|-------------|-----|---------------|-------|
| Handbook/ADR/chapter lookup | gbrain | search, fetch resource | BA, Architect, Docs |
| PR review, merge, release | github | pr, checks, issues | DevOps, ci-investigator |
| CI check failure on PR | github | checks, pr | ci-investigator |
| Sprint/issue linkage | linear | issues, projects | PM, BA |
| Team comms, incident context | slack | search, post | DevOps, PM |
| Production errors, QA validation | sentry | issues, events | QA, DevOps |

## Composition Rules

| Rule | Detail |
|------|--------|
| Minimum viable | Enable only MCPs needed for the feature |
| EPB defaults | gbrain + github for EPB repo |
| Per-feature | BOSS registers active MCPs in registry.json |
| Auth gate | Block MCP-dependent work until auth succeeds |
| Health check | `BOSS mcp sync` via GetMcpTools on each active server |

## Enable Workflow

1. Read catalog entry for MCP id
2. Merge template from `.cursor/mcps/templates/<id>.json` into `.cursor/mcp.json`
3. Update `registry.json` → `mcps.active`
4. Run GetMcpTools to verify
5. If `needsAuth`, guide user through `mcp_auth`

## Within SDLC Phases

- **PM/BA:** gbrain (handbook refs), linear (backlog sync)
- **Architect:** gbrain (ADRs, architecture chapters)
- **QA:** sentry (error context), github (test PRs)
- **DevOps:** github (release, checks), slack (notifications)
- **ci-investigator:** github (failed checks)

## Do Not

- Enable all MCPs by default
- Call MCP tools without reading tool schema first
- Skip recording MCP usage in the feature report

## Related

- [MCP catalog](../../mcps/README.md)
- [BOSS skill](../boss/SKILL.md)
