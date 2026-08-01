/**
 * Volume 3 chapter content for enhance-boilerplate.js
 */
module.exports = function register(CONTENT, v3) {
  const stdPrereqs = (extra) =>
    `- [Project Setup](01-project-setup.md) completed\n- [Development Environment](02-development-environment.md) configured\n- [Create New Service](04-create-new-service.md) completed${extra ? '\n' + extra : ''}`;

  const stdVerify = (extra) =>
    `- [ ] All unit tests pass\n- [ ] Integration test covers happy path\n- [ ] OpenAPI spec updated if API changed\n- [ ] Code review checklist completed ([Code Review Checklist](22-code-review-checklist.md))${extra ? '\n' + extra : ''}`;

  const stdTrouble = `| Symptom | Cause | Fix |
|---------|-------|-----|
| Validation errors on API | Request DTO mismatch | Check mapper and DTO definitions |
| Missing tenant context | Auth middleware not applied | Verify BFF passes \`X-Tenant-Id\` header |
| Test failures on DB | Migration not applied | Run migrations per [Database Migrations](29-database-migrations.md) |
| 403 Forbidden | Missing permission | Check authorization policy and role assignment |`;

  const stdRef = `- [Coding Standards](../../Volume-1-Foundation/25-coding-standards.md)\n- [API Standards](../../Volume-1-Foundation/18-api-standards.md)\n- [Templates](../../Templates/)`;

  Object.assign(CONTENT, {
    'v3-10': {
      accomplish: 'You will create a domain model for the catalog service that encapsulates business rules for a generic **Resource** entity — validation, state transitions, and domain events — separate from persistence and API layers.',
      prereqs: stdPrereqs('- [Model Separation](../../Volume-1-Foundation/11-model-separation.md) reviewed\n- [Entity Standards](../../Volume-1-Foundation/16-entity-standards.md) reviewed'),
      steps: `### Step 1: Create the domain model class

In \`services/application/catalog/domain/models/resource.model.ts\`:

\`\`\`typescript
export enum ResourceStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class Resource {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    private _name: string,
    private _status: ResourceStatus,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get name(): string { return this._name; }
  get status(): ResourceStatus { return this._status; }
  get updatedAt(): Date { return this._updatedAt; }

  rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new DomainError('RESOURCE_NAME_REQUIRED');
    }
    this._name = newName.trim();
    this._updatedAt = new Date();
  }

  activate(): void {
    if (this._status !== ResourceStatus.DRAFT) {
      throw new DomainError('RESOURCE_NOT_DRAFT');
    }
    this._status = ResourceStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  archive(): void {
    if (this._status === ResourceStatus.ARCHIVED) {
      throw new DomainError('RESOURCE_ALREADY_ARCHIVED');
    }
    this._status = ResourceStatus.ARCHIVED;
    this._updatedAt = new Date();
  }
}
\`\`\`

**Expected result:** Domain model with behavior, no ORM annotations.

### Step 2: Define domain errors

\`\`\`typescript
// domain/errors/domain.error.ts
export class DomainError extends Error {
  constructor(public readonly code: string, message?: string) {
    super(message || code);
  }
}
\`\`\`

### Step 3: Write unit tests for business rules

\`\`\`typescript
describe('Resource', () => {
  it('rejects empty name on rename', () => {
    const resource = createDraftResource();
    expect(() => resource.rename('')).toThrow('RESOURCE_NAME_REQUIRED');
  });

  it('activates only from DRAFT status', () => {
    const resource = createDraftResource();
    resource.activate();
    expect(resource.status).toBe(ResourceStatus.ACTIVE);
    expect(() => resource.activate()).toThrow('RESOURCE_NOT_DRAFT');
  });
});
\`\`\`

**Expected result:** Tests pass without database or HTTP.

### Step 4: Map between domain model and persistence entity

In \`mappers/resource.mapper.ts\`, convert Entity ↔ Domain Model. The mapper translates; it does not contain business logic.

**Expected result:** Application service uses domain model; repository returns entity mapped to domain.`,
      verify: stdVerify('- [ ] Domain model has zero framework imports\n- [ ] All business rules tested at unit level\n- [ ] Domain model never exposed via API'),
      trouble: stdTrouble,
      ref: stdRef + '\n- [Model Separation](../../Volume-1-Foundation/11-model-separation.md)',
    },

    'v3-11': {
      accomplish: 'You will define a multi-step approval workflow for resource publishing using the Workflow Platform — states, transitions, assignees, and event hooks.',
      prereqs: stdPrereqs('- Workflow Platform service running locally\n- [Workflow Platform](../../Volume-2-Platform-Services/11-workflow-platform.md) reviewed'),
      steps: `### Step 1: Define workflow definition

Create \`workflows/resource-publish.yaml\`:

\`\`\`yaml
name: resource-publish
version: 1
entityType: resource
states:
  - id: draft
    initial: true
  - id: pending_review
  - id: approved
  - id: rejected
  - id: published
transitions:
  - from: draft
    to: pending_review
    action: submit
    assignee: role:editor
  - from: pending_review
    to: approved
    action: approve
    assignee: role:reviewer
  - from: pending_review
    to: rejected
    action: reject
    assignee: role:reviewer
  - from: approved
    to: published
    action: publish
    auto: true
\`\`\`

**Expected result:** Workflow definition validates against platform schema.

### Step 2: Register workflow with platform

\`\`\`bash
curl -X POST http://localhost:8082/workflow/v1/definitions \\
  -H "Content-Type: application/yaml" \\
  --data-binary @workflows/resource-publish.yaml
\`\`\`

### Step 3: Start workflow instance on resource submit

In application service:

\`\`\`typescript
async submitForReview(resourceId: string, tenantId: string): Promise<void> {
  const resource = await this.resourceRepo.findById(resourceId, tenantId);
  resource.submitForReview(); // domain logic
  await this.workflowClient.startInstance({
    definitionName: 'resource-publish',
    entityType: 'resource',
    entityId: resourceId,
    tenantId,
  });
  await this.resourceRepo.save(resource);
}
\`\`\`

### Step 4: Handle workflow completion events

Subscribe to \`workflow.completed\` events. On \`published\` state, call \`resource.publish()\` in domain model.

**Expected result:** End-to-end flow: submit → review → approve → auto-publish.`,
      verify: stdVerify('- [ ] Workflow instance created on submit\n- [ ] State transitions emit audit events\n- [ ] Rejected resources return to editable state'),
      trouble: '| Symptom | Cause | Fix |\n|---------|-------|-----|\n| Workflow not found | Definition not registered | POST definition to workflow platform |\n| Stuck in pending_review | No assignee configured | Check role assignment for reviewer |\n| Double publish | Event handler not idempotent | Check current state before transition |',
      ref: stdRef + '\n- [Workflow Integration](50-workflow-integration.md)',
    },

    'v3-12': {
      accomplish: 'You will create a scheduled job that archives inactive resources nightly using the Scheduler Platform.',
      prereqs: stdPrereqs('- Scheduler Platform running locally'),
      steps: `### Step 1: Define the job handler

\`\`\`typescript
// jobs/archive-inactive-resources.job.ts
export class ArchiveInactiveResourcesJob {
  constructor(private readonly resourceService: ResourceService) {}

  async execute(context: JobContext): Promise<JobResult> {
    const cutoff = subDays(new Date(), 90);
    const archived = await this.resourceService.archiveInactiveBefore(cutoff, context.tenantId);
    return { processed: archived.length, status: 'success' };
  }
}
\`\`\`

### Step 2: Register job with Scheduler Platform

\`\`\`bash
curl -X POST http://localhost:8083/scheduler/v1/jobs \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "archive-inactive-resources",
    "cron": "0 2 * * *",
    "handler": "catalog.archive-inactive-resources",
    "timeout": 300,
    "retryPolicy": { "maxAttempts": 3, "backoff": "exponential" }
  }'
\`\`\`

### Step 3: Implement the handler endpoint

Scheduler Platform calls your service webhook:

\`\`\`typescript
@Post('/internal/jobs/archive-inactive-resources')
async handleArchiveJob(@Headers('X-Job-Token') token: string): Promise<JobResult> {
  this.validateJobToken(token);
  return this.archiveJob.execute({ tenantId: this.getTenantFromContext() });
}
\`\`\`

### Step 4: Test with manual trigger

\`\`\`bash
curl -X POST http://localhost:8083/scheduler/v1/jobs/archive-inactive-resources/trigger
\`\`\`

**Expected result:** Resources inactive for 90+ days are archived; job log shows count.`,
      verify: stdVerify('- [ ] Job runs on cron schedule in staging\n- [ ] Idempotent — safe to re-run\n- [ ] Job metrics exported to monitoring'),
      trouble: stdTrouble,
      ref: stdRef,
    },

    'v3-13': {
      accomplish: 'You will publish a notification event when a resource is created, triggering email delivery via the Notification Platform.',
      prereqs: stdPrereqs('- Notification Platform running\n- Event bus configured'),
      steps: `### Step 1: Define the event payload

\`\`\`typescript
// events/resource-created.event.ts
export interface ResourceCreatedEvent {
  eventType: 'catalog.resource.created';
  tenantId: string;
  resourceId: string;
  resourceName: string;
  createdBy: string;
  timestamp: string;
}
\`\`\`

### Step 2: Publish event after resource creation

\`\`\`typescript
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
\`\`\`

### Step 3: Register notification template

\`\`\`bash
curl -X POST http://localhost:8084/notification/v1/templates \\
  -d '{
    "name": "resource-created",
    "channel": "email",
    "subject": "New resource: {{resourceName}}",
    "body": "Resource {{resourceName}} was created by {{createdBy}}."
  }'
\`\`\`

### Step 4: Configure event-to-notification mapping

Map \`catalog.resource.created\` → template \`resource-created\` with recipients from tenant config.

**Expected result:** Creating a resource sends email to configured recipients.`,
      verify: stdVerify('- [ ] Event published with correlation ID\n- [ ] Notification delivered to correct recipients\n- [ ] Failed delivery retried per platform policy'),
      trouble: stdTrouble,
      ref: stdRef + '\n- [Event Publishing Guide](31-event-publishing-guide.md)',
    },

    'v3-14': {
      accomplish: 'You will create a dashboard showing resource counts by status using the Dashboard Builder Platform.',
      prereqs: stdPrereqs('- Dashboard Builder Platform available\n- Catalog service API exposing aggregate endpoint'),
      steps: `### Step 1: Create aggregate API endpoint

\`\`\`typescript
@Get('/resources/stats')
async getResourceStats(): Promise<ResourceStatsResponse> {
  return this.resourceService.getStatsByStatus(this.tenantId);
}
\`\`\`

Response: \`{ "draft": 12, "active": 45, "archived": 8 }\`

### Step 2: Define dashboard widget

\`\`\`json
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
\`\`\`

### Step 3: Register dashboard

\`\`\`bash
curl -X POST http://localhost:8086/dashboard/v1/dashboards \\
  -H "Content-Type: application/json" \\
  -d @dashboards/catalog-overview.json
\`\`\`

### Step 4: Assign dashboard to role

Grant \`dashboard:view:catalog-overview\` permission to the \`manager\` role.

**Expected result:** Managers see pie chart on home screen with live data.`,
      verify: stdVerify('- [ ] Dashboard loads within 2 seconds\n- [ ] Data refreshes on configurable interval\n- [ ] Unauthorized users cannot access dashboard'),
      trouble: stdTrouble,
      ref: stdRef + '\n- [Dashboard Builder Guide](55-dashboard-builder-guide.md)',
    },

    'v3-15': {
      accomplish: 'You will create a tabular report of resources with filtering and export to PDF using the Report Platform.',
      prereqs: stdPrereqs('- Report Platform available'),
      steps: `### Step 1: Define report template

\`\`\`yaml
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
\`\`\`

### Step 2: Register report definition

\`\`\`bash
curl -X POST http://localhost:8087/report/v1/definitions \\
  --data-binary @reports/resource-list.yaml
\`\`\`

### Step 3: Test report generation

\`\`\`bash
curl -X POST http://localhost:8087/report/v1/generate \\
  -d '{"reportName": "resource-list", "format": "pdf", "filters": {"status": "ACTIVE"}}'
\`\`\`

**Expected result:** PDF generated with filtered active resources.

### Step 4: Schedule recurring report (optional)

Configure weekly email delivery via Scheduler Platform integration.

**Expected result:** Report definition registered and generate endpoint returns file.`,
      verify: stdVerify('- [ ] Report respects tenant isolation\n- [ ] Large datasets paginate without timeout\n- [ ] Export formats produce valid files'),
      trouble: stdTrouble,
      ref: stdRef + '\n- [Report Builder Guide](56-report-builder-guide.md)',
    },

    'v3-20': {
      accomplish: 'You will profile and optimize a slow catalog API endpoint — identifying N+1 queries, missing indexes, and cache opportunities to meet the 500ms p99 latency target.',
      prereqs: stdPrereqs('- [Monitoring and Observability](../../Volume-1-Foundation/33-monitoring-observability.md) reviewed'),
      steps: `### Step 1: Establish baseline metrics\n\nRun load test and record p50, p95, p99. Target: p99 < 500ms.\n\n### Step 2: Enable query logging\n\nSet LOG_LEVEL=debug. Count SQL queries per request — N+1 shows 1+N queries.\n\n### Step 3: Fix N+1 with eager loading\n\nReplace loop queries with single join query in repository.\n\n### Step 4: Add database index\n\n\`\`\`sql\nCREATE INDEX idx_resources_tenant_status ON resources(tenant_id, status);\n\`\`\`\n\n### Step 5: Add caching for read-heavy endpoints\n\nUse @Cacheable with 60s TTL for stats endpoints.\n\n**Expected result:** p99 drops below 500ms.`,
      verify: '- [ ] p99 latency under 500ms with 10k records\n- [ ] No N+1 queries in SQL log\n- [ ] Cache hit rate > 80% for stats endpoint',
      trouble: '| Symptom | Cause | Fix |\n|---------|-------|-----|\n| Latency unchanged | Query not using index | EXPLAIN ANALYZE |\n| Cache stale data | TTL too long | Reduce TTL or invalidate on mutation |',
      ref: stdRef + '\n- [Caching Patterns](33-caching-patterns.md)',
    },

    'v3-21': {
      accomplish: 'You will run the EPB security checklist against a service before production deployment.',
      prereqs: stdPrereqs('- [Security Foundation](../../Volume-1-Foundation/21-security-foundation.md) reviewed'),
      steps: `### Step 1: Authentication\n\n- [ ] All endpoints require valid JWT (except /health)\n- [ ] Token expiry enforced\n- [ ] No credentials in source code\n\n### Step 2: Authorization\n\n- [ ] Every mutation checks permission\n- [ ] Tenant isolation enforced\n- [ ] 403 for unauthorized, not 404\n\n### Step 3: Input validation\n\n- [ ] DTOs validated at API boundary\n- [ ] Parameterized queries only\n- [ ] File uploads validated\n\n### Step 4: Data protection\n\n- [ ] PII not logged\n- [ ] TLS for all communication\n- [ ] Audit events for mutations\n\n### Step 5: Dependency audit\n\n\`\`\`bash\nnpm audit --audit-level=high\n\`\`\``,
      verify: '- [ ] Security checklist 100% pass\n- [ ] SAST scan clean in CI',
      trouble: stdTrouble,
      ref: stdRef + '\n- [Security Foundation](../../Volume-1-Foundation/21-security-foundation.md)',
    },

    'v3-22': {
      accomplish: 'You will perform a structured code review using the EPB code review checklist.',
      prereqs: '- Pull request ready for review',
      steps: `### Step 1: PR metadata\n\n- [ ] Linked ticket, CI green, reasonable size\n\n### Step 2: Architecture\n\n- [ ] Logic in correct layers\n- [ ] No entities in API responses\n\n### Step 3: API contracts\n\n- [ ] OpenAPI updated\n- [ ] Standard error envelope\n\n### Step 4: Testing\n\n- [ ] Unit tests for business logic\n- [ ] Integration tests for persistence\n\n### Step 5: Operations\n\n- [ ] Structured logging\n- [ ] Audit events\n- [ ] Migration if schema changed`,
      verify: '- [ ] All checklist sections reviewed\n- [ ] Approval only when items pass',
      trouble: stdTrouble,
      ref: stdRef,
    },

    'v3-23': {
      accomplish: 'You will apply correct naming conventions for services, APIs, DTOs, entities, and events.',
      prereqs: '- [Naming Conventions](../../Volume-1-Foundation/24-naming-conventions.md) reviewed',
      steps: `### Step 1: Service naming\n\nlowercase, hyphen-separated: \`catalog\`\n\n### Step 2: API paths\n\n\`/{service}/v{version}/{resources}\` — plural nouns, camelCase params\n\n### Step 3: Code artifacts\n\n| Type | Pattern | Example |\n|------|---------|--------|\n| Request DTO | {Action}{Resource}Request | CreateResourceRequest |\n| Entity | {Resource}Entity | ResourceEntity |\n| Event | {service}.{entity}.{action} | catalog.resource.created |\n\n### Step 4: Config keys\n\n\`{SERVICE}_{KEY}\` uppercase: CATALOG_DB_URL`,
      verify: '- [ ] All artifacts follow naming table\n- [ ] Linter naming rules pass',
      trouble: stdTrouble,
      ref: '- [Naming Conventions](../../Volume-1-Foundation/24-naming-conventions.md)',
    },
  });
};
