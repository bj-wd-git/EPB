# How to Set Up the EPB Monorepo

> **Volume:** 3 | **Chapter ID:** v3-01 | **Status:** reviewed

## What You Will Accomplish

You will clone the EPB monorepo, install prerequisites, configure local environment variables, and verify that the workspace builds and runs. When finished, you can start any service locally and follow the rest of Volume 3.

## Prerequisites

- Git 2.40 or later
- Docker Desktop 4.x (or Docker Engine + Compose v2) for local infrastructure
- A supported language runtime for your stack (see [Development Environment](02-development-environment.md))
- Access to the organization Git remote and package registry
- Familiarity with [Layered Architecture](../Volume-1-Foundation/06-layered-architecture.md) and [Folder Structure](../Volume-1-Foundation/23-folder-structure.md)

## Monorepo Layout

EPB uses a single repository for frontends, BFFs, platform services, application services, shared libraries, and infrastructure. Every team works from the same root so contracts stay aligned.

```text
epb-platform/
├── apps/
│   ├── web/                    # Primary frontend SPA
│   ├── admin/                  # Admin portal (optional)
│   └── bff-web/                # BFF for web client
├── services/
│   ├── platform/               # Reusable platform capabilities
│   │   ├── identity/
│   │   ├── notification/
│   │   └── audit/
│   └── application/            # Domain-specific product services
│       └── catalog/            # Example application service
├── packages/
│   ├── shared-contracts/       # DTOs, enums, validators (canonical)
│   ├── shared-kernel/          # Cross-cutting utilities
│   └── shared-testing/         # Test fixtures and mocks
├── infrastructure/
│   ├── docker/                 # Compose files, local images
│   ├── k8s/                    # Deployment manifests
│   └── terraform/              # Cloud provisioning (optional)
├── docs/                       # EPB handbook and ADRs
├── Templates/                  # Service and DTO scaffolds
├── Checklists/                 # Review and release checklists
├── scripts/                    # Workspace bootstrap scripts
├── .env.example                # Root environment template
├── Makefile                    # Common developer commands
└── README.md
```

Layer flow is fixed: **Frontend → BFF → Platform/Application Services → Shared Libraries → Infrastructure**. No layer skips its neighbor.

```mermaid
flowchart TB
  subgraph repo [EPB_Monorepo]
    Apps[apps]
    Svc[services]
  end
  Apps --> Svc
  Svc --> Pkg[packages]
  Pkg --> Infra[infrastructure]
```

## Steps

### Step 1: Clone the repository

```bash
git clone https://github.com/<org>/epb-platform.git
cd epb-platform
```

**Expected result:** You are in the monorepo root with `apps/`, `services/`, and `packages/` visible.

### Step 2: Verify prerequisites

```bash
git --version
docker --version
docker compose version
```

Install any missing tools before continuing. On Windows, use WSL2 for Docker and shell scripts when your team standardizes on bash.

**Expected result:** All commands return version numbers without errors.

### Step 3: Bootstrap the workspace

Run the root bootstrap script (adjust for your stack):

```bash
# Unix / macOS / WSL
./scripts/bootstrap.sh

# Windows PowerShell
.\scripts\bootstrap.ps1
```

The bootstrap script typically:

1. Copies `.env.example` to `.env` if missing
2. Installs package manager dependencies (npm, pnpm, Maven, etc.)
3. Links local `packages/*` into services
4. Pulls base Docker images for Postgres, Redis, and the message broker

**Expected result:** `packages/` dependencies resolve and `.env` exists at the repo root.

### Step 4: Configure environment variables

Copy and edit the root environment file:

```bash
cp .env.example .env
```

Set these required values (names may vary by implementation):

| Variable | Purpose | Example |
|----------|---------|---------|
| `ENVIRONMENT` | Runtime profile | `local` |
| `LOG_LEVEL` | Log verbosity | `debug` |
| `DATABASE_URL` | Primary Postgres connection | `postgresql://epb:epb@localhost:5432/epb_dev` |
| `REDIS_URL` | Cache / session store | `redis://localhost:6379` |
| `MESSAGE_BROKER_URL` | Event bus | `amqp://guest:guest@localhost:5672` |
| `JWT_ISSUER` | Token issuer for local auth | `http://localhost:8080` |
| `BFF_BASE_URL` | Frontend API target | `http://localhost:3000` |

Never commit `.env`. Secrets for non-local environments belong in your secrets manager — see [Secrets Management](28-secrets-management.md).

**Expected result:** `.env` contains valid local connection strings matching `infrastructure/docker/docker-compose.yml`.

### Step 5: Start local infrastructure

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Wait for health checks:

```bash
docker compose -f infrastructure/docker/docker-compose.yml ps
```

**Expected result:** Postgres, Redis, and the message broker report `healthy` or `running`.

### Step 6: Run database migrations

Apply platform-wide and service-specific migrations:

```bash
make migrate
# or, per service:
cd services/platform/identity && make migrate
```

**Expected result:** Migration command completes with no pending revisions.

### Step 7: Build shared packages

Shared libraries must build before services that depend on them:

```bash
make build-packages
# equivalent:
cd packages/shared-contracts && <package-manager> build
```

**Expected result:** `packages/shared-contracts/dist` (or equivalent output) exists.

### Step 8: Smoke-test a service

Start the identity platform service and BFF:

```bash
make dev-identity    # starts services/platform/identity
make dev-bff-web     # starts apps/bff-web
```

Verify health:

```bash
curl -s http://localhost:8081/health | jq .
curl -s http://localhost:3000/health | jq .
```

**Expected result:** Both endpoints return HTTP 200 with a `status: "UP"` (or equivalent) payload.

## Verification

- [ ] Repository cloned; `git status` is clean or shows only your local `.env`
- [ ] Docker infrastructure containers are running
- [ ] `.env` configured; no secrets committed
- [ ] Shared packages build successfully
- [ ] At least one platform service and the BFF respond on `/health`
- [ ] You can open the frontend at the URL documented in `apps/web/README.md`

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `port already in use` | Another process holds 5432, 6379, or 3000 | Stop conflicting service or change ports in `.env` and `docker-compose.yml` |
| Package link errors | Shared library not built | Run `make build-packages` before starting services |
| Migration fails | Database not ready | Wait for Postgres health check; rerun `make migrate` |
| `401` on all BFF calls | Auth not configured locally | Set `JWT_ISSUER` and use dev token from identity service README |
| Docker permission denied | User not in `docker` group | Add user to group or run Docker Desktop as admin (Windows) |
| Slow first build | Cold dependency cache | Normal; subsequent builds use cache |

## Reference

- Monorepo service layout: [Repository Structure](03-repository-structure.md)
- Local tooling detail: [Development Environment](02-development-environment.md)
- Environment profiles: [Environment Configuration](27-environment-configuration.md)
- Standards: [Coding Standards](../Volume-1-Foundation/25-coding-standards.md)
- Templates: [Templates](../Templates/)
- Checklists: [Checklists](../Checklists/)

## Related Chapters

- [Next: Development Environment](02-development-environment.md)
- [Layered Architecture](../Volume-1-Foundation/06-layered-architecture.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
