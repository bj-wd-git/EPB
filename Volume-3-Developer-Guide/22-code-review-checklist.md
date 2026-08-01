# Code Review Checklist

> **Volume:** 3 | **Chapter ID:** v3-22 | **Status:** reviewed

## What You Will Accomplish

You will perform a structured code review using the EPB code review checklist.

## Prerequisites

- Pull request ready for review

## Steps

### Step 1: PR metadata

- [ ] Linked ticket, CI green, reasonable size

### Step 2: Architecture

- [ ] Logic in correct layers
- [ ] No entities in API responses

### Step 3: API contracts

- [ ] OpenAPI updated
- [ ] Standard error envelope

### Step 4: Testing

- [ ] Unit tests for business logic
- [ ] Integration tests for persistence

### Step 5: Operations

- [ ] Structured logging
- [ ] Audit events
- [ ] Migration if schema changed

## Verification

- [ ] All checklist sections reviewed
- [ ] Approval only when items pass

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Validation errors on API | Request DTO mismatch | Check mapper and DTO definitions |
| Missing tenant context | Auth middleware not applied | Verify BFF passes `X-Tenant-Id` header |
| Test failures on DB | Migration not applied | Run migrations per [Database Migrations](29-database-migrations.md) |
| 403 Forbidden | Missing permission | Check authorization policy and role assignment |

## Reference

- [Coding Standards](../Volume-1-Foundation/25-coding-standards.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)
- [Templates](../Templates/)

## Related Chapters

- [Previous: Security Checklist](21-security-checklist.md)
- [Next: Naming Standards Reference](23-naming-standards-reference.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
