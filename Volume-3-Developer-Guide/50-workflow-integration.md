# How to Integrate Workflow

> **Volume:** 3 | **Chapter ID:** v3-50 | **Status:** reviewed

## What You Will Accomplish

You will integrate catalog resource approval with the Workflow Platform for state-driven transitions.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Create Workflow](11-create-workflow.md) completed

## Steps

### Step 1: Map resource status to workflow states

### Step 2: Start workflow on submit

### Step 3: Handle workflow callbacks

Update resource status on transition.

### Step 4: Query workflow status from API

**Expected result:** Resource lifecycle driven by workflow engine.

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

- [Previous: Organization Hierarchy Setup](49-organization-hierarchy-setup.md)
- [Next: Rule Engine Integration](51-rule-engine-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
