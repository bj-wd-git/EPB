# Local Development Tips

> **Volume:** 3 | **Chapter ID:** v3-76 | **Status:** reviewed

## What You Will Accomplish

You will optimize your local development setup for faster feedback loops.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Use docker compose for dependencies only

Run service natively for hot reload.

### Step 2: Configure IDE debugger attachment

### Step 3: Use test containers for integration tests

### Step 4: Set up file watchers for auto-restart

**Expected result:** Code change to test feedback under 5 seconds.

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

- [Previous: Debugging Platform Services](75-debugging-platform-services.md)
- [Next: Onboarding Checklist](77-onboarding-checklist.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
