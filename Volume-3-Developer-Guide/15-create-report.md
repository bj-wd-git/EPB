# How to Create a Report

> **Volume:** 3 | **Chapter ID:** v3-15 | **Status:** reviewed

## What You Will Accomplish

You will create a tabular report of resources with filtering and export to PDF using the Report Platform.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Report Platform available

## Steps

### Step 1: Define report template

```yaml
# reports/resource-list.yaml
name: resource-list
version: 1
dataSource:
  type: api
  url: /catalog/v1/resources
  pagination: server
columns:
  - field: name
    header: Resource Name
    width: 40%
  - field: status
    header: Status
    width: 20%
  - field: createdAt
    header: Created
    format: date
    width: 20%
  - field: createdBy
    header: Created By
    width: 20%
filters:
  - field: status
    type: select
    options: [DRAFT, ACTIVE, ARCHIVED]
exportFormats: [pdf, xlsx, csv]
```

### Step 2: Register report definition

```bash
curl -X POST http://localhost:8087/report/v1/definitions \
  --data-binary @reports/resource-list.yaml
```

### Step 3: Test report generation

```bash
curl -X POST http://localhost:8087/report/v1/generate \
  -d '{"reportName": "resource-list", "format": "pdf", "filters": {"status": "ACTIVE"}}'
```

**Expected result:** PDF generated with filtered active resources.

### Step 4: Schedule recurring report (optional)

Configure weekly email delivery via Scheduler Platform integration.

**Expected result:** Report definition registered and generate endpoint returns file.

## Verification

- [ ] All unit tests pass
- [ ] Integration test covers happy path
- [ ] OpenAPI spec updated if API changed
- [ ] Code review checklist completed ([Code Review Checklist](22-code-review-checklist.md))
- [ ] Report respects tenant isolation
- [ ] Large datasets paginate without timeout
- [ ] Export formats produce valid files

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
- [Report Builder Guide](56-report-builder-guide.md)

## Related Chapters

- [Previous: Create Dashboard](14-create-dashboard.md)
- [Next: Unit Testing Guide](16-unit-testing-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
