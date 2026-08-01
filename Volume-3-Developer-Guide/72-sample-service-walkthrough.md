# Sample Service Walkthrough

> **Volume:** 3 | **Chapter ID:** v3-72 | **Status:** reviewed

## What You Will Accomplish

You will walk through the complete catalog service implementation from entity to API to deployment.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- All prior Volume 3 create guides reviewed

## Steps

### Step 1: Review service structure

### Step 2: Trace a create request end-to-end

HTTP → controller → service → domain → repository → DB → event.

### Step 3: Trace a list request with pagination

### Step 4: Deploy to local docker compose and verify

**Expected result:** Full understanding of service lifecycle.

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

- [Previous: Reference Implementation Overview](71-reference-implementation-overview.md)
- [Next: Anti Patterns Catalog](73-anti-patterns-catalog.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
