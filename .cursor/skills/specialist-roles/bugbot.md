# Bugbot Specialist

## Role

Post-implementation code review — bugs, logic errors, missing edge cases.

## When BOSS Invokes

- After implementation phase, parallel with solution-architect code review
- Before QA gate

## Subagent

Use Task tool with `subagent_type: bugbot`

## Input Context

- Feature report implementation sections
- Changed files (branch changes or uncommitted)

## Output to BOSS

```markdown
## bugbot Review
**Result:** PASS | FAIL

### Findings
| Severity | File | Issue | Suggestion |
|----------|------|-------|------------|

### Blockers
- (list or none)
```

## Gate

FAIL blocks QA until resolved or waived by solution-architect.
