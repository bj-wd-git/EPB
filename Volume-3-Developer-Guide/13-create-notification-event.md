# How to Create a Notification Event

> **Volume:** 3 | **Chapter ID:** v3-13 | **Status:** reviewed

## What You Will Accomplish

You will publish a notification event when a resource is created, triggering email delivery via the Notification Platform.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Notification Platform running
- Event bus configured

## Steps

### Step 1: Define the event payload

```typescript
// events/resource-created.event.ts
export interface ResourceCreatedEvent {
  eventType: 'catalog.resource.created';
  tenantId: string;
  resourceId: string;
  resourceName: string;
  createdBy: string;
  timestamp: string;
}
```

### Step 2: Publish event after resource creation

```typescript
async createResource(request: CreateResourceRequest): Promise<Resource> {
  const resource = await this.resourceRepo.save(newResource);
  await this.eventPublisher.publish<ResourceCreatedEvent>({
    eventType: 'catalog.resource.created',
    tenantId: request.tenantId,
    resourceId: resource.id,
    resourceName: resource.name,
    createdBy: request.userId,
    timestamp: new Date().toISOString(),
  });
  return resource;
}
```

### Step 3: Register notification template

```bash
curl -X POST http://localhost:8084/notification/v1/templates \
  -d '{
    "name": "resource-created",
    "channel": "email",
    "subject": "New resource: {{resourceName}}",
    "body": "Resource {{resourceName}} was created by {{createdBy}}."
  }'
```

### Step 4: Configure event-to-notification mapping

Map `catalog.resource.created` → template `resource-created` with recipients from tenant config.

**Expected result:** Creating a resource sends email to configured recipients.

## Verification

- [ ] All unit tests pass
- [ ] Integration test covers happy path
- [ ] OpenAPI spec updated if API changed
- [ ] Code review checklist completed ([Code Review Checklist](22-code-review-checklist.md))
- [ ] Event published with correlation ID
- [ ] Notification delivered to correct recipients
- [ ] Failed delivery retried per platform policy

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
- [Event Publishing Guide](31-event-publishing-guide.md)

## Related Chapters

- [Previous: Create Scheduler Job](12-create-scheduler-job.md)
- [Next: Create Dashboard](14-create-dashboard.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
