# Code Generator Usage

> **Volume:** 3 | **Chapter ID:** v3-70 | **Status:** reviewed

## What You Will Accomplish

You will use the code generator to create DTOs, mappers, and repository from an OpenAPI spec.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Write or update OpenAPI spec

### Step 2: Run code generator

```bash
epb generate from-spec --input api/openapi.yaml --output src/
```

### Step 3: Implement business logic in generated stubs

### Step 4: Verify generated code compiles and tests pass

**Expected result:** Boilerplate generated from spec.

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

- [Previous: Developer CLI Usage](69-developer-cli-usage.md)
- [Next: Reference Implementation Overview](71-reference-implementation-overview.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
