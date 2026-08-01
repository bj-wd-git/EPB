# Repository Structure Guide

> **Volume:** 3 | **Chapter ID:** v3-03 | **Status:** reviewed

## What You Will Accomplish

You will navigate the EPB monorepo, understand where services, shared libraries, BFF, frontend, and infrastructure code live, and verify your local clone matches the expected layout.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- Git clone of the monorepo on your machine

## Steps

### Step 1: Clone and inspect the monorepo root

```bash
git clone <repo-url> epb && cd epb
ls -la
```

Expected top-level structure:

```text
epb/
├── services/
│   ├── platform/       # Reusable platform services
│   └── application/    # Product-specific services
├── libs/               # Shared libraries (DTOs, validators, clients)
├── bff/                # Backend For Frontend aggregation layer
├── frontend/           # Web application shell
├── infrastructure/     # IaC, Docker Compose, K8s manifests
├── docs/               # Handbook, glossary, manifest
├── Templates/          # Service scaffolds
└── Checklists/         # Review checklists
```

**Expected result:** All top-level directories present.

### Step 2: Explore a platform service layout

```bash
tree services/platform/auth -L 2
```

Every service follows the same internal structure per [Folder Structure](../Volume-1-Foundation/23-folder-structure.md):

```text
services/platform/auth/
├── api/           # Controllers, routes, OpenAPI spec
├── domain/        # Business logic, domain models
├── persistence/   # Entities, repositories
├── mappers/       # DTO ↔ Entity conversion
├── events/        # Publishers and handlers
├── config/        # Service configuration
├── migrations/    # Database migrations
└── tests/         # Unit and integration tests
```

**Expected result:** Layer directories exist; no business logic in `api/`.

### Step 3: Locate shared libraries

```bash
ls libs/
```

Shared libraries contain cross-service types:

| Library | Contents |
|---------|----------|
| `libs/dto/` | Request/Response DTOs shared across services |
| `libs/validators/` | Common validation rules |
| `libs/clients/` | Generated API client SDKs |
| `libs/logging/` | Structured logging utilities |

Import from shared libraries — never duplicate DTOs in individual services.

**Expected result:** You can identify which library to import for a given type.

### Step 4: Find handbook and templates

```bash
ls Volume-1-Foundation/ Volume-3-Developer-Guide/ Templates/
```

- **Volume 1** — architecture standards (read before coding)
- **Volume 3** — step-by-step guides (follow when building)
- **Templates/** — scaffolds for new services, DTOs, entities

**Expected result:** You know where to find standards vs how-to guides.

### Step 5: Verify service isolation

Confirm no service imports another service's `persistence/` or `domain/` directly:

```bash
# Should return zero results
grep -r "from.*services/.*/persistence" services/ --include="*.ts" | head
```

Services communicate via HTTP APIs or events only.

**Expected result:** No cross-service internal imports.

## Verification

- [ ] Monorepo root structure matches expected layout
- [ ] At least one platform and one application service inspected
- [ ] Shared libraries location identified
- [ ] No cross-service persistence imports found

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Missing `libs/` directory | Partial clone or old branch | `git pull origin main` |
| Service missing layer folders | Scaffold not applied | Run `epb generate service` or copy from Templates |
| Import errors on shared lib | Lib not built | `npm run build:libs` from root |

## Reference

- [Folder Structure](../Volume-1-Foundation/23-folder-structure.md)
- [Naming Conventions](../Volume-1-Foundation/24-naming-conventions.md)
- [Service Scaffold](../Templates/service-scaffold.md)

## Related Chapters

- [Previous: Development Environment](02-development-environment.md)
- [Next: Create New Service](04-create-new-service.md)
- [Create New Service](04-create-new-service.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
