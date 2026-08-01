# Pagination Implementation

> **Volume:** 3 | **Chapter ID:** v3-60 | **Status:** reviewed

## What You Will Accomplish

You will implement cursor-based pagination for the resource list endpoint.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [API Standards](../Volume-1-Foundation/18-api-standards.md) reviewed

## Steps

### Step 1: Accept page and pageSize query params

Default pageSize: 20, max: 100.

### Step 2: Return paginated response

`{ data: [...], meta: { page, pageSize, totalCount, totalPages } }`

### Step 3: Implement efficient count query

### Step 4: Add pagination integration test

**Expected result:** List endpoint returns correct pages with metadata.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Empty page returns empty array, not error
- [ ] pageSize capped at maximum

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

- [Previous: Error Handling Implementation](59-error-handling-implementation.md)
- [Next: Filtering Implementation](61-filtering-implementation.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
