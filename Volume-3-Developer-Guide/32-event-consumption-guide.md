# Event Consumption Guide

> **Volume:** 3 | **Chapter ID:** v3-32 | **Status:** reviewed

## What You Will Accomplish

You will consume tenant provisioning events to initialize catalog data for new tenants.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Event Publishing Guide](31-event-publishing-guide.md) completed

## Steps

### Step 1: Register event handler

Subscribe to `tenant.provisioned` event.

### Step 2: Implement idempotent handler

Check if tenant data already exists before seeding.

### Step 3: Seed default resources

Create default configuration entries for new tenant.

### Step 4: Handle failures with retry

Dead letter queue for events that fail after max retries.

**Expected result:** New tenant gets default catalog data automatically.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Handler is idempotent
- [ ] DLQ configured for failures

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

- [Previous: Event Publishing Guide](31-event-publishing-guide.md)
- [Next: Caching Patterns](33-caching-patterns.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
