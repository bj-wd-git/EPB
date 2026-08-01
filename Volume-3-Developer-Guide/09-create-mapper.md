# How to Create a Mapper

> **Volume:** 3 | **Chapter ID:** v3-09 | **Status:** reviewed

## What You Will Accomplish

You will implement mappers that convert between EPB model types at layer boundaries: Request DTO → Transaction Model → Domain Model → Persistence Entity → Response DTO. Mappers are the only place cross-type field translation should live.

## Prerequisites

- [Create Request DTO](06-create-request-dto.md) completed
- [Create Response DTO](07-create-response-dto.md) completed
- [Create Entity](08-create-entity.md) completed
- [Mapping Strategy](../Volume-1-Foundation/17-mapping-strategy.md) reviewed

## Mapper Contract

EPB defines a fixed mapping chain. Each arrow is one mapper method:

```text
CreateResourceRequest
  → CreateResourceCommand      (Request → Transaction)
  → Resource                   (Transaction → Domain)
  → ResourceEntity             (Domain → Entity)

ResourceEntity + OrganizationEntity
  → ResourceResponse           (Entity → Response)
```

```mermaid
flowchart LR
  Req[Request_DTO] -->|toCommand| Cmd[Transaction_Model]
  Cmd -->|toDomain| Dom[Domain_Model]
  Dom -->|toEntity| Ent[Persistence_Entity]
  Ent -->|toResponse| Res[Response_DTO]
```

Mappers are **stateless** static classes or injectable components with no database access.

## Steps

### Step 1: Create the mapper file

```bash
touch services/application/catalog/mappers/ResourceMapper.ts
```

One mapper class per aggregate root (`ResourceMapper`, not `CatalogMapper` that maps everything).

**Expected result:** Mapper lives in `mappers/`, not inside controllers or repositories.

### Step 2: Implement Request DTO → Transaction Model

```typescript
import { CreateResourceRequest, CreateResourceCommand } from '@epb/shared-contracts/catalog';
import { RequestContext } from '@epb/shared-kernel';

export class ResourceMapper {
  static toCreateCommand(
    request: CreateResourceRequest,
    context: RequestContext
  ): CreateResourceCommand {
    return {
      tenantId: context.tenantId,       // from auth — never from request body
      code: request.code.trim().toUpperCase(),
      displayName: request.displayName.trim(),
      organizationId: request.organizationId,
      metadata: request.metadata ?? {},
      createdBy: context.userId,
      correlationId: context.correlationId,
    };
  }
}
```

Light normalization (trim, case) is acceptable in mappers. Business rules (uniqueness, state transitions) belong in the Domain Model.

**Expected result:** `tenantId` and `createdBy` come from context, not the HTTP body.

### Step 3: Implement Transaction Model → Domain Model

```typescript
static toDomain(command: CreateResourceCommand): Resource {
  return Resource.create({
    code: command.code,
    displayName: command.displayName,
    organizationId: OrganizationId.of(command.organizationId),
    metadata: command.metadata,
    tenantId: TenantId.of(command.tenantId),
    createdBy: command.createdBy,
  });
}
```

If you skip a rich Domain Model for simple CRUD, map Command → Entity directly and document the decision in an ADR.

**Expected result:** Domain invariants enforced in `Resource.create()`, not in the mapper.

### Step 4: Implement Domain Model → Persistence Entity

```typescript
static toEntity(domain: Resource): ResourceEntity {
  const entity = new ResourceEntity();
  entity.publicId = domain.id.value;
  entity.tenantId = domain.tenantId.value;
  entity.code = domain.code;
  entity.displayName = domain.displayName;
  entity.organizationId = domain.organizationId.value;
  entity.status = domain.status;
  entity.metadataJson = domain.metadata;
  entity.version = domain.version;
  return entity;
}
```

For updates, map only changed fields or use a dedicated `applyToEntity(domain, entity)` method.

**Expected result:** Entity has no fields that lack a domain source.

### Step 5: Implement Persistence Entity → Response DTO

```typescript
static toResponse(
  entity: ResourceEntity,
  organization: OrganizationEntity
): ResourceResponse {
  return {
    id: entity.publicId,
    code: entity.code,
    displayName: entity.displayName,
    status: entity.status as ResourceStatus,
    organization: {
      id: organization.publicId,
      name: organization.displayName,
    },
    metadata: entity.metadataJson ?? undefined,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
```

When the response combines multiple entities, the mapper accepts all required sources:

```typescript
static toDetailResponse(
  entity: ResourceEntity,
  organization: OrganizationEntity,
  auditTrail: AuditSummary[]
): ResourceDetailResponse { ... }
```

**Expected result:** Response has no `tenantId`, `version`, or internal `id`.

### Step 6: Implement list mapping

```typescript
static toSummaryResponse(entity: ResourceEntity): ResourceSummaryResponse {
  return {
    id: entity.publicId,
    code: entity.code,
    displayName: entity.displayName,
    status: entity.status as ResourceStatus,
  };
}

static toPagedResponse(
  page: PagedResult<ResourceEntity>
): PagedResourceListResponse {
  return {
    items: page.items.map(ResourceMapper.toSummaryResponse),
    pagination: {
      page: page.page,
      pageSize: page.pageSize,
      totalItems: page.totalItems,
      totalPages: page.totalPages,
    },
  };
}
```

**Expected result:** List endpoint uses summary mapper; detail endpoint uses full response mapper.

### Step 7: Implement update mapping

```typescript
static toUpdateCommand(
  request: UpdateResourceRequest,
  context: RequestContext,
  publicId: string
): UpdateResourceCommand {
  return {
    tenantId: context.tenantId,
    publicId,
    displayName: request.displayName?.trim(),
    status: request.status,
    metadata: request.metadata,
    updatedBy: context.userId,
    correlationId: context.correlationId,
  };
}

static applyUpdate(command: UpdateResourceCommand, entity: ResourceEntity): void {
  if (command.displayName !== undefined) entity.displayName = command.displayName;
  if (command.status !== undefined) entity.status = command.status;
  if (command.metadata !== undefined) entity.metadataJson = command.metadata;
  entity.updatedBy = command.updatedBy;
}
```

Partial updates map only provided fields — do not overwrite with `undefined`.

**Expected result:** PATCH semantics preserved through mapper.

### Step 8: Write mapper unit tests

```typescript
describe('ResourceMapper', () => {
  describe('toCreateCommand', () => {
    it('enriches from context, not request body', () => {
      const cmd = ResourceMapper.toCreateCommand(validRequest, devContext);
      expect(cmd.tenantId).toBe(devContext.tenantId);
      expect(cmd.createdBy).toBe(devContext.userId);
    });

    it('normalizes code to uppercase', () => {
      const cmd = ResourceMapper.toCreateCommand({ ...validRequest, code: 'res-001' }, devContext);
      expect(cmd.code).toBe('RES-001');
    });
  });

  describe('toResponse', () => {
    it('excludes internal fields', () => {
      const res = ResourceMapper.toResponse(fixtureEntity, fixtureOrg);
      expect(res).not.toHaveProperty('tenantId');
      expect(res).not.toHaveProperty('version');
      expect(res.id).toBe(fixtureEntity.publicId);
    });
  });
});
```

**Expected result:** Mapper tests run without database — pure functions only.

### Step 9: Register mapper in the service layer

Wire in the controller:

```typescript
async create(req: Request, res: Response) {
  const command = ResourceMapper.toCreateCommand(req.body, req.context);
  const domain = ResourceMapper.toDomain(command);
  const saved = await this.resourceService.create(domain);
  const org = await this.orgClient.getById(saved.organizationId, req.context.tenantId);
  return res.status(201).json(wrapSuccess(ResourceMapper.toResponse(saved, org)));
}
```

Or collapse steps inside the service if the controller should be thinner. The mapper is always the conversion point — never inline field copying in controllers.

**Expected result:** No manual `{ id: entity.publicId, ... }` construction outside the mapper.

## Verification

- [ ] Mapper file in `mappers/` directory
- [ ] Stateless methods — no repository or HTTP dependencies
- [ ] Request → Command enriches from auth context
- [ ] Entity → Response excludes internal fields
- [ ] Multi-entity responses accept all required sources
- [ ] List uses summary mapper; detail uses full mapper
- [ ] Update mapper handles partial fields
- [ ] Unit tests cover each mapping direction
- [ ] No mapping logic duplicated in controllers or repositories

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `tenantId` in API response | Mapped entity directly | Use `toResponse`; exclude `tenantId` |
| Inconsistent field names | Mapping in multiple places | Centralize in mapper |
| Business rule in mapper | Validation in `toCreateCommand` | Move rule to Domain Model |
| Null organization in response | Mapper called with entity only | Fetch related entity; pass to mapper |
| PATCH overwrites with null | No undefined check in `applyUpdate` | Map only defined fields |

## Reference

- Mapper template: [Templates/dto-template.md](../Templates/dto-template.md)
- Mapping strategy: [Mapping Strategy](../Volume-1-Foundation/17-mapping-strategy.md)
- Model separation: [Model Separation](../Volume-1-Foundation/11-model-separation.md)
- Anti-patterns: [Anti-Patterns Catalog](73-anti-patterns-catalog.md)

## Related Chapters

- [Previous: Create Entity](08-create-entity.md)
- [Next: Create Domain Model](10-create-domain-model.md)
- [Create Request DTO](06-create-request-dto.md)
- [Create Response DTO](07-create-response-dto.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
