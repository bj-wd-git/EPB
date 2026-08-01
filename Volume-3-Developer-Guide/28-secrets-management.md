# Secrets Management

> **Volume:** 3 | **Chapter ID:** v3-28 | **Status:** reviewed

## What You Will Accomplish

You will integrate the catalog service with the secrets manager — loading database credentials and API keys at runtime without hardcoding.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Secrets manager available in target environment

## Steps

### Step 1: Define secret references in config

```bash
DATABASE_URL=secret://catalog/database-url
API_KEY=secret://catalog/external-api-key
```

### Step 2: Implement secret resolver

Resolve `secret://` prefix at startup via vault client.

### Step 3: Rotate secrets

Document rotation procedure: update vault → restart service (or use dynamic reload).

### Step 4: Verify no secrets in logs or images

```bash
grep -r "password\|secret\|api_key" services/application/catalog/src/ --include="*.ts"
```

**Expected result:** Zero hardcoded secrets; service reads from vault.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Secrets injected at runtime
- [ ] Secret scan passes in CI

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

- [Previous: Environment Configuration](27-environment-configuration.md)
- [Next: Database Migrations](29-database-migrations.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
