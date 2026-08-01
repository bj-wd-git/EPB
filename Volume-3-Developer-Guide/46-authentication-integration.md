# How to Integrate Authentication

> **Volume:** 3 | **Chapter ID:** v3-46 | **Status:** reviewed

## What You Will Accomplish

You will integrate JWT authentication in the catalog service — validating tokens and extracting user/tenant context.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Auth Platform issuing JWTs

## Steps

### Step 1: Add auth middleware

Validate JWT signature, expiry, and issuer.

### Step 2: Extract claims

userId, tenantId, roles from token payload.

### Step 3: Attach to request context

Available to all controllers and services.

### Step 4: Return 401 for invalid/missing tokens

Exclude /health endpoints.

**Expected result:** Protected endpoints reject unauthenticated requests.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Valid token grants access
- [ ] Expired token returns 401

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

- [Previous: Frontend Integration](45-frontend-integration.md)
- [Next: Authorization Integration](47-authorization-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
