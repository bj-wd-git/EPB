# Naming Standards Reference

> **Volume:** 3 | **Chapter ID:** v3-23 | **Status:** reviewed

## What You Will Accomplish

You will apply correct naming conventions for services, APIs, DTOs, entities, and events.

## Prerequisites

- [Naming Conventions](../Volume-1-Foundation/24-naming-conventions.md) reviewed

## Steps

### Step 1: Service naming

lowercase, hyphen-separated: `catalog`

### Step 2: API paths

`/{service}/v{version}/{resources}` — plural nouns, camelCase params

### Step 3: Code artifacts

| Type | Pattern | Example |
|------|---------|--------|
| Request DTO | {Action}{Resource}Request | CreateResourceRequest |
| Entity | {Resource}Entity | ResourceEntity |
| Event | {service}.{entity}.{action} | catalog.resource.created |

### Step 4: Config keys

`{SERVICE}_{KEY}` uppercase: CATALOG_DB_URL

## Verification

- [ ] All artifacts follow naming table
- [ ] Linter naming rules pass

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Validation errors on API | Request DTO mismatch | Check mapper and DTO definitions |
| Missing tenant context | Auth middleware not applied | Verify BFF passes `X-Tenant-Id` header |
| Test failures on DB | Migration not applied | Run migrations per [Database Migrations](29-database-migrations.md) |
| 403 Forbidden | Missing permission | Check authorization policy and role assignment |

## Reference

- [Naming Conventions](../Volume-1-Foundation/24-naming-conventions.md)

## Related Chapters

- [Previous: Code Review Checklist](22-code-review-checklist.md)
- [Next: Git Workflow](24-git-workflow.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
