# How to Create a New API

> **Volume:** 3 | **Chapter ID:** v3-05 | **Status:** reviewed

## What You Will Accomplish

You will add a versioned REST endpoint to an EPB service, wire it through the BFF, document it in OpenAPI, and verify the full request/response cycle. This guide implements `POST /api/v1/resources` and `GET /api/v1/resources/{id}` on the catalog service.

## Prerequisites

- [Create New Service](04-create-new-service.md) completed (catalog service running)
- [DTO Standards](../Volume-1-Foundation/15-dto-standards.md) reviewed
- [API Standards](../Volume-1-Foundation/18-api-standards.md) reviewed
- Request and Response DTOs defined (or created alongside this guide — see chapters 06 and 07)

## API Design Checklist

Before writing code, confirm:

| Decision | EPB convention |
|----------|----------------|
| URL prefix | `/api/v1/<resource-plural>` |
| HTTP verbs | `GET` read, `POST` create, `PUT` full update, `PATCH` partial, `DELETE` soft-delete |
| Auth | Enforced at BFF; service validates tenant context |
| Response envelope | Standard success/error wrapper from platform library |
| Idempotency | `POST` create uses client idempotency key header when supported |
| Pagination | `GET` list uses `page`, `pageSize`, `sort` query params |

## Steps

### Step 1: Define the OpenAPI contract first

Create or extend `packages/shared-contracts/openapi/catalog-v1.yaml`:

```yaml
paths:
  /api/v1/resources:
    post:
      operationId: createResource
      summary: Create a resource
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateResourceRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResourceResponse'
    get:
      operationId: listResources
      summary: List resources
      parameters:
        - $ref: '#/components/schemas/PaginationParams'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PagedResourceListResponse'

  /api/v1/resources/{id}:
    get:
      operationId: getResource
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResourceResponse'
```

API-first means the contract exists before the controller implementation.

**Expected result:** OpenAPI validates without schema errors.

### Step 2: Create the controller

Add `services/application/catalog/api/controllers/resource.controller.ts`:

```typescript
// Illustrative — adapt to your framework
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  async create(req: Request, res: Response) {
    const request = req.body as CreateResourceRequest;
    const command = ResourceMapper.toCreateCommand(request, req.context);
    const resource = await this.resourceService.create(command);
    const response = ResourceMapper.toResponse(resource);
    return res.status(201).json(wrapSuccess(response));
  }

  async getById(req: Request, res: Response) {
    const resource = await this.resourceService.getById(
      req.params.id,
      req.context.tenantId
    );
    if (!resource) return res.status(404).json(wrapNotFound('Resource'));
    return res.json(wrapSuccess(ResourceMapper.toResponse(resource)));
  }

  async list(req: Request, res: Response) {
    const page = parsePagination(req.query);
    const result = await this.resourceService.list(page, req.context.tenantId);
    return res.json(wrapSuccess(ResourceMapper.toPagedResponse(result)));
  }
}
```

Controllers stay thin: validate input, call domain service, map response, return standard envelope.

**Expected result:** Controller compiles; no business logic inside the controller class.

### Step 3: Register routes

Add `services/application/catalog/api/routes/resource.routes.ts`:

```typescript
router.post('/api/v1/resources', authorize('resource:create'), resourceController.create);
router.get('/api/v1/resources', authorize('resource:read'), resourceController.list);
router.get('/api/v1/resources/:id', authorize('resource:read'), resourceController.getById);
```

Mount in `api/routes/index.ts`:

```typescript
app.use(resourceRoutes);
app.use(healthRoutes);
```

**Expected result:** `GET /api/v1/resources` returns 401 without auth, not 404.

### Step 4: Implement the domain service method

Add `domain/services/resource.service.ts`:

```typescript
async create(command: CreateResourceCommand): Promise<Resource> {
  await this.validateUniqueCode(command.tenantId, command.code);
  const domain = Resource.create(command);
  const entity = ResourceMapper.toEntity(domain);
  const saved = await this.repository.save(entity);
  await this.eventPublisher.publish(new ResourceCreatedEvent(saved));
  await this.auditClient.log('resource.created', saved.id, command.createdBy);
  return ResourceMapper.toDomain(saved);
}
```

Mutations emit audit events and domain events per EPB standards.

**Expected result:** Service method has unit tests with mocked repository and event publisher.

### Step 5: Register BFF proxy routes

Frontend traffic never hits the catalog service directly. Add to `apps/bff-web/api/routes/resources.routes.ts`:

```typescript
router.post('/api/v1/resources', authenticate, validate(CreateResourceRequest), async (req, res) => {
  const response = await catalogClient.post('/api/v1/resources', req.body, forwardHeaders(req));
  return res.status(response.status).json(response.data);
});

router.get('/api/v1/resources/:id', authenticate, async (req, res) => {
  const response = await catalogClient.get(`/api/v1/resources/${req.params.id}`, forwardHeaders(req));
  return res.status(response.status).json(response.data);
});
```

The BFF forwards `Authorization`, `X-Tenant-Id`, and `X-Correlation-Id` headers.

**Expected result:** Frontend calls `http://localhost:3000/api/v1/resources`, not port 8085.

### Step 6: Add authorization rules

Register permissions in the identity service (or local config for dev):

```text
resource:create  → roles: editor, admin
resource:read    → roles: viewer, editor, admin
resource:update  → roles: editor, admin
resource:delete  → roles: admin
```

**Expected result:** User without `resource:create` receives 403 from BFF before the catalog service is called.

### Step 7: Write API tests

```bash
cd services/application/catalog

# Unit test — controller
npm test -- resource.controller.test.ts

# Integration test — full HTTP cycle
npm test -- resource.api.integration.test.ts
```

Integration test example flow:

1. `POST /api/v1/resources` with valid body → 201, returns `id`
2. `GET /api/v1/resources/{id}` → 200, matches created resource
3. `GET /api/v1/resources/{id}` with wrong tenant → 404

**Expected result:** All tests green.

### Step 8: Manual verification

```bash
TOKEN="<dev-token>"

# Create
curl -s -X POST http://localhost:3000/api/v1/resources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"RES-001","displayName":"Primary Resource","organizationId":"org_local"}' | jq .

# Read
curl -s http://localhost:3000/api/v1/resources/res_<id> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected result:** Create returns 201 with `id`, `code`, `displayName`, `status`. Read returns the same resource.

## Verification

- [ ] OpenAPI spec updated and validates
- [ ] Controller delegates to domain service (no fat controller)
- [ ] Routes registered with authorization middleware
- [ ] BFF proxies routes; frontend URL is BFF only
- [ ] Tenant isolation enforced on reads and writes
- [ ] Audit event emitted on create
- [ ] Domain event published on create
- [ ] Unit and integration tests pass
- [ ] Manual curl through BFF succeeds

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| 404 from BFF | Route not registered in BFF | Add proxy route; restart BFF |
| 404 from service, 200 from BFF | Wrong path prefix | Align `/api/v1` prefix in service and BFF |
| 400 validation error | Request DTO mismatch | Compare body to `CreateResourceRequest` schema |
| 403 on all calls | Missing permission | Assign `resource:*` permissions to dev user |
| 500 on create | Migration not applied | Run `epb migrate up` for catalog service |
| Response missing fields | Mapper incomplete | Check `ResourceMapper.toResponse` |

## Reference

- API standards: [API Standards](../Volume-1-Foundation/18-api-standards.md)
- Error format: [Error Handling Implementation](59-error-handling-implementation.md)
- Pagination: [Pagination Implementation](60-pagination-implementation.md)
- BFF patterns: [BFF Aggregation Patterns](44-bff-aggregation-patterns.md)
- API versioning: [API Versioning](30-api-versioning.md)

## Related Chapters

- [Previous: Create New Service](04-create-new-service.md)
- [Next: Create Request DTO](06-create-request-dto.md)
- [Create Response DTO](07-create-response-dto.md)
- [Create Mapper](09-create-mapper.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
