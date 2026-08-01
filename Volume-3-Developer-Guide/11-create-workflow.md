# How to Create a Workflow

> **Volume:** 3 | **Chapter ID:** v3-11 | **Status:** reviewed

## What You Will Accomplish

You will define a multi-step approval workflow for resource publishing using the Workflow Platform — states, transitions, assignees, and event hooks.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Workflow Platform service running locally
- [Workflow Engine](../Volume-2-Platform-Services/19-workflow-engine.md) reviewed

## Steps

### Step 1: Define workflow definition

Create `workflows/resource-publish.yaml`:

```yaml
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
```

**Expected result:** Workflow definition validates against platform schema.

### Step 2: Register workflow with platform

```bash
curl -X POST http://localhost:8082/workflow/v1/definitions \
  -H "Content-Type: application/yaml" \
  --data-binary @workflows/resource-publish.yaml
```

### Step 3: Start workflow instance on resource submit

In application service:

```typescript
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
```

### Step 4: Handle workflow completion events

Subscribe to `workflow.completed` events. On `published` state, call `resource.publish()` in domain model.

**Expected result:** End-to-end flow: submit → review → approve → auto-publish.

## Verification

- [ ] All unit tests pass
- [ ] Integration test covers happy path
- [ ] OpenAPI spec updated if API changed
- [ ] Code review checklist completed ([Code Review Checklist](22-code-review-checklist.md))
- [ ] Workflow instance created on submit
- [ ] State transitions emit audit events
- [ ] Rejected resources return to editable state

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Workflow not found | Definition not registered | POST definition to workflow platform |
| Stuck in pending_review | No assignee configured | Check role assignment for reviewer |
| Double publish | Event handler not idempotent | Check current state before transition |

## Reference

- [Coding Standards](../Volume-1-Foundation/25-coding-standards.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)
- [Templates](../Templates/)
- [Workflow Integration](50-workflow-integration.md)

## Related Chapters

- [Previous: Create Domain Model](10-create-domain-model.md)
- [Next: Create Scheduler Job](12-create-scheduler-job.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
