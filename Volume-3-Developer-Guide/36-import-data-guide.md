# Import Data Guide

> **Volume:** 3 | **Chapter ID:** v3-36 | **Status:** reviewed

## What You Will Accomplish

You will implement CSV import for bulk resource creation with validation and error reporting.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [File Upload Integration](35-file-upload-integration.md) optional

## Steps

### Step 1: Define CSV schema

Columns: name, description, status (optional).

### Step 2: Parse and validate rows

Collect per-row errors without stopping on first failure.

### Step 3: Import valid rows in transaction

Batch insert with tenant_id.

### Step 4: Return import summary

`{ imported: 95, failed: 5, errors: [{row: 3, message: "..."}] }`

**Expected result:** CSV imported with detailed error report.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Invalid rows do not block valid rows
- [ ] Duplicate names rejected per tenant

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

- [Previous: File Upload Integration](35-file-upload-integration.md)
- [Next: Export Data Guide](37-export-data-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
