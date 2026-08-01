# Feature Flag Usage

> **Volume:** 3 | **Chapter ID:** v3-41 | **Status:** reviewed

## What You Will Accomplish

You will gate a new resource export feature behind a feature flag for gradual rollout.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Feature flag service available

## Steps

### Step 1: Register feature flag

`catalog.export.v2` — default: false.

### Step 2: Check flag in endpoint

```typescript
if (await featureFlags.isEnabled('catalog.export.v2', tenantId)) {
  return this.exportV2(request);
}
return this.exportV1(request);
```

### Step 3: Enable for pilot tenant

Toggle flag for one tenant in staging.

### Step 4: Monitor and expand rollout

Enable per tenant, then globally.

**Expected result:** Feature controllable without deployment.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Flag check does not add >10ms latency
- [ ] Disabled flag returns v1 behavior

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

- [Previous: Logging Integration](40-logging-integration.md)
- [Next: Localization Implementation](42-localization-implementation.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
