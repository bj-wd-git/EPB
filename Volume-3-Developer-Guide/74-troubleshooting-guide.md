# Troubleshooting Guide

> **Volume:** 3 | **Chapter ID:** v3-74 | **Status:** reviewed

## What You Will Accomplish

You will diagnose and resolve common catalog service issues using systematic troubleshooting.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Check health endpoints

`curl localhost:8085/health/ready`

### Step 2: Check logs with correlation ID

### Step 3: Verify dependencies (DB, Redis, queue)

### Step 4: Check recent deployments and config changes

### Step 5: Escalate with collected evidence

**Expected result:** Issue identified and resolved or escalated with context.

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

- [Previous: Anti Patterns Catalog](73-anti-patterns-catalog.md)
- [Next: Debugging Platform Services](75-debugging-platform-services.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
