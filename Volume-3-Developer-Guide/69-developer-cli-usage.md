# Developer CLI Usage

> **Volume:** 3 | **Chapter ID:** v3-69 | **Status:** reviewed

## What You Will Accomplish

You will use the EPB developer CLI to scaffold a new API endpoint with DTOs, controller, and tests.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- EPB CLI installed: npm install -g @epb/cli

## Steps

### Step 1: Generate API scaffold

```bash
epb generate api --service catalog --name archive-resource --method POST
```

### Step 2: Review generated files

Controller, DTO, route, test stub.

### Step 3: Implement business logic

### Step 4: Run generated tests

**Expected result:** Endpoint scaffolded and functional.

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

- [Previous: Dynamic Forms Guide](68-dynamic-forms-guide.md)
- [Next: Code Generator Usage](70-code-generator-usage.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
