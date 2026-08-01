# How to Create a Dashboard

> **Volume:** 3 | **Chapter ID:** v3-14 | **Status:** reviewed

## What You Will Accomplish

You will create a dashboard showing resource counts by status using the Dashboard Builder Platform.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Dashboard Builder Platform available
- Catalog service API exposing aggregate endpoint

## Steps

### Step 1: Create aggregate API endpoint

```typescript
@Get('/resources/stats')
async getResourceStats(): Promise<ResourceStatsResponse> {
  return this.resourceService.getStatsByStatus(this.tenantId);
}
```

Response: `{ "draft": 12, "active": 45, "archived": 8 }`

### Step 2: Define dashboard widget

```json
{
  "dashboardId": "catalog-overview",
  "widgets": [{
    "type": "pie-chart",
    "title": "Resources by Status",
    "dataSource": {
      "type": "api",
      "url": "/catalog/v1/resources/stats",
      "method": "GET"
    },
    "mapping": { "label": "status", "value": "count" }
  }]
}
```

### Step 3: Register dashboard

```bash
curl -X POST http://localhost:8086/dashboard/v1/dashboards \
  -H "Content-Type: application/json" \
  -d @dashboards/catalog-overview.json
```

### Step 4: Assign dashboard to role

Grant `dashboard:view:catalog-overview` permission to the `manager` role.

**Expected result:** Managers see pie chart on home screen with live data.

## Verification

- [ ] All unit tests pass
- [ ] Integration test covers happy path
- [ ] OpenAPI spec updated if API changed
- [ ] Code review checklist completed ([Code Review Checklist](22-code-review-checklist.md))
- [ ] Dashboard loads within 2 seconds
- [ ] Data refreshes on configurable interval
- [ ] Unauthorized users cannot access dashboard

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
- [Dashboard Builder Guide](55-dashboard-builder-guide.md)

## Related Chapters

- [Previous: Create Notification Event](13-create-notification-event.md)
- [Next: Create Report](15-create-report.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
