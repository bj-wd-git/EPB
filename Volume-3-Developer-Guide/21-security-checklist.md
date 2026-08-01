# Security Checklist

> **Volume:** 3 | **Chapter ID:** v3-21 | **Status:** reviewed

## What You Will Accomplish

You will run the EPB security checklist against a service before production deployment.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Security Foundation](../Volume-1-Foundation/21-security-foundation.md) reviewed

## Steps

### Step 1: Authentication

- [ ] All endpoints require valid JWT (except /health)
- [ ] Token expiry enforced
- [ ] No credentials in source code

### Step 2: Authorization

- [ ] Every mutation checks permission
- [ ] Tenant isolation enforced
- [ ] 403 for unauthorized, not 404

### Step 3: Input validation

- [ ] DTOs validated at API boundary
- [ ] Parameterized queries only
- [ ] File uploads validated

### Step 4: Data protection

- [ ] PII not logged
- [ ] TLS for all communication
- [ ] Audit events for mutations

### Step 5: Dependency audit

```bash
npm audit --audit-level=high
```

## Verification

- [ ] Security checklist 100% pass
- [ ] SAST scan clean in CI

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
- [Security Foundation](../Volume-1-Foundation/21-security-foundation.md)

## Related Chapters

- [Previous: Performance Tuning](20-performance-tuning.md)
- [Next: Code Review Checklist](22-code-review-checklist.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
