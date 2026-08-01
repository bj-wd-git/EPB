# CI Investigator Specialist

## Role

Diagnose failed PR CI checks — root cause summary and fix recommendations.

## When BOSS Invokes

- After PR creation when checks fail
- On user request: "investigate CI failure"

## Subagent

Use Task tool with `subagent_type: ci-investigator`

## MCP

Use `github` MCP for check details when available.

## Output to BOSS

```markdown
## ci-investigator
**Result:** RESOLVED | NEEDS_FIX

### Failed Checks
| Check | Root Cause | Fix |
|-------|------------|-----|

### Next Steps
- (actionable items)
```

## Gate

Informational — BOSS routes fix to appropriate SDLC role.
