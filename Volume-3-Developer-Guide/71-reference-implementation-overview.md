# Reference Implementation Overview

> **Volume:** 3 | **Chapter ID:** v3-71 | **Status:** reviewed

## What You Will Accomplish

You will understand the EPB reference implementation structure and how to use it as a template for new services.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Clone and explore reference service

`services/application/_reference/`

### Step 2: Identify patterns

Layer structure, error handling, event publishing, health checks.

### Step 3: Compare with your service

### Step 4: Adopt missing patterns

**Expected result:** Your service aligns with reference implementation.

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

- [Previous: Code Generator Usage](70-code-generator-usage.md)
- [Next: Sample Service Walkthrough](72-sample-service-walkthrough.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
