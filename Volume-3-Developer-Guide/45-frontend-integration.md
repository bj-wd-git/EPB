# How to Integrate Frontend

> **Volume:** 3 | **Chapter ID:** v3-45 | **Status:** reviewed

## What You Will Accomplish

You will connect the catalog frontend module to the BFF API with authentication, error handling, and loading states.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- BFF catalog routes available
- Frontend dev server running

## Steps

### Step 1: Create API client module

`frontend/src/api/catalogClient.ts` — typed methods for CRUD.

### Step 2: Wire authentication

Attach JWT from auth context to all requests.

### Step 3: Build resource list page

Fetch paginated resources; display loading and error states.

### Step 4: Implement create/edit forms

Validate client-side; submit to BFF; handle API errors.

**Expected result:** Frontend CRUD works end-to-end through BFF.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Auth token attached to requests
- [ ] Error messages displayed to user

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

- [Previous: BFF Aggregation Patterns](44-bff-aggregation-patterns.md)
- [Next: Authentication Integration](46-authentication-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
