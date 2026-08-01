# How to Create a New Service

> **Volume:** 3 | **Chapter ID:** v3-04 | **Status:** reviewed

## What You Will Accomplish

You will scaffold a new application or platform service in the EPB monorepo, wire it to shared libraries and infrastructure, register it with the BFF, and verify it responds on `/health`. This walkthrough creates `catalog` as an example application service managing generic **resources**.

## Prerequisites

- [Project Setup](01-project-setup.md) and [Development Environment](02-development-environment.md) completed
- [Repository Structure](03-repository-structure.md) understood
- Decision recorded: platform service (`services/platform/`) vs application service (`services/application/`)
- Familiarity with [Independent Services](../Volume-1-Foundation/14-independent-services.md)

## Steps

### Step 1: Choose service type and name

| Type | Path | When to use |
|------|------|-------------|
| Platform | `services/platform/<name>/` | Reusable across all products (auth, notifications) |
| Application | `services/application/<name>/` | Domain logic for one product |

Service names are lowercase, hyphen-separated: `catalog`, `resource-registry`, `identity`.

**Expected result:** You know the service name, type, and owning team.

### Step 2: Create the folder structure

From the monorepo root:

```bash
SERVICE_NAME=catalog
SERVICE_TYPE=application   # or "platform"

BASE="services/${SERVICE_TYPE}/${SERVICE_NAME}"

mkdir -p "${BASE}"/{api/controllers,api/routes,domain/models,domain/services,persistence/entities,persistence/repositories,mappers,events/publishers,events/handlers,config,tests/unit,tests/integration,migrations}

touch "${BASE}/README.md"
touch "${BASE}/.env.example"
```

Resulting layout (matches [Service Scaffold](../Templates/service-scaffold.md)):

```text
services/application/catalog/
├── api/
│   ├── controllers/
│   └── routes/
├── domain/
│   ├── models/
│   └── services/
├── persistence/
│   ├── entities/
│   └── repositories/
├── mappers/
├── events/
│   ├── publishers/
│   └── handlers/
├── config/
├── migrations/
├── tests/
│   ├── unit/
│   └── integration/
├── README.md
└── .env.example
```

**Expected result:** All directories exist; `tree services/application/catalog` shows the scaffold.

### Step 3: Generate service boilerplate

Use the developer CLI when available:

```bash
epb generate service \
  --name catalog \
  --type application \
  --output services/application/catalog
```

If the CLI is not installed, copy from the reference service:

```bash
cp -r services/application/_template/* services/application/catalog/
# Remove template placeholders; rename Resource → Catalog as needed
```

Minimum files to create manually:

| File | Purpose |
|------|---------|
| `config/app.config.ts` | Port, database URL, feature flags |
| `api/routes/index.ts` | Route registration |
| `api/controllers/health.controller.ts` | Liveness/readiness |
| `domain/services/catalog.service.ts` | Business logic entry point |
| `persistence/repositories/resource.repository.ts` | Data access |
| `tests/unit/health.controller.test.ts` | Smoke test |

**Expected result:** Service has an entry point (`main.ts`, `Program.cs`, or `Application.java` depending on stack).

### Step 4: Configure service-specific environment

Create `services/application/catalog/.env.example`:

```bash
SERVICE_NAME=catalog
SERVICE_PORT=8085
DATABASE_URL=postgresql://epb:epb@localhost:5432/catalog_dev
DATABASE_SCHEMA=catalog
REDIS_URL=redis://localhost:6379/5
MESSAGE_BROKER_URL=amqp://guest:guest@localhost:5672
LOG_LEVEL=debug
```

Add to root `.env` or use per-service env loading. Each service owns its database schema — never share tables with another service.

**Expected result:** Service starts with `SERVICE_PORT=8085` without conflicting with other services.

### Step 5: Add shared library dependency

Reference `packages/shared-contracts` for DTOs and enums:

```bash
# Node example
cd services/application/catalog
npm install @epb/shared-contracts@workspace:*
```

Register the package in the workspace manifest (`package.json`, `pom.xml`, or `go.work`). Shared libraries are the single source of truth for contracts — do not duplicate DTOs inside the service.

**Expected result:** Import `@epb/shared-contracts/catalog` resolves without error.

### Step 6: Create the database and run migrations

```bash
# Create database (Postgres example)
docker exec -it epb-postgres createdb -U epb catalog_dev

# Add initial migration
cd services/application/catalog
epb migrate create init_schema
epb migrate up
```

Initial migration should create:

- `resources` table with `tenant_id`, audit columns, soft-delete flag
- Tenant discriminator index
- Optimistic concurrency column (`version` or `row_version`)

**Expected result:** `\dt` in `catalog_dev` shows the `resources` table.

### Step 7: Implement health check

Every service exposes `/health` and `/ready`:

```text
GET /health  → { "status": "UP", "service": "catalog" }
GET /ready   → checks database and message broker connectivity
```

Follow [Health Check Implementation](57-health-check-implementation.md).

**Expected result:**

```bash
curl -s http://localhost:8085/health | jq .
# { "status": "UP", "service": "catalog" }
```

### Step 8: Register the service

1. **Service registry / API gateway** — add `catalog` to `infrastructure/k8s/services/catalog.yaml` or gateway config
2. **BFF routing** — add internal route in `apps/bff-web/config/services.ts`:

```typescript
export const serviceRoutes = {
  catalog: process.env.CATALOG_SERVICE_URL ?? 'http://localhost:8085',
};
```

3. **Observability** — register in monitoring config with service name `catalog`
4. **Documentation** — update `services/application/catalog/README.md` with purpose, ports, and owned entities

**Expected result:** BFF can proxy `GET /api/v1/resources` to the catalog service (even if the handler returns 501 initially).

### Step 9: Add to CI pipeline

Add the service to the monorepo CI matrix in `.github/workflows/ci.yml` (or equivalent):

```yaml
- name: Test catalog service
  run: make test-catalog
```

**Expected result:** Pull requests touching `services/application/catalog/` trigger that service's test job.

### Step 10: Commit the scaffold

```bash
git add services/application/catalog
git commit -m "feat(catalog): scaffold application service"
```

## Verification

- [ ] Folder structure matches EPB scaffold template
- [ ] Service owns a dedicated database schema
- [ ] Shared library dependency resolves
- [ ] `/health` and `/ready` return 200
- [ ] BFF has an internal route to the service (not exposed to frontend directly)
- [ ] Initial migration applied
- [ ] Unit tests pass
- [ ] CI job includes the new service
- [ ] README documents ports, env vars, and owned entities

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Port conflict on start | `SERVICE_PORT` matches another service | Choose unused port; update BFF config |
| Cannot connect to database | Wrong `DATABASE_URL` or DB not created | Create DB; verify Docker Postgres is running |
| Shared package not found | Workspace link missing | Run `make build-packages`; check workspace config |
| BFF returns 502 | Service not running or wrong URL | Verify `CATALOG_SERVICE_URL`; check service logs |
| Migration fails on `tenant_id` | Missing tenant column pattern | Follow [Entity Standards](../Volume-1-Foundation/16-entity-standards.md) |

## Reference

- Scaffold template: [Templates/service-scaffold.md](../Templates/service-scaffold.md)
- Code generator: [Code Generator Usage](70-code-generator-usage.md)
- Developer CLI: [Developer CLI Usage](69-developer-cli-usage.md)
- Naming: [Naming Standards Reference](23-naming-standards-reference.md)
- Multi-tenant: [Multi-Tenant Setup](48-multi-tenant-setup.md)

## Related Chapters

- [Previous: Repository Structure](03-repository-structure.md)
- [Next: Create New API](05-create-new-api.md)
- [Create Entity](08-create-entity.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
