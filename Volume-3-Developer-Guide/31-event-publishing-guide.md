# Event Publishing Guide

> **Volume:** 3 | **Chapter ID:** v3-31 | **Status:** reviewed

## What You Will Accomplish

You will publish domain events from the catalog service when resources are created, updated, and archived.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Message broker running

## Steps

### Step 1: Define event schemas

`catalog.resource.created`, `catalog.resource.updated`, `catalog.resource.archived`

### Step 2: Implement event publisher

Use shared library event client; include correlationId, tenantId, timestamp.

### Step 3: Publish after successful persistence

Event published AFTER database commit (outbox pattern recommended).

### Step 4: Verify in broker admin

```bash
# Check message in queue/exchange
docker exec rabbitmq rabbitmqctl list_queues
```

**Expected result:** Events visible in broker after mutations.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Events include correlation ID
- [ ] Published after DB commit

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

- [Previous: API Versioning](30-api-versioning.md)
- [Next: Event Consumption Guide](32-event-consumption-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
