# Environment Configuration

> **Volume:** 3 | **Chapter ID:** v3-27 | **Status:** reviewed

## What You Will Accomplish

You will configure environment-specific settings for the catalog service using EPB configuration hierarchy — local .env, staging secrets, and production config service.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Configuration Management](../Volume-1-Foundation/22-configuration-management.md) reviewed

## Steps

### Step 1: Create .env.example

```bash
SERVICE_NAME=catalog
SERVICE_PORT=8085
DATABASE_URL=postgresql://epb:epb@localhost:5432/catalog_dev
LOG_LEVEL=debug
CACHE_TTL_SECONDS=60
```

### Step 2: Load config at startup

Validate required keys; fail fast on missing values.

### Step 3: Environment-specific overrides

| Key | Local | Staging | Production |
|-----|-------|---------|------------|
| LOG_LEVEL | debug | info | warn |
| CACHE_TTL | 60 | 300 | 600 |

### Step 4: Register with Configuration Platform for tenant overrides

**Expected result:** Service starts in each environment with correct config.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] .env.example documents all keys
- [ ] No secrets in source control

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

- [Previous: Production Readiness](26-production-readiness.md)
- [Next: Secrets Management](28-secrets-management.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
