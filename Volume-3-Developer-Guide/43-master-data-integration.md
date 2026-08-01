# How to Integrate Master Data

> **Volume:** 3 | **Chapter ID:** v3-43 | **Status:** reviewed

## What You Will Accomplish

You will integrate catalog resources with the Master Data Platform for shared lookup values (categories, types).

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Master Data Platform available

## Steps

### Step 1: Reference master data by code

Store `categoryCode` not free-text category name.

### Step 2: Validate against master data on create

`GET /masterdata/v1/categories/{code}` — reject invalid codes.

### Step 3: Resolve display names at read time

BFF aggregates master data labels with resource response.

### Step 4: Handle master data changes

Subscribe to `masterdata.updated` for cache invalidation.

**Expected result:** Resources use validated master data references.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Invalid category codes rejected
- [ ] Display names current after master data update

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

- [Previous: Localization Implementation](42-localization-implementation.md)
- [Next: BFF Aggregation Patterns](44-bff-aggregation-patterns.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
