# Health Check Implementation

> **Volume:** 3 | **Chapter ID:** v3-57 | **Status:** reviewed

## What You Will Accomplish

You will implement liveness and readiness health check endpoints for the catalog service.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Implement /health/live

Returns 200 if process is running.

### Step 2: Implement /health/ready

Checks database, cache, and message broker connections.

### Step 3: Configure orchestrator probes

Liveness: /health/live, Readiness: /health/ready.

### Step 4: Test failure scenarios

Stop database — readiness should return 503.

**Expected result:** Orchestrator routes traffic only to ready instances.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Ready fails when DB unreachable
- [ ] Live always returns 200 while process runs

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

- [Previous: Report Builder Guide](56-report-builder-guide.md)
- [Next: Monitoring Instrumentation](58-monitoring-instrumentation.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
