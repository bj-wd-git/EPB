# Template Engine Usage

> **Volume:** 3 | **Chapter ID:** v3-53 | **Status:** reviewed

## What You Will Accomplish

You will create email notification templates using the Template Engine for resource events.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Template Engine available

## Steps

### Step 1: Create template with variables

`{{resourceName}}`, `{{actorName}}`, `{{actionDate}}`

### Step 2: Register template

### Step 3: Render template with event data

### Step 4: Preview template in staging

**Expected result:** Rendered emails match template design.

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

- [Previous: Roster Integration](52-roster-integration.md)
- [Next: Document Generation Guide](54-document-generation-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
