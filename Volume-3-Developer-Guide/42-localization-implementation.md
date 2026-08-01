# Localization Implementation

> **Volume:** 3 | **Chapter ID:** v3-42 | **Status:** reviewed

## What You Will Accomplish

You will add multi-language support for resource validation messages and API error responses.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed

## Steps

### Step 1: Extract message keys

Replace hardcoded strings with keys: `resource.name.required`.

### Step 2: Create locale files

`locales/en.json`, `locales/es.json` with translations.

### Step 3: Resolve locale from Accept-Language header

Default to tenant's configured locale.

### Step 4: Return localized error messages

`{ "code": "RESOURCE_NAME_REQUIRED", "message": "El nombre es obligatorio" }`

**Expected result:** Errors returned in user's language.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] English and at least one other locale
- [ ] Fallback to English for missing keys

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

- [Previous: Feature Flag Usage](41-feature-flag-usage.md)
- [Next: Master Data Integration](43-master-data-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
