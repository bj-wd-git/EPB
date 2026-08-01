# BOSS Gate Artifacts

Machine-checkable evidence for quality gates. **Reports must not claim PASS without a matching artifact.**

**Path:** `.cursor/team/gates/<feature-slug>/<gate>.json`

## Gate Files

| File | Gate | Required for mode |
|------|------|-------------------|
| `validation.json` | Fast fix validation | fix |
| `code-review.json` | Architect code review | standard, full |
| `bugbot.json` | Bugbot review | standard, full |
| `qa.json` | QA / tests | standard, full |
| `uat.json` | UAT sign-off | standard, full |
| `security-review.json` | Security scan | full |

## Artifact Schema

```json
{
  "gate": "qa",
  "result": "PASS",
  "timestamp": "2026-08-01T12:00:00.000Z",
  "runner": "qa-engineer",
  "evidence": ["scripts/check-links.js"],
  "summary": "0 broken links",
  "findings": []
}
```

| Field | Required | Values |
|-------|----------|--------|
| `gate` | yes | Gate id |
| `result` | yes | `PASS` or `FAIL` |
| `timestamp` | yes | ISO 8601 |
| `runner` | yes | Agent or script name |
| `evidence` | yes | Array of file paths or commands |
| `summary` | yes | One-line description |
| `findings` | no | Array of issues (empty on PASS) |

## Validation

```bash
node scripts/validate-boss-gates.js --feature notification-retry
node scripts/validate-boss-gates.js --all
```

CI runs this on pull requests via `.github/workflows/boss-gates.yml`.

## Example

See [_example/notification-retry/](_example/notification-retry/)
