# CLAUDE.md — EPB Project Instructions

## Project

Enterprise Platform Blueprint (EPB) — a 3-volume Markdown handbook (~192 chapters).

## Skill Routing

When the user's request matches an available skill, invoke it via the Skill tool.

| Trigger | Skill |
|---------|-------|
| Write handbook chapter | `/document-generate` |
| Architecture / sequence diagram | `/diagram` |
| Save / resume multi-session work | `/context-save` / `/context-restore` |
| Cross-volume consistency check | `/review` |
| Split volume into PRs | `/split-to-prs` |
| Full plan review | `/autoplan` |
| Ship / commit | `/ship` |

## EPB Conventions

1. Read [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) before writing any chapter
2. Use terms from [docs/GLOSSARY.md](docs/GLOSSARY.md) consistently
3. Update [docs/CHAPTER-MANIFEST.json](docs/CHAPTER-MANIFEST.json) status when chapters are written
4. Never assume a business domain — platform must work for ERP, CRM, hospital, school, etc.
5. Subagents write only their assigned chapter IDs from the manifest

## GBrain

Semantic search across handbook content. Run `/sync-gbrain` after major chapter batches.

MCP configured in `.cursor/mcp.json` → `gbrain serve`

## Subagent Protocol

```
Read: goal.md, docs/STYLE-GUIDE.md, docs/GLOSSARY.md, docs/CHAPTER-MANIFEST.json
Write chapters: [ASSIGNED_IDS only]
Update manifest status to "draft" for completed chapters
Return: files written, glossary additions, cross-ref gaps
```

## Architecture

```text
Frontend → BFF → Platform Services → Shared Libraries → Infrastructure
```
