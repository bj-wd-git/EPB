# How to Set Up Organization Hierarchy

> **Volume:** 3 | **Chapter ID:** v3-49 | **Status:** reviewed

## What You Will Accomplish

You will configure organization hierarchy integration so resources can be scoped to org units.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Organization service available

## Steps

### Step 1: Add organizationUnitId to resource entity

Foreign key to organization hierarchy.

### Step 2: Validate org unit on create

Verify unit exists and user has access.

### Step 3: Filter list by org scope

Users see only resources in their org subtree.

### Step 4: Include org path in response DTO

BFF resolves org unit name for display.

**Expected result:** Resources scoped to organization hierarchy.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Cross-org access blocked
- [ ] Org filter applied to list queries

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

- [Previous: Multi Tenant Setup](48-multi-tenant-setup.md)
- [Next: Workflow Integration](50-workflow-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
