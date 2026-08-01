# How to Integrate Search

> **Volume:** 3 | **Chapter ID:** v3-38 | **Status:** reviewed

## What You Will Accomplish

You will index catalog resources in the Search Platform for full-text search.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Search Platform running

## Steps

### Step 1: Publish search index events

On create/update/archive, publish index update event.

### Step 2: Configure index mapping

Fields: name (text), description (text), status (keyword), tenantId (keyword).

### Step 3: Implement search endpoint

`GET /catalog/v1/resources/search?q=term` — delegates to Search Platform.

### Step 4: Verify index consistency

Compare DB count with search index document count.

**Expected result:** Search returns relevant resources within 2 seconds.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Index updated within 5s of mutation
- [ ] Tenant isolation in search results

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

- [Previous: Export Data Guide](37-export-data-guide.md)
- [Next: Audit Integration](39-audit-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
