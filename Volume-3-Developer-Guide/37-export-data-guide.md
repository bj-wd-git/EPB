# Export Data Guide

> **Volume:** 3 | **Chapter ID:** v3-37 | **Status:** reviewed

## What You Will Accomplish

You will implement CSV and Excel export for resource lists with filtering support.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Add export endpoint

`GET /catalog/v1/resources/export?format=csv&filter=status eq ACTIVE`

### Step 2: Stream response for large datasets

Don't load all rows in memory; cursor-based streaming.

### Step 3: Set content headers

`Content-Type: text/csv`, `Content-Disposition: attachment`

### Step 4: Apply same filters as list endpoint

Export respects tenant isolation and authorization.

**Expected result:** Filtered CSV download with all matching resources.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Export handles 10k+ rows
- [ ] Filters match list endpoint behavior

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

- [Previous: Import Data Guide](36-import-data-guide.md)
- [Next: Search Integration](38-search-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
