# How to Create a Scheduler Job

> **Volume:** 3 | **Chapter ID:** v3-12 | **Status:** reviewed

## What You Will Accomplish

You will create a scheduled job that archives inactive resources nightly using the Scheduler Platform.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Scheduler Platform running locally

## Steps

### Step 1: Define the job handler

```typescript
// jobs/archive-inactive-resources.job.ts
export class ArchiveInactiveResourcesJob {
  constructor(private readonly resourceService: ResourceService) {}

  async execute(context: JobContext): Promise<JobResult> {
    const cutoff = subDays(new Date(), 90);
    const archived = await this.resourceService.archiveInactiveBefore(cutoff, context.tenantId);
    return { processed: archived.length, status: 'success' };
  }
}
```

### Step 2: Register job with Scheduler Platform

```bash
curl -X POST http://localhost:8083/scheduler/v1/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "archive-inactive-resources",
    "cron": "0 2 * * *",
    "handler": "catalog.archive-inactive-resources",
    "timeout": 300,
    "retryPolicy": { "maxAttempts": 3, "backoff": "exponential" }
  }'
```

### Step 3: Implement the handler endpoint

Scheduler Platform calls your service webhook:

```typescript
@Post('/internal/jobs/archive-inactive-resources')
async handleArchiveJob(@Headers('X-Job-Token') token: string): Promise<JobResult> {
  this.validateJobToken(token);
  return this.archiveJob.execute({ tenantId: this.getTenantFromContext() });
}
```

### Step 4: Test with manual trigger

```bash
curl -X POST http://localhost:8083/scheduler/v1/jobs/archive-inactive-resources/trigger
```

**Expected result:** Resources inactive for 90+ days are archived; job log shows count.

## Verification

- [ ] All unit tests pass
- [ ] Integration test covers happy path
- [ ] OpenAPI spec updated if API changed
- [ ] Code review checklist completed ([Code Review Checklist](22-code-review-checklist.md))
- [ ] Job runs on cron schedule in staging
- [ ] Idempotent — safe to re-run
- [ ] Job metrics exported to monitoring

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

- [Previous: Create Workflow](11-create-workflow.md)
- [Next: Create Notification Event](13-create-notification-event.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
