# Anti-Patterns Catalog

> **Volume:** 3 | **Chapter ID:** v3-73 | **Status:** reviewed

## What You Will Accomplish

You will recognize the most common EPB violations, understand why each one fails at scale, and apply the documented fix during development and code review. Use this catalog as a checklist before opening a pull request.

## Prerequisites

- [Layered Architecture](../Volume-1-Foundation/06-layered-architecture.md) understood
- [DTO Standards](../Volume-1-Foundation/15-dto-standards.md) and [Model Separation](../Volume-1-Foundation/11-model-separation.md) reviewed
- At least one service created ([Create New Service](04-create-new-service.md))

## How to Use This Catalog

1. Scan the **Layer** column to find violations relevant to your change
2. During code review, search the diff for symptoms in the **Detection** column
3. Apply the **Preferred Approach** before merging
4. Link to this chapter in review comments for shared vocabulary

Severity levels:

| Level | Meaning |
|-------|---------|
| **Critical** | Security risk or data integrity failure — block merge |
| **High** | Breaks architectural boundaries — block merge |
| **Medium** | Causes maintenance debt — fix before release |
| **Low** | Convention violation — fix in same PR or immediate follow-up |

## Anti-Patterns

### Layer and Architecture

| # | Anti-Pattern | Layer | Why It Fails | Detection | Preferred Approach | Severity |
|---|--------------|-------|--------------|-----------|-------------------|----------|
| 1 | **Frontend calls platform services directly** | Frontend → Service | Bypasses BFF auth, exposes internal URLs, creates N+1 client calls | `fetch('http://identity:8081/...')` in frontend code | All client traffic through BFF; service URLs in BFF config only | Critical |
| 2 | **BFF accesses databases** | BFF | Blurs edge and persistence layers; duplicates data logic | SQL imports or ORM entities in `apps/bff-*` | BFF calls services; services own data | Critical |
| 3 | **Business logic in BFF** | BFF | Untestable duplication; rules diverge across client types | `if (status === 'ACTIVE' && ...)` in BFF handlers | Orchestration only; rules in domain services | High |
| 4 | **God service spanning layers** | Service | Cannot deploy or scale independently | Single repo folder contains UI, API, and DB code | Split by layer and bounded context | High |
| 5 | **Skipping shared libraries** | Shared | DTO drift, validation mismatch, contract breaking | Duplicate `CreateResourceRequest` in two services | One canonical package in `packages/shared-contracts` | High |
| 6 | **Shared library contains business logic** | Shared | All consumers coupled to one domain | `if/else` rules, service calls inside `packages/` | Types, validators, interfaces only; logic in services | High |

### Model and Mapping

| # | Anti-Pattern | Layer | Why It Fails | Detection | Preferred Approach | Severity |
|---|--------------|-------|--------------|-----------|-------------------|----------|
| 7 | **One model for all layers** | Service | API coupled to database schema; breaks encapsulation | Same class used in controller and repository | Five model types with explicit mappers | Critical |
| 8 | **Exposing Persistence Entity via API** | Service | Leaks schema, blocks evolution, may expose tenant data | Controller returns `ResourceEntity` | Map Entity → Response DTO in mapper | Critical |
| 9 | **Business logic in DTOs** | API | Untestable; duplicated across services | Methods on Request/Response classes | Rules in Domain Model; DTOs are data only | High |
| 10 | **Fat Request DTO (50+ fields)** | API | Unclear contract; hard to version | Single `ResourceRequest` for create, update, and patch | Separate DTO per operation; nest related fields | Medium |
| 11 | **Mapper with database access** | Mapper | Hidden queries; untestable mapping | Repository injected into mapper class | Mapper is pure function; repository in service | High |
| 12 | **Inline field copying in controllers** | API | Mapping logic scattered; inconsistent responses | `{ id: entity.publicId, code: entity.code }` in controller | Centralize in `ResourceMapper` | Medium |

### Data and Multi-Tenancy

| # | Anti-Pattern | Layer | Why It Fails | Detection | Preferred Approach | Severity |
|---|--------------|-------|--------------|-----------|-------------------|----------|
| 13 | **Query without tenant scope** | Persistence | Cross-tenant data leak | `WHERE id = :id` without `tenant_id` | Every query filters by `tenant_id` from auth context | Critical |
| 14 | **Trusting client-supplied tenantId** | API | Tenant impersonation | `tenantId` field in request body used directly | Resolve tenant from auth token; reject body override | Critical |
| 15 | **Direct database sharing between services** | Infrastructure | Tight coupling; schema changes break consumers | Two services connect to same tables | API or event integration; each service owns its schema | Critical |
| 16 | **Global unique constraint (not tenant-scoped)** | Persistence | Prevents valid data in multi-tenant setup | `UNIQUE(code)` without `tenant_id` | `UNIQUE(tenant_id, code)` | High |
| 17 | **Hard delete by default** | Persistence | Audit trail loss; recovery impossible | `DELETE FROM resources` | Soft delete with `deleted_at`; filter in queries | Medium |

### API and Integration

| # | Anti-Pattern | Layer | Why It Fails | Detection | Preferred Approach | Severity |
|---|--------------|-------|--------------|-----------|-------------------|----------|
| 18 | **Synchronous BFF chain of 10+ calls** | BFF | Latency, cascading failures | Sequential `await` in loop for each item | Parallel calls; aggregate endpoint; or event-driven | High |
| 19 | **Non-standard error responses** | API | Clients cannot handle errors uniformly | `{ error: "something broke" }` without code | Standard error envelope with `code`, `message`, `details` | Medium |
| 20 | **Missing API versioning** | API | Breaking changes break all clients | Routes at `/resources` with no version prefix | `/api/v1/resources`; breaking changes in v2 | High |
| 21 | **No idempotency on create** | API | Duplicate records on retry | `POST` creates new row on every network retry | Idempotency key header or natural key dedup | Medium |

### Security and Operations

| # | Anti-Pattern | Layer | Why It Fails | Detection | Preferred Approach | Severity |
|---|--------------|-------|--------------|-----------|-------------------|----------|
| 22 | **Secrets in source code or `.env` committed** | Infra | Credential leak | API keys in git history | Secrets manager; `.env` in `.gitignore` | Critical |
| 23 | **Missing audit on mutations** | Service | Compliance failure; no forensic trail | `POST/PUT/DELETE` with no audit event | Emit audit event per [Audit Integration](39-audit-integration.md) | High |
| 24 | **No health check endpoint** | Service | Orchestrator cannot detect failures | Service missing `/health` or `/ready` | Implement per [Health Check Implementation](57-health-check-implementation.md) | Medium |
| 25 | **Logging without correlation ID** | All | Cannot trace requests across services | Log lines without `correlationId` field | Propagate `X-Correlation-Id` from BFF through all calls | Medium |

### Testing and Process

| # | Anti-Pattern | Layer | Why It Fails | Detection | Preferred Approach | Severity |
|---|--------------|-------|--------------|-----------|-------------------|----------|
| 26 | **No tenant isolation test** | Test | Cross-tenant bug ships to production | Integration tests use single tenant only | Test Tenant A cannot read Tenant B data | High |
| 27 | **Copy-paste service scaffold** | Process | Drift from standards; missing hooks | New service missing events, audit, health | Use `epb generate service` or [Service Scaffold](../Templates/service-scaffold.md) | Medium |
| 28 | **Domain-specific examples in platform code** | Platform | Platform unusable for other products | `Patient`, `Invoice` in `services/platform/` | Generic terms: resource, entity, organization | Medium |

## Quick Reference by Symptom

| You see... | Likely anti-pattern # | First action |
|------------|----------------------|--------------|
| Entity class imported in controller | 8 | Add mapper; return Response DTO |
| `tenantId` in request JSON body | 14 | Remove field; use auth context |
| Frontend env var with service URL | 1 | Route through BFF |
| Same DTO class in two packages | 5 | Move to `shared-contracts` |
| SQL in BFF handler | 2 | Move query to owning service |
| 500 errors with no error code | 19 | Use standard error envelope |
| Duplicate rows after retry | 21 | Add idempotency key |

## Prevention Checklist

Run before every pull request:

- [ ] No entity types cross the HTTP boundary
- [ ] Every repository query includes `tenant_id`
- [ ] DTOs live in `packages/shared-contracts`
- [ ] Mappers are the only conversion point between model types
- [ ] BFF has no database imports and no business rules
- [ ] Frontend has no backend service URLs
- [ ] Mutations emit audit events
- [ ] Integration tests verify tenant isolation
- [ ] Health endpoints respond on new services
- [ ] OpenAPI updated for API changes

## Verification

Use this catalog during review:

- [ ] Identified zero Critical anti-patterns in the diff
- [ ] High-severity items addressed or tracked with linked issue
- [ ] Prevention checklist completed for the changed service

## Troubleshooting

| Symptom | Likely anti-patterns | Fix |
|---------|---------------------|-----|
| 403 only in production | 14 (tenant mismatch) | Align auth token tenant with test data |
| Slow dashboard load | 18 (BFF call chain) | Parallelize or add aggregation endpoint |
| Client breaks after DB migration | 7, 8 (model coupling) | Response DTO shields clients from schema |
| Duplicate resources on retry | 21 | Add `Idempotency-Key` header handling |
| Cannot trace request across logs | 25 | Propagate correlation ID in BFF middleware |

## Reference

- Layer rules: [Layered Architecture](../Volume-1-Foundation/06-layered-architecture.md)
- BFF scope: [BFF Layer](../Volume-1-Foundation/08-bff-layer.md)
- DTO rules: [DTO Standards](../Volume-1-Foundation/15-dto-standards.md)
- Code review: [Code Review Checklist](22-code-review-checklist.md)
- Security: [Security Checklist](21-security-checklist.md)

## Related Chapters

- [Previous: Sample Service Walkthrough](72-sample-service-walkthrough.md)
- [Next: Troubleshooting Guide](74-troubleshooting-guide.md)
- [Create Mapper](09-create-mapper.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
