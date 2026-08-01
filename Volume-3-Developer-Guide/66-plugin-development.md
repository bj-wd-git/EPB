# Plugin Development Guide

> **Volume:** 3 | **Chapter ID:** v3-66 | **Status:** reviewed

## What You Will Accomplish

You will create a plugin that extends catalog resource validation with custom rules.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Define plugin interface

### Step 2: Implement validation plugin

### Step 3: Register plugin via configuration

### Step 4: Test plugin loading and execution

**Expected result:** Custom validation runs without modifying core service.

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

- [Previous: Integration Adapter Development](65-integration-adapter-development.md)
- [Next: Metadata Driven Screens](67-metadata-driven-screens.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
