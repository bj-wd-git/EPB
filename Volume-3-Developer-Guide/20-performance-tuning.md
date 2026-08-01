# Performance Tuning Guide

> **Volume:** 3 | **Chapter ID:** v3-20 | **Status:** reviewed

## What You Will Accomplish

You will profile and optimize a slow catalog API endpoint — identifying N+1 queries, missing indexes, and cache opportunities to meet the 500ms p99 latency target.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Monitoring and Observability](../Volume-1-Foundation/33-monitoring-observability.md) reviewed

## Steps

### Step 1: Establish baseline metrics

Run load test and record p50, p95, p99. Target: p99 < 500ms.

### Step 2: Enable query logging

Set LOG_LEVEL=debug. Count SQL queries per request — N+1 shows 1+N queries.

### Step 3: Fix N+1 with eager loading

Replace loop queries with single join query in repository.

### Step 4: Add database index

```sql
CREATE INDEX idx_resources_tenant_status ON resources(tenant_id, status);
```

### Step 5: Add caching for read-heavy endpoints

Use @Cacheable with 60s TTL for stats endpoints.

**Expected result:** p99 drops below 500ms.

## Verification

- [ ] p99 latency under 500ms with 10k records
- [ ] No N+1 queries in SQL log
- [ ] Cache hit rate > 80% for stats endpoint

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Latency unchanged | Query not using index | EXPLAIN ANALYZE |
| Cache stale data | TTL too long | Reduce TTL or invalidate on mutation |

## Reference

- [Coding Standards](../Volume-1-Foundation/25-coding-standards.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)
- [Templates](../Templates/)
- [Caching Patterns](33-caching-patterns.md)

## Related Chapters

- [Previous: Deployment Guide](19-deployment-guide.md)
- [Next: Security Checklist](21-security-checklist.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
