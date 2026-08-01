# Metadata Driven Screens

> **Volume:** 3 | **Chapter ID:** v3-67 | **Status:** reviewed

## What You Will Accomplish

You will define a metadata-driven screen for resource management rendered by the frontend shell.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Create screen metadata JSON

Fields, layout, actions, permissions.

### Step 2: Register screen with frontend shell

### Step 3: Bind to catalog API endpoints

### Step 4: Test CRUD operations via metadata screen

**Expected result:** Screen renders from metadata without custom frontend code.

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

- [Previous: Plugin Development](66-plugin-development.md)
- [Next: Dynamic Forms Guide](68-dynamic-forms-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
