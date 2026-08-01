# API Versioning

> **Volume:** 3 | **Chapter ID:** v3-30 | **Status:** reviewed

## What You Will Accomplish

You will introduce a v2 API for resources with breaking changes while maintaining v1 for existing consumers.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [API First Design](../Volume-1-Foundation/37-api-first-design.md) reviewed

## Steps

### Step 1: Document breaking changes

List fields removed/renamed in v2 OpenAPI spec.

### Step 2: Implement v2 routes

`/catalog/v2/resources` — new response shape.

### Step 3: Run v1 and v2 concurrently

Both versions active; route by URL path.

### Step 4: Add deprecation header to v1

`Sunset: 2027-02-01` on v1 responses.

### Step 5: Notify consumers

Document migration guide in CHANGELOG.

**Expected result:** v1 and v2 both respond; v1 marked deprecated.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Contract tests for both versions
- [ ] Deprecation timeline documented

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

- [Previous: Database Migrations](29-database-migrations.md)
- [Next: Event Publishing Guide](31-event-publishing-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
