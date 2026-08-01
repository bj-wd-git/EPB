# PRD Developer Reference

Deep reference for enterprise PRD + dev-docs quality. Used by prd-developer agent and `validate-prd.js`.

## Quality Rubric (min 85/100 to approve)

| Criterion | Points | Pass condition |
|-----------|--------|----------------|
| PRD sections complete | 20 | All 17 sections present |
| User stories | 15 | ≥2 stories, INVEST, testable AC |
| Functional requirements | 15 | ≥3 FR-* with Must/Should/Could |
| NFRs | 10 | Security + one other category filled |
| EPB platform mapping | 10 | Table with reuse/build decision (EPB repo) |
| Dev-docs complete | 15 | All required sections |
| Task breakdown | 10 | ≥3 tasks, role per task, dependencies |
| Test plan | 10 | ≥2 TP-* linked to acceptance criteria |
| Traceability | 5 | Matrix links US → FR → T → TP → AC |

Run: `node scripts/validate-prd.js --feature <slug> --score`

## INVEST User Stories

| Letter | Meaning | Check |
|--------|---------|-------|
| I | Independent | Story deliverable alone |
| N | Negotiable | Not over-specified |
| V | Valuable | Clear user benefit |
| E | Estimable | BOSS can size tasks |
| S | Small | Fits one sprint slice |
| T | Testable | AC are pass/fail |

**Format:**

```markdown
### US-001: Title
**As a** <persona>
**I want** <capability>
**So that** <benefit>
**Acceptance criteria:**
- [ ] AC-001: ...
```

## MoSCoW Priority

| Priority | Use when |
|----------|----------|
| Must | Launch blocker |
| Should | Important, not blocking |
| Could | Nice to have |
| Won't | Explicitly deferred |

## Requirements IDs

| Type | Pattern | Example |
|------|---------|---------|
| User story | US-### | US-001 |
| Acceptance | AC-### | AC-001 |
| Functional | FR-### | FR-001 |
| Task | T-### | T-001 |
| Test | TP-### | TP-001 |
| Open question | OQ-### | OQ-001 |

## Traceability Matrix (required in dev-docs)

| US | FR | Task | Test | AC |
|----|----|------|------|-----|
| US-001 | FR-001, FR-002 | T-002 | TP-001 | AC-001, AC-002 |

Every **Must** FR must trace to ≥1 task and ≥1 test.

## API Contract Standard (dev-docs)

Each endpoint must include:

- Method + path
- Auth requirement
- Request JSON schema (example)
- Response JSON schema (example)
- Error codes table (400, 401, 403, 404, 409, 500)

Follow EPB: BFF entry, response DTOs, no entity leakage (ADR-002).

## EPB Neutrality Checklist

Before finalizing PRD section 14:

1. Would this capability work for hospital **and** bank **and** school?
2. Are platform nouns generic (tenant, resource, party)?
3. Are industry terms only in application layer?
4. Platform First — reusing catalog vs building new?

## PRD vs Dev-docs Split

| Content | PRD | Dev-docs |
|---------|-----|----------|
| Why / goals / personas | yes | summary only |
| User stories | yes | AC copy |
| FR / NFR | yes | reference |
| API JSON schemas | outline | full contracts |
| Task breakdown | no | yes |
| BOSS config | no | yes |
| Test cases | high level | TP-* detail |

## Discovery Protocol (Phase 0)

Before writing, prd-developer must answer:

1. Who is the primary user?
2. What is the smallest shippable slice?
3. Platform or application feature?
4. What exists today (codebase/handbook)?
5. What is explicitly out of scope?

If brief is vague, document assumptions in PRD §4 and open questions §16.

## Parallel Discovery (BOSS invokes)

| Subagent | Output used in |
|----------|----------------|
| product-manager | §3 Goals, §4 Scope, §17 Approval criteria |
| business-analyst | §6 User stories, §7 FR |
| solution-architect | §11 API outline, §14 EPB mapping |
| explore | §2 Problem (current state) |
| gbrain MCP | §14 handbook refs, ADR links |

Synthesize — do not paste raw subagent output.

## Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| Vague AC ("works well") | Measurable pass/fail criteria |
| Missing out of scope | Explicit §4 out of scope |
| Implementation in PRD | Move to dev-docs |
| No test plan | Add TP-* per Must FR |
| Orphan tasks | Every T-* maps to FR |
| Domain in platform | Generic platform primitive |
| PRD without dev-docs | Always pair both |
| Approve without validate | Run validate-prd.js |

## prd-meta.json (extended)

```json
{
  "slug": "feature-slug",
  "status": "draft | in_review | approved",
  "version": "1.0",
  "qualityScore": 92,
  "prd": ".cursor/team/prds/feature-slug/PRD.md",
  "devDocs": ".cursor/team/prds/feature-slug/dev-docs.md",
  "created": "2026-08-01",
  "approved": null,
  "bossMode": "standard | full",
  "traceability": {
    "userStories": 2,
    "functionalReqs": 5,
    "tasks": 5,
    "testCases": 3
  }
}
```

## Approval Gate

`BOSS prd approve` requires:

1. `validate-prd.js` exit 0
2. `qualityScore` ≥ 85
3. No open **Must** blockers in OQ table (or documented waiver)
4. dev-docs status: `Ready for BOSS`

## Related

- [SKILL.md](SKILL.md)
- [PRD template](../../team/prds/PRD-TEMPLATE.md)
- [Dev-docs template](../../team/prds/DEV-DOCS-TEMPLATE.md)
