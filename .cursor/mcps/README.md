# MCP Catalog (BOSS-managed)

BOSS composes MCP servers dynamically from this catalog. Only enable what each feature or project needs.

## Quick Start

```text
Use BOSS to mcp list
Use BOSS to mcp enable linear
Use BOSS to mcp sync
```

## Catalog

| ID | Purpose | EPB default | Auth |
|----|---------|-------------|------|
| `gbrain` | Handbook/repo semantic search | Enabled | None |
| `github` | PRs, issues, checks, releases | Enabled | OAuth/token |
| `linear` | Issue tracking, sprint linkage | Optional | API key |
| `slack` | Team notifications, context | Optional | OAuth |
| `sentry` | Error monitoring, incident context | Optional | API token |

## Structure

```text
.cursor/mcps/
├── catalog.json          # Full catalog with when-to-use signals
├── templates/            # Per-MCP mcp.json snippets
│   ├── gbrain.json
│   ├── github.json
│   ├── linear.json
│   ├── slack.json
│   └── sentry.json
└── README.md
```

Active config: [`.cursor/mcp.json`](../mcp.json) — BOSS merges templates here.

## Installation Notes

BOSS does **not** install MCP server binaries. Prerequisites per MCP:

### gbrain

```bash
# Install via bun (see gstack docs)
bun install -g @gstack/gbrain
gbrain init --pglite --no-embedding
gbrain import . --no-embed
```

Create `.gbrain-source` with repo path. Add `.gbrain-source` to `.gitignore`.

### github

Requires GitHub token or Cursor OAuth. Use `gh auth login` or set `GITHUB_TOKEN`.

### linear, slack, sentry

Enable via `BOSS mcp enable <id>`, then authenticate when Cursor prompts (`mcp_auth`).

## Routing

See [mcp-routing skill](../skills/mcp-routing/SKILL.md) for when BOSS invokes each MCP.

## Bootstrap

`bootstrap.ps1` copies this folder and `mcp.json` to target projects. Customize `catalog.json` defaults per project.
