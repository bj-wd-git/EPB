---
name: prd-developer
description: >-
  Full-level PRD authoring and dev-docs generation for BOSS delivery. Use when
  creating product requirements, PRDs, development handoff docs, or when the user
  mentions PRD, requirements doc, or BOSS prd command.
---

# PRD Developer Skill

Produce **enterprise-grade PRDs** and **development-ready docs** that BOSS `deliver` consumes.

## When to Use

- User says `BOSS prd <feature>` or asks for a PRD
- Before `BOSS deliver` on a new feature (recommended)
- EPB platform features needing epb-vision alignment
- Handoff from product idea to engineering

## Read First

1. [PRD template](../../team/prds/PRD-TEMPLATE.md)
2. [Dev-docs template](../../team/prds/DEV-DOCS-TEMPLATE.md)
3. `.cursor/skills/epb-vision/SKILL.md` — when EPB platform work
4. `.cursor/skills/sdlc-roles/product-manager.md` — goals, acceptance criteria
5. `.cursor/skills/sdlc-roles/business-analyst.md` — user stories, FRD
6. `.cursor/skills/sdlc-roles/solution-architect.md` — API outline, ADRs

## Workflow: BOSS prd

### Phase 1 — Discover

1. Parse user brief → feature slug
2. Read epb-vision / project-vision as applicable
3. Use gbrain MCP for handbook/ADR refs (EPB repo)
4. Use explore specialist if codebase context needed

### Phase 2 — Author PRD

1. Create `.cursor/team/prds/<slug>/`
2. Write `PRD.md` from PRD-TEMPLATE.md — **all 17 sections**
3. Write `prd-meta.json` with `status: draft`
4. Minimum completeness:
   - ≥1 user story with acceptance criteria
   - ≥3 functional requirements
   - NFRs for security + performance
   - EPB platform mapping (if EPB repo)
   - Open questions listed explicitly

### Phase 3 — Generate dev-docs

1. Write `dev-docs.md` from DEV-DOCS-TEMPLATE.md
2. Include:
   - Ordered task breakdown with role assignments
   - API contracts (request/response JSON)
   - Test plan with IDs
   - BOSS delivery config (mode, roles, MCPs)
   - Copy acceptance criteria from PRD
3. Set `dev-docs` meta → `Ready for BOSS` when PRD sections complete

### Phase 4 — Review & approve

1. Run `node scripts/validate-prd.js --feature <slug>`
2. On user `BOSS prd approve <slug>`: set `prd-meta.json` → `status: approved`
3. Register in `.cursor/team/registry.json` under `prds` array

## Output Paths

| File | Purpose |
|------|---------|
| `prds/<slug>/PRD.md` | Full PRD for stakeholders |
| `prds/<slug>/dev-docs.md` | BOSS development handoff |
| `prds/<slug>/prd-meta.json` | Status, version, links |

## PRD Quality Bar (full level)

| Section | Required | Quality check |
|---------|----------|---------------|
| Executive summary | yes | ≤ 150 words, clear outcome |
| User stories | yes | As/I want/So that + testable AC |
| Functional reqs | yes | IDs, priority Must/Should/Could |
| NFRs | yes | Security minimum |
| API outline | yes if API feature | Method + path |
| EPB mapping | yes in EPB repo | Platform vs app boundary |
| Dev-docs tasks | yes | Role per task, dependencies |
| Test plan | yes | Unit + integration minimum |

## Handoff to BOSS deliver

When approved:

```text
Use BOSS to deliver "<slug>"
Read .cursor/team/prds/<slug>/dev-docs.md as source of truth.
Execute tasks T-001… in order. Use dev-docs BOSS config for mode and roles.
```

BOSS deliver **must** read dev-docs before composing team if file exists.

## MCP Usage

| MCP | When |
|-----|------|
| gbrain | Handbook chapters, ADRs, platform services |
| github | Existing issues, related PRs |
| linear | Backlog linkage |

## Do Not

- Skip dev-docs — PRD without dev-docs is incomplete for BOSS
- Mark approved without validation passing
- Put domain-specific terms in platform sections (use epb-vision neutrality rules)
- Duplicate implementation detail in PRD — keep detail in dev-docs

## Related

- [prds README](../../team/prds/README.md)
- [BOSS skill](../boss/SKILL.md)
- [validate-prd.js](../../../scripts/validate-prd.js)
