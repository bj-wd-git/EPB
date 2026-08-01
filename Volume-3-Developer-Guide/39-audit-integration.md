# How to Integrate Audit

> **Volume:** 3 | **Chapter ID:** v3-39 | **Status:** reviewed

## What You Will Accomplish

You will emit audit events for all resource mutations via the Audit Platform.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Audit Platform running

## Steps

### Step 1: Identify auditable actions

Create, update, delete, archive, status change.

### Step 2: Emit audit event after mutation

```typescript
await auditClient.record({
  action: 'resource.created',
  entityType: 'resource',
  entityId: resource.id,
  actorId: userId,
  tenantId,
  changes: { before: null, after: resource },
});
```

### Step 3: Never block main flow on audit failure

Log error and retry; do not roll back business transaction.

### Step 4: Verify in audit query API

**Expected result:** All mutations visible in audit trail.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Actor, timestamp, and changes captured
- [ ] Audit failure does not block mutation

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

- [Previous: Search Integration](38-search-integration.md)
- [Next: Logging Integration](40-logging-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
