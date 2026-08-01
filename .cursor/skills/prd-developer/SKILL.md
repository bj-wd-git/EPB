# PRD Developer Skill

Produce **enterprise-grade PRDs** and the full **pre-development pipeline** that BOSS `deliver` consumes.

## Pipeline (6 stages)

```text
1. PRD        → PRD.md              (product requirements)
2. Doc        → dev-docs.md         (technical handoff)
3. Workflows  → workflows.md        (business process flows)
4. UI/UX      → ux-spec.md          (screens, journeys, a11y)
5. Designs    → designs/*.html      (static HTML mockups)
6. Develop    → BOSS deliver        (implementation)
```

**Approve gate:** stages 1–5 complete + score ≥ 85 → `BOSS prd approve` → `BOSS deliver`

## Mandatory Reading

1. [reference.md](reference.md) — rubric, INVEST, traceability, anti-patterns
2. [PRD template](../../team/prds/PRD-TEMPLATE.md)
3. [Dev-docs template](../../team/prds/DEV-DOCS-TEMPLATE.md)
4. [Workflows template](../../team/prds/WORKFLOWS-TEMPLATE.md)
5. [UI/UX template](../../team/prds/UI-UX-TEMPLATE.md)
6. [HTML design template](../../team/prds/HTML-DESIGN-TEMPLATE.html)
7. `.cursor/skills/epb-vision/SKILL.md` — EPB platform work

## Quality Standard

```bash
node scripts/validate-prd.js --feature <slug> --score --pipeline
```

Never approve with score &lt; 85, pipeline incomplete, or validation errors.

## BOSS Commands (per stage)

| Stage | Command | Role | Output |
|-------|---------|------|--------|
| 1–2 | `BOSS prd <slug>` | prd-developer | PRD.md + dev-docs.md |
| 2 only | `BOSS prd doc <slug>` | prd-developer | dev-docs.md |
| 3 | `BOSS prd workflows <slug>` | business-analyst | workflows.md |
| 4 | `BOSS prd ux <slug>` | ui-ux-designer | ux-spec.md |
| 5 | `BOSS prd designs <slug>` | ui-ux-designer | designs/*.html |
| Gate | `BOSS prd approve <slug>` | BOSS | prd-meta approved |
| 6 | `BOSS deliver <slug>` | BOSS + SDLC team | code + gates |

## Workflow Phases

### Phase 0 — Clarify (mandatory)

Answer discovery questions (reference.md). State assumptions in PRD §4 if brief is thin.

### Phase 1 — Discover (parallel, max 4 subagents)

PM → goals · BA → stories · Architect → API · explore → codebase

### Phase 2 — Author PRD

Path: `.cursor/team/prds/<slug>/PRD.md` — see template minimums.

### Phase 3 — Author dev-docs

Path: `.cursor/team/prds/<slug>/dev-docs.md` — tasks, APIs, tests, traceability.

### Phase 4 — Author workflows

Path: `.cursor/team/prds/<slug>/workflows.md` — WF-001+, state machines, BR rules, traceability to US/FR.

### Phase 5 — Author UI/UX spec

Path: `.cursor/team/prds/<slug>/ux-spec.md` — journeys, SCR-### screens, a11y, design tokens, HTML handoff table.

### Phase 6 — Author HTML designs

Path: `.cursor/team/prds/<slug>/designs/*.html` — one file per Must screen in ux-spec §5/§9.

### Phase 7 — Validate & register

```bash
node scripts/validate-prd.js --feature <slug> --score --pipeline
```

Update `prd-meta.json`:

```json
"pipeline": { "prd": "complete", "doc": "complete", "workflows": "complete", "ux": "complete", "designs": "complete" }
```

### Phase 8 — Approve (BOSS only)

`BOSS prd approve` after validation passes.

## Handoff to develop

```text
Use BOSS to deliver "<slug>"
Read: dev-docs.md, ux-spec.md, designs/*.html
Implement React/components from HTML designs. Follow workflows for business logic.
```

## Do Not

- Skip workflows or UX before HTML designs
- Approve without `--pipeline` validation
- Implement in PRD (belongs in dev-docs)
- Ship HTML designs without ux-spec traceability

## Related

- [prds README](../../team/prds/README.md)
- [BOSS skill](../boss/SKILL.md)
