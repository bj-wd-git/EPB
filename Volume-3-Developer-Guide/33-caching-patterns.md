# Caching Patterns

> **Volume:** 3 | **Chapter ID:** v3-33 | **Status:** reviewed

## What You Will Accomplish

You will implement read-through caching for resource lookups using Redis with cache invalidation on mutations.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Redis running locally

## Steps

### Step 1: Configure Redis connection

`REDIS_URL=redis://localhost:6379/5`

### Step 2: Cache resource by ID

Key: `catalog:resource:{tenantId}:{id}`, TTL: 300s.

### Step 3: Invalidate on update/delete

Delete cache key in same transaction as DB update.

### Step 4: Monitor cache metrics

Track hit rate, miss rate, eviction count.

**Expected result:** Second lookup served from cache; mutations invalidate.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Cache hit rate > 70% under load
- [ ] No stale data after mutation

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

- [Previous: Event Consumption Guide](32-event-consumption-guide.md)
- [Next: Queue Processing Guide](34-queue-processing-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
