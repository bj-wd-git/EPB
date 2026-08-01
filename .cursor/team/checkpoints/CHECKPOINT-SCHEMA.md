# BOSS Checkpoint Schema

Checkpoints enable multi-session and unattended delivery. BOSS updates after each phase.

**Path:** `.cursor/team/checkpoints/<feature-slug>.json`

## Schema

```json
{
  "slug": "notification-retry",
  "mode": "fix | standard | full",
  "phase": 6,
  "phaseName": "code-review",
  "status": "in_progress | complete | blocked",
  "blockedOn": null,
  "blockedReason": null,
  "lastUpdated": "2026-08-01T12:00:00.000Z",
  "lastCommit": "abc1234",
  "phasesCompleted": ["product-manager", "business-analyst"],
  "phasesRemaining": ["qa-engineer", "documentation-versioning"],
  "report": ".cursor/team/reports/notification-retry.md",
  "unattended": false
}
```

## Fields

| Field | Description |
|-------|-------------|
| `mode` | Delivery tier: fix, standard, or full |
| `phase` | Current phase index (1-based) |
| `phaseName` | Current role or specialist id |
| `status` | `in_progress`, `complete`, or `blocked` |
| `blockedOn` | Gate or dependency blocking progress; null if none |
| `unattended` | If true, BOSS must not ask user unless blocked |

## BOSS continue

1. Read checkpoint for slug
2. If `status: blocked`, report blocker and stop
3. Resume from `phasesRemaining[0]` or `phase + 1`
4. Update checkpoint after each phase
5. Commit checkpoint + report when `unattended: true`

## Example

See [_example/notification-retry.json](_example/notification-retry.json)
