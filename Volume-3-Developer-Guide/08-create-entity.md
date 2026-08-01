# How to Create a Persistence Entity

> **Volume:** 3 | **Chapter ID:** v3-08 | **Status:** reviewed

## What You Will Accomplish

You will define a Persistence Entity for the catalog service, create the database migration, implement a repository, and ensure the entity is never exposed via the API. This guide creates `ResourceEntity` mapped to the `resources` table.

## Prerequisites

- [Create New Service](04-create-new-service.md) completed
- [Entity Standards](../Volume-1-Foundation/16-entity-standards.md) reviewed
- Database created for the service (`catalog_dev`)
- Familiarity with [Multi-Tenant Setup](48-multi-tenant-setup.md)

## Entity vs Domain Model

| Aspect | Persistence Entity | Domain Model |
|--------|-------------------|--------------|
| Purpose | Map rows to objects | Enforce business rules |
| Location | `persistence/entities/` | `domain/models/` |
| Annotations | ORM mapping (table, column) | None |
| Exposed via API | **Never** | Never (mapped to Response DTO) |
| Tenant isolation | `tenant_id` column + index | `tenantId` in behavior |

Simple CRUD may skip a rich Domain Model; the Entity still never crosses the HTTP boundary.

## Steps

### Step 1: Design the table schema

Define columns before writing code:

```sql
CREATE TABLE catalog.resources (
  id              BIGSERIAL PRIMARY KEY,
  public_id       UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  code            VARCHAR(64) NOT NULL,
  display_name    VARCHAR(256) NOT NULL,
  organization_id UUID NOT NULL,
  status          VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  metadata_json   JSONB,
  version         INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by      UUID NOT NULL,
  deleted_at      TIMESTAMPTZ,

  CONSTRAINT uq_resources_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX idx_resources_tenant_id ON catalog.resources (tenant_id);
CREATE INDEX idx_resources_public_id ON catalog.resources (public_id);
CREATE INDEX idx_resources_org_id ON catalog.resources (organization_id);
```

Key EPB conventions:

- `public_id` — client-facing identifier; internal `id` stays private
- `tenant_id` — required on every tenant-scoped table
- `version` — optimistic concurrency
- `deleted_at` — soft delete; queries filter `WHERE deleted_at IS NULL`
- Unique constraints scoped to tenant, not global

**Expected result:** Schema reviewed; ADR written if deviating from standards.

### Step 2: Create the migration

```bash
cd services/application/catalog
epb migrate create create_resources_table
```

Paste the SQL into the migration file. Apply:

```bash
epb migrate up
```

**Expected result:** `\d catalog.resources` shows all columns and indexes.

### Step 3: Define the Persistence Entity

Create `services/application/catalog/persistence/entities/ResourceEntity.ts`:

```typescript
/**
 * Persistence mapping for catalog.resources.
 * NEVER expose this type via API — map to ResourceResponse.
 */
export class ResourceEntity {
  id!: number;                    // internal surrogate — never expose
  publicId!: string;              // UUID exposed as Response DTO id
  tenantId!: string;
  code!: string;
  displayName!: string;
  organizationId!: string;
  status!: string;
  metadataJson!: Record<string, string> | null;
  version!: number;
  createdAt!: Date;
  createdBy!: string;
  updatedAt!: Date;
  updatedBy!: string;
  deletedAt!: Date | null;
}
```

Add ORM decorators per your framework (JPA `@Entity`, TypeORM `@Column`, EF `[Table]`, etc.) in the adapter layer. Keep the canonical field list in shared documentation.

**Expected result:** Entity fields match migration columns one-to-one.

### Step 4: Implement the repository

Create `persistence/repositories/ResourceRepository.ts`:

```typescript
export interface ResourceRepository {
  findByPublicId(tenantId: string, publicId: string): Promise<ResourceEntity | null>;
  findByCode(tenantId: string, code: string): Promise<ResourceEntity | null>;
  save(entity: ResourceEntity): Promise<ResourceEntity>;
  list(tenantId: string, page: PaginationParams): Promise<PagedResult<ResourceEntity>>;
  softDelete(tenantId: string, publicId: string, deletedBy: string): Promise<void>;
}
```

Every query method takes `tenantId` as the first parameter. Never query without tenant scope:

```sql
-- CORRECT
SELECT * FROM catalog.resources
WHERE tenant_id = :tenantId AND public_id = :publicId AND deleted_at IS NULL;

-- WRONG — cross-tenant data leak
SELECT * FROM catalog.resources WHERE public_id = :publicId;
```

**Expected result:** Repository interface has no method that omits tenant filtering.

### Step 5: Implement optimistic concurrency

On update, increment `version` and check the expected value:

```typescript
async update(entity: ResourceEntity, expectedVersion: number): Promise<ResourceEntity> {
  const result = await this.db.execute(
    `UPDATE catalog.resources
     SET display_name = $1, status = $2, version = version + 1, updated_at = NOW()
     WHERE tenant_id = $3 AND public_id = $4 AND version = $5 AND deleted_at IS NULL
     RETURNING *`,
    [entity.displayName, entity.status, entity.tenantId, entity.publicId, expectedVersion]
  );
  if (result.rowCount === 0) {
    throw new ConcurrencyConflictException('Resource was modified by another request');
  }
  return mapRow(result.rows[0]);
}
```

Return `409 Conflict` when version mismatch occurs.

**Expected result:** Concurrent updates do not silently overwrite each other.

### Step 6: Add audit columns on write

Set audit fields in the repository or a shared interceptor:

```typescript
entity.createdAt = new Date();
entity.createdBy = command.createdBy;
entity.updatedAt = entity.createdAt;
entity.updatedBy = command.createdBy;
```

Mutations also emit audit events to the audit platform service — see [Audit Integration](39-audit-integration.md).

**Expected result:** Every row has `created_by` and `updated_by` populated.

### Step 7: Write repository tests

```bash
cd services/application/catalog
npm test -- ResourceRepository.integration.test.ts
```

Test cases:

| Case | Assert |
|------|--------|
| Save and find by public ID | Entity round-trips correctly |
| Unique code per tenant | Duplicate code in same tenant fails |
| Same code, different tenant | Both succeed (tenant-scoped uniqueness) |
| Soft delete | `findByPublicId` returns null; row has `deleted_at` |
| Cross-tenant read | Tenant A cannot read Tenant B's resource |
| Optimistic concurrency | Second update with stale version throws |

**Expected result:** All integration tests pass against local Postgres.

### Step 8: Enforce the no-exposure rule

Add an architectural test or lint rule:

```typescript
// tests/architecture/entity-exposure.test.ts
it('controllers never import ResourceEntity', () => {
  const controllerFiles = glob('api/controllers/**/*.ts');
  for (const file of controllerFiles) {
    expect(read(file)).not.toContain('ResourceEntity');
  }
});
```

**Expected result:** CI fails if a controller imports an entity class.

## Verification

- [ ] Migration creates table with `tenant_id`, audit columns, `version`, `deleted_at`
- [ ] Unique constraints scoped to `(tenant_id, code)`
- [ ] Indexes on `tenant_id` and `public_id`
- [ ] Entity in `persistence/entities/` — not in shared contracts
- [ ] Repository enforces tenant scope on every query
- [ ] Optimistic concurrency on updates
- [ ] Soft delete implemented
- [ ] Entity never imported in `api/` layer
- [ ] Integration tests cover tenant isolation

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Cross-tenant data visible | Missing `tenant_id` in WHERE | Add tenant filter to all repository methods |
| Duplicate key on code | Global unique constraint | Scope uniqueness to `(tenant_id, code)` |
| 409 on every update | Version not incremented | Check UPDATE sets `version = version + 1` |
| Entity fields don't match DB | Migration drift | Regenerate entity from migration or vice versa |
| N+1 queries on list | Eager loading misconfigured | Use JOIN or batch fetch in repository |

## Reference

- Entity standards: [Entity Standards](../Volume-1-Foundation/16-entity-standards.md)
- Migrations: [Database Migrations](29-database-migrations.md)
- Multi-tenant: [Multi-Tenant Setup](48-multi-tenant-setup.md)
- Next: [Create Mapper](09-create-mapper.md)

## Related Chapters

- [Previous: Create Response DTO](07-create-response-dto.md)
- [Next: Create Mapper](09-create-mapper.md)
- [Create Domain Model](10-create-domain-model.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
