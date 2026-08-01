---
name: prd-developer
description: >-
  Enterprise PRD authoring, requirements traceability, and dev-docs generation for
  BOSS delivery. Use for BOSS prd, product requirements, FRD, dev handoff docs, or
  when the user mentions PRD, requirements, or specification before development.
---

# PRD Developer Skill

Produce **enterprise-grade PRDs** and **development-ready docs** that BOSS `deliver` consumes without ambiguity.

## Mandatory Reading

1. [reference.md](reference.md) — quality rubric, INVEST, traceability, anti-patterns
2. [PRD template](../../team/prds/PRD-TEMPLATE.md)
3. [Dev-docs template](../../team/prds/DEV-DOCS-TEMPLATE.md)
4. `.cursor/skills/epb-vision/SKILL.md` — EPB platform work
5. Role playbooks: product-manager, business-analyst, solution-architect

## Quality Standard

**Minimum score 85/100** before `BOSS prd approve`. Run:

```bash
node scripts/validate-prd.js --feature <slug> --score
```

Never approve with score &lt; 85 or validation errors.

## Workflow: BOSS prd

### Phase 0 — Clarify (mandatory)

Answer discovery questions (see reference.md). If brief is thin:

- State assumptions in PRD §4
- Add open questions §16
- Do **not** block — proceed with labeled assumptions

### Phase 1 — Discover (parallel when BOSS allows)

| Source | Method | Feeds |
|--------|--------|-------|
| Handbook / ADRs | gbrain MCP | §14 EPB mapping |
| Codebase | explore specialist | §2 current state |
| Goals / metrics | product-manager subagent | §3, §4 |
| Stories / FR | business-analyst subagent | §6, §7 |
| API / architecture | solution-architect subagent | §11, §14 |

Max 4 parallel subagents. **Synthesize** into one voice.

### Phase 2 — Author PRD (17 sections + traceability)

Path: `.cursor/team/prds/<slug>/PRD.md`

**Minimums:**

| Item | Minimum |
|------|---------|
| User stories | 2 (US-001, US-002…) |
| Acceptance criteria | 3+ checkboxes, testable |
| Functional reqs | 3+ with FR-###, MoSCoW priority |
| NFRs | Security + performance or availability |
| API outline | If any API — method + path per endpoint |
| EPB mapping | Required in EPB repo |
| Risks | ≥1 row |
| Open questions | ≥1 or explicit "none" |

Write `prd-meta.json` → `status: draft`

### Phase 3 — Generate dev-docs (BOSS handoff)

Path: `.cursor/team/prds/<slug>/dev-docs.md`

**Minimums:**

| Item | Minimum |
|------|---------|
| Tasks | 3+ (T-001…) with role + depends |
| API contracts | Full JSON request/response per endpoint |
| Test plan | 2+ (TP-001…) mapped to AC |
| Traceability matrix | US → FR → T → TP → AC |
| BOSS config | mode, roles, MCPs, skills |
| Handoff | `BOSS deliver` command block |

Meta status: **Ready for BOSS**

### Phase 4 — Self-review

Check against [reference.md](reference.md) anti-patterns table. Fix before validation.

### Phase 5 — Validate & register

```bash
node scripts/validate-prd.js --feature <slug> --score
```

Update `prd-meta.json` with `qualityScore` and `traceability` counts. Register in `registry.json` → `prds`.

### Phase 6 — Approve (BOSS prd approve only)

Set `status: approved`, `approved: <ISO date>`. Require score ≥ 85.

## Output to BOSS

```markdown
## PRD Developer Summary
- **Slug:** <slug>
- **Status:** draft | approved
- **Quality score:** NN/100
- **User stories:** N | **FRs:** N | **Tasks:** N | **Tests:** N
- **Validation:** PASS | FAIL
- **Files:** PRD.md, dev-docs.md, prd-meta.json
- **Open questions:** N (list blockers if any)
- **Next:** BOSS prd approve <slug> | BOSS deliver <slug>
```

## Handoff to BOSS deliver

```text
Use BOSS to deliver "<slug>"
Source of truth: .cursor/team/prds/<slug>/dev-docs.md
Execute tasks in order. Enforce traceability matrix. Mode from BOSS Delivery Config.
```

## Do Not

- Ship PRD without dev-docs
- Use untestable acceptance criteria
- Skip traceability matrix
- Approve below quality threshold
- Put implementation detail in PRD (belongs in dev-docs)
- Use industry-specific terms in platform sections

## Related

- [prds README](../../team/prds/README.md)
- [BOSS skill](../boss/SKILL.md)
- [validate-prd.js](../../../scripts/validate-prd.js)
