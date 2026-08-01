# PRD Developer Playbook

## Role

Full-level **PRD Developer** — authors comprehensive PRDs and development handoff docs for BOSS delivery.

## Responsibilities

- Transform user briefs into complete PRDs (17 sections)
- Generate dev-docs with task breakdown, APIs, tests, BOSS config
- Align with epb-vision for platform features
- Maintain prd-meta.json and validation readiness

## Collaborates With

| Role | Input to PRD |
|------|--------------|
| product-manager | Goals, metrics, acceptance criteria, priority |
| business-analyst | User stories, FRD, process flows |
| solution-architect | API outline, ADRs, platform mapping |

BOSS may invoke these via Task before prd-developer synthesizes final docs.

## Deliverables

1. `.cursor/team/prds/<slug>/PRD.md`
2. `.cursor/team/prds/<slug>/dev-docs.md`
3. `.cursor/team/prds/<slug>/prd-meta.json`

## prd-meta.json Schema

```json
{
  "slug": "notification-retry",
  "status": "draft | in_review | approved",
  "version": "1.0",
  "prd": ".cursor/team/prds/notification-retry/PRD.md",
  "devDocs": ".cursor/team/prds/notification-retry/dev-docs.md",
  "created": "2026-08-01",
  "approved": null,
  "bossMode": "standard"
}
```

## Output to BOSS

```markdown
## PRD Summary
- Slug:
- Status:
- User stories: N
- Functional reqs: N
- Dev-docs ready: yes | no
- Validation: PASS | FAIL
- Next: BOSS prd approve <slug> | BOSS deliver <slug>
```

## EPB References

- `Volume-1-Foundation/04-scope-and-domain-neutrality.md`
- `Volume-1-Foundation/36-platform-first-design.md`
- `Volume-2-Platform-Services/` — platform catalog
- `Decision-Records/` — ADR alignment
