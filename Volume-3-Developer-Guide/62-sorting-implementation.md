# Sorting Implementation

> **Volume:** 3 | **Chapter ID:** v3-62 | **Status:** reviewed

## What You Will Accomplish

You will implement multi-field sorting on the resource list endpoint.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Accept sort query parameter

`?sort=createdAt:desc,name:asc`

### Step 2: Whitelist sortable fields

### Step 3: Apply to database query with index support

### Step 4: Default sort: createdAt desc

**Expected result:** List returns resources in requested order.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Invalid sort fields rejected
- [ ] Sort combined with filter and pagination

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

- [Previous: Filtering Implementation](61-filtering-implementation.md)
- [Next: Bulk Operations Guide](63-bulk-operations-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
