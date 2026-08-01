# Report Builder Guide

> **Volume:** 3 | **Chapter ID:** v3-56 | **Status:** reviewed

## What You Will Accomplish

You will create a tabular resource report with filters and scheduled delivery.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Create Report](15-create-report.md) completed

## Steps

### Step 1: Define report columns and filters

### Step 2: Register report definition

### Step 3: Test PDF and Excel export

### Step 4: Schedule weekly email delivery

**Expected result:** Report generates and delivers on schedule.

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

- [Previous: Dashboard Builder Guide](55-dashboard-builder-guide.md)
- [Next: Health Check Implementation](57-health-check-implementation.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
