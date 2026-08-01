# EPB Context Checkpoint

Generated: 2026-08-01T13:30:00.000Z

## Status

- **192 chapters** — all reviewed, substantive content
- **9 ADRs** — Decision-Records/ADR-001 through ADR-009
- **7 architecture diagrams** — Architecture-Diagrams/ with companion docs
- **3 sequence diagrams** — notification, scheduler, roster
- **0 broken links** — `node scripts/check-links.js` passes

## Volumes

| Volume | Chapters | Index |
|--------|----------|-------|
| 1 Foundation | 40 | [40-volume1-index.md](Volume-1-Foundation/40-volume1-index.md) |
| 2 Platform Services | 72 | (see manifest) |
| 3 Developer Guide | 80 | [80-volume3-index.md](Volume-3-Developer-Guide/80-volume3-index.md) |

## Artifacts

| Artifact | Location |
|----------|----------|
| Style guide | [docs/STYLE-GUIDE.md](STYLE-GUIDE.md) |
| Glossary | [docs/GLOSSARY.md](GLOSSARY.md) |
| Chapter manifest | [docs/CHAPTER-MANIFEST.json](CHAPTER-MANIFEST.json) |
| Architecture diagrams | [Architecture-Diagrams/](Architecture-Diagrams/) |
| Sequence diagrams | [Sequence-Diagrams/](Sequence-Diagrams/) |
| ADRs | [Decision-Records/](Decision-Records/) |
| Templates | [Templates/](Templates/) |
| Checklists | [Checklists/](Checklists/) |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/generate-chapters.js` | Regenerate chapter stubs from manifest |
| `scripts/validate-handbook.js` | Gate check — all files exist |
| `scripts/check-links.js` | Broken relative link scanner |
| `scripts/enhance-boilerplate.js` | Bulk enhancement utility |

## MCP

- gbrain: `.cursor/mcp.json` → `gbrain serve`
- Pin: `.gbrain-source`
- Re-index: `gbrain import . --no-embed`

## Suggested Next Steps

1. Initial git commit (all files currently untracked)
2. Split into 3 volume PRs via `/split-to-prs`
3. Add embedding API key for semantic gbrain search
4. Optional: `/make-pdf` per volume for printable handbooks
