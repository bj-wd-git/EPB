# Debugging Platform Services

> **Volume:** 3 | **Chapter ID:** v3-75 | **Status:** reviewed

## What You Will Accomplish

You will debug platform service interactions — tracing requests across auth, audit, and notification services.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Enable debug logging on platform services

### Step 2: Trace request with correlation ID across services

### Step 3: Use distributed tracing (Jaeger) for latency analysis

### Step 4: Inspect message broker for event delivery issues

**Expected result:** Cross-service issue identified via traces.

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

- [Previous: Troubleshooting Guide](74-troubleshooting-guide.md)
- [Next: Local Development Tips](76-local-development-tips.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
