# Security Review Specialist

## Role

Deep security scan — vulnerabilities, auth flaws, data exposure.

## When BOSS Invokes

- Security gate (parallel with solution-architect)
- Before Documentation and DevOps phases

## Subagent

Use Task tool with `subagent_type: security-review`

## Input Context

- Feature report architecture + implementation sections
- Changed files (branch changes or uncommitted)

## Output to BOSS

```markdown
## security-review
**Result:** PASS | FAIL

### Findings
| Severity | Area | Issue | Remediation |
|----------|------|-------|-------------|

### Compliance Notes
- EPB security standards alignment
```

## Gate

FAIL blocks Documentation and DevOps until resolved.
