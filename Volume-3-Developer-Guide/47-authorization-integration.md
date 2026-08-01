# How to Integrate Authorization

> **Volume:** 3 | **Chapter ID:** v3-47 | **Status:** reviewed

## What You Will Accomplish

You will implement permission checks for catalog operations using the Authorization Platform.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Authentication Integration](46-authentication-integration.md) completed

## Steps

### Step 1: Define permissions

`resource:read`, `resource:create`, `resource:update`, `resource:delete`.

### Step 2: Register permissions with Authorization Platform

### Step 3: Check permissions in application layer

```typescript
await authz.requirePermission(userId, 'resource:create', tenantId);
```

### Step 4: Map roles to permissions

Editor: read+create+update. Admin: all.

**Expected result:** Unauthorized operations return 403.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Each endpoint checks appropriate permission
- [ ] Role changes take effect without restart

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

- [Previous: Authentication Integration](46-authentication-integration.md)
- [Next: Multi Tenant Setup](48-multi-tenant-setup.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
