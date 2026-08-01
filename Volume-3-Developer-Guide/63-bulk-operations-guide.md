# Bulk Operations Guide

> **Volume:** 3 | **Chapter ID:** v3-63 | **Status:** reviewed

## What You Will Accomplish

You will implement bulk create, update, and delete operations for resources.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Define bulk request DTO

`{ resources: [{ name, status }, ...] }` — max 100 per request.

### Step 2: Process in transaction with per-item results

### Step 3: Return partial success response

`{ succeeded: 95, failed: 5, errors: [...] }`

### Step 4: Emit single audit event for bulk operation

**Expected result:** Bulk operations process efficiently with error details.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Max batch size enforced
- [ ] Partial failures do not roll back successes

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

- [Previous: Sorting Implementation](62-sorting-implementation.md)
- [Next: Global Search Implementation](64-global-search-implementation.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
