# BOSS PRD Workspace

Full pre-development pipeline before BOSS `deliver`.

## Pipeline

```text
PRD → Doc → Workflows → UI/UX → HTML Designs → Develop
 1      2        3          4          5           6
```

| Stage | Artifact | Template | BOSS command |
|-------|----------|----------|--------------|
| 1. PRD | `PRD.md` | [PRD-TEMPLATE.md](PRD-TEMPLATE.md) | `BOSS prd <slug>` |
| 2. Doc | `dev-docs.md` | [DEV-DOCS-TEMPLATE.md](DEV-DOCS-TEMPLATE.md) | `BOSS prd doc <slug>` |
| 3. Workflows | `workflows.md` | [WORKFLOWS-TEMPLATE.md](WORKFLOWS-TEMPLATE.md) | `BOSS prd workflows <slug>` |
| 4. UI/UX | `ux-spec.md` | [UI-UX-TEMPLATE.md](UI-UX-TEMPLATE.md) | `BOSS prd ux <slug>` |
| 5. HTML | `designs/*.html` | [HTML-DESIGN-TEMPLATE.html](HTML-DESIGN-TEMPLATE.html) | `BOSS prd designs <slug>` |
| 6. Develop | code | — | `BOSS deliver <slug>` |

**Approve:** `BOSS prd approve <slug>` — requires score ≥ 85 + all stages 1–5.

## Structure

```text
.cursor/team/prds/<slug>/
├── PRD.md
├── dev-docs.md
├── workflows.md
├── ux-spec.md
├── designs/
│   └── *.html
└── prd-meta.json
```

## Validation

```bash
node scripts/validate-prd.js --feature <slug> --score --pipeline
```

## Example

[_example/notification-retry/](_example/notification-retry/) — full pipeline

Skill: [prd-developer](../../skills/prd-developer/SKILL.md)
