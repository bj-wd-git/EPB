# Document Generation Guide

> **Volume:** 3 | **Chapter ID:** v3-54 | **Status:** reviewed

## What You Will Accomplish

You will generate PDF documents for resource detail reports using the Document Generation Platform.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Define document template

### Step 2: Call document generation API with resource data

### Step 3: Store generated PDF in object storage

### Step 4: Return download URL to client

**Expected result:** PDF generated with resource details.

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

- [Previous: Template Engine Usage](53-template-engine-usage.md)
- [Next: Dashboard Builder Guide](55-dashboard-builder-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
