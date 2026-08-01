# Dynamic Forms Guide

> **Volume:** 3 | **Chapter ID:** v3-68 | **Status:** reviewed

## What You Will Accomplish

You will create a dynamic form for resource creation with conditional fields based on resource type.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Define form schema JSON

Fields, validation rules, conditional visibility.

### Step 2: Register form with dynamic forms engine

### Step 3: Bind submit to catalog create API

### Step 4: Test conditional field behavior

**Expected result:** Form adapts based on user selections.

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

- [Previous: Metadata Driven Screens](67-metadata-driven-screens.md)
- [Next: Developer CLI Usage](69-developer-cli-usage.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
