# How to Integrate Logging

> **Volume:** 3 | **Chapter ID:** v3-40 | **Status:** reviewed

## What You Will Accomplish

You will integrate structured logging with correlation IDs across the catalog service.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Logging Standards](../Volume-1-Foundation/20-logging-standards.md) reviewed

## Steps

### Step 1: Configure structured JSON logging

Use shared logging library from libs/logging.

### Step 2: Extract correlation ID from request header

`X-Correlation-Id` — generate if missing.

### Step 3: Include standard fields

service, tenantId, correlationId, level, message.

### Step 4: Log at service boundaries

Request received, response sent, errors — not every helper call.

**Expected result:** JSON logs with correlation ID traceable across services.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] No PII in logs
- [ ] Correlation ID on every log entry

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

- [Previous: Audit Integration](39-audit-integration.md)
- [Next: Feature Flag Usage](41-feature-flag-usage.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
