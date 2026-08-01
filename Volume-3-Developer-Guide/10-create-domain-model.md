# How to Create a Domain Model

> **Volume:** 3 | **Chapter ID:** v3-10 | **Status:** reviewed

## What You Will Accomplish

You will create a domain model for the catalog service that encapsulates business rules for a generic **Resource** entity — validation, state transitions, and domain events — separate from persistence and API layers.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Model Separation](../Volume-1-Foundation/11-model-separation.md) reviewed
- [Entity Standards](../Volume-1-Foundation/16-entity-standards.md) reviewed

## Steps

### Step 1: Create the domain model class

In `services/application/catalog/domain/models/resource.model.ts`:

```typescript
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
```

**Expected result:** Domain model with behavior, no ORM annotations.

### Step 2: Define domain errors

```typescript
// domain/errors/domain.error.ts
export class DomainError extends Error {
  constructor(public readonly code: string, message?: string) {
    super(message || code);
  }
}
```

### Step 3: Write unit tests for business rules

```typescript
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
```

**Expected result:** Tests pass without database or HTTP.

### Step 4: Map between domain model and persistence entity

In `mappers/resource.mapper.ts`, convert Entity ↔ Domain Model. The mapper translates; it does not contain business logic.

**Expected result:** Application service uses domain model; repository returns entity mapped to domain.

## Verification

- [ ] All unit tests pass
- [ ] Integration test covers happy path
- [ ] OpenAPI spec updated if API changed
- [ ] Code review checklist completed ([Code Review Checklist](22-code-review-checklist.md))
- [ ] Domain model has zero framework imports
- [ ] All business rules tested at unit level
- [ ] Domain model never exposed via API

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
- [Model Separation](../Volume-1-Foundation/11-model-separation.md)

## Related Chapters

- [Previous: Create Mapper](09-create-mapper.md)
- [Next: Create Workflow](11-create-workflow.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
