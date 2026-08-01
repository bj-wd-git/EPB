# How to Integrate Roster

> **Volume:** 3 | **Chapter ID:** v3-52 | **Status:** reviewed

## What You Will Accomplish

You will integrate roster-based assignee resolution for workflow and notification recipients.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Roster Platform available

## Steps

### Step 1: Query roster for role members

### Step 2: Resolve assignees dynamically

### Step 3: Handle empty roster gracefully

### Step 4: Cache roster lookups with short TTL

**Expected result:** Assignees resolved from live roster data.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Config not loaded | Wrong env file | Check .env and env var names |
| Service won't start | Missing dependency | Verify docker compose services running |
| 500 on startup | Invalid config value | Check logs for validation errors |

## Reference

- [Coding Standards](../Volume-1-Foundation/25-coding-standards.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)

## Related Chapters

- [Previous: Rule Engine Integration](51-rule-engine-integration.md)
- [Next: Template Engine Usage](53-template-engine-usage.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
