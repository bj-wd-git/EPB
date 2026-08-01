# Database Migrations

> **Volume:** 3 | **Chapter ID:** v3-29 | **Status:** reviewed

## What You Will Accomplish

You will create and apply a database migration adding a status column to the resources table with rollback support.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Database created for catalog service

## Steps

### Step 1: Generate migration

```bash
cd services/application/catalog
npm run migration:generate -- add-status-to-resources
```

### Step 2: Write migration

```sql
-- UP
ALTER TABLE resources ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'DRAFT';
CREATE INDEX idx_resources_status ON resources(tenant_id, status);

-- DOWN
DROP INDEX idx_resources_status;
ALTER TABLE resources DROP COLUMN status;
```

### Step 3: Apply migration

```bash
npm run migration:run
```

### Step 4: Update entity and domain model

Add status field; map in repository.

**Expected result:** Migration applied; entity reflects new column.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Rollback tested
- [ ] Migration runs in CI before deploy

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

- [Previous: Secrets Management](28-secrets-management.md)
- [Next: API Versioning](30-api-versioning.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
