# Integration Adapter Development

> **Volume:** 3 | **Chapter ID:** v3-65 | **Status:** reviewed

## What You Will Accomplish

You will build an integration adapter to sync resources with an external system.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Define adapter interface

### Step 2: Implement inbound sync (external → catalog)

### Step 3: Implement outbound sync (catalog → external)

### Step 4: Handle conflicts and retries

**Expected result:** Resources sync bidirectionally with external system.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed

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

- [Previous: Global Search Implementation](64-global-search-implementation.md)
- [Next: Plugin Development](66-plugin-development.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
