# How to Configure the Development Environment

> **Volume:** 3 | **Chapter ID:** v3-02 | **Status:** reviewed

## What You Will Accomplish

You will configure your IDE, language toolchains, debugging, and local service orchestration so you can develop, test, and debug EPB services efficiently. When finished, you can run any service in watch mode, attach a debugger, and execute the test suite from your workstation.

## Prerequisites

- [Project Setup](01-project-setup.md) completed (repo cloned, `.env` configured, infrastructure running)
- Administrator rights to install IDE extensions and language runtimes
- Familiarity with [Testing Standards](../Volume-1-Foundation/27-testing-standards.md)

## Steps

### Step 1: Install language runtimes

EPB is framework-agnostic; your organization pins versions in `.tool-versions`, `mise.toml`, or `engines` in the root package manifest. Install the runtimes your services use:

| Stack | Typical use | Install check |
|-------|-------------|---------------|
| Node.js 20 LTS | Frontend, BFF, some services | `node --version` |
| Java 21 | Spring-based services | `java --version` |
| .NET 8 | Alternative service stack | `dotnet --version` |
| Python 3.12 | Workers, scripts | `python --version` |

Use a version manager (`mise`, `nvm`, `sdkman`) so all developers share the same versions.

**Expected result:** `make check-toolchain` (or equivalent) passes with no version mismatches.

### Step 2: Configure your IDE

Open the monorepo root — not an individual service folder — so cross-package navigation works.

**Recommended VS Code / Cursor extensions:**

| Extension | Purpose |
|-----------|---------|
| EditorConfig | Consistent formatting across languages |
| Docker | Manage compose stacks from IDE |
| REST Client or Thunder Client | Call BFF and service APIs |
| Language server for your stack | IntelliSense, refactor, diagnostics |

Import workspace settings from `.vscode/settings.json` if present. Key settings:

```json
{
  "editor.formatOnSave": true,
  "files.exclude": { "**/node_modules": true, "**/dist": true },
  "search.exclude": { "**/dist": true, "**/build": true }
}
```

**Expected result:** Opening `packages/shared-contracts` and `services/platform/identity` in the same workspace shows no broken imports.

### Step 3: Configure Git hooks

Install pre-commit hooks for lint and format checks:

```bash
./scripts/install-hooks.sh
```

Hooks typically run:

- Formatter (Prettier, Spotless, etc.)
- Linter (ESLint, Checkstyle, etc.)
- Secret scanner (blocks `.env` and credential patterns)

**Expected result:** `git commit` on a deliberately malformed file is rejected with a clear lint message.

### Step 4: Set up the integrated debugger

Each service includes a launch configuration. For VS Code, use `.vscode/launch.json`:

```json
{
  "configurations": [
    {
      "name": "Debug BFF Web",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/apps/bff-web",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "envFile": "${workspaceFolder}/.env"
    },
    {
      "name": "Debug Catalog Service",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/services/application/catalog",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

Set breakpoints in controllers and domain services — not in mappers unless mapping logic is complex.

**Expected result:** Hitting an API endpoint pauses execution at your breakpoint.

### Step 5: Start the development stack

Use the root Makefile for common workflows:

```bash
# All core platform services + BFF + frontend
make dev

# Individual targets
make dev-infra      # Docker only
make dev-platform   # identity, notification, audit
make dev-bff-web
make dev-web
```

Watch mode rebuilds on file save. Shared package changes may require restarting dependent services or running:

```bash
make watch-packages
```

**Expected result:** Terminal shows services listening on documented ports; frontend loads at `http://localhost:5173` (or your configured port).

### Step 6: Configure API testing tools

Import the workspace OpenAPI collection from `docs/api/` into Postman, Bruno, or REST Client.

For local auth, obtain a development token:

```bash
curl -s -X POST http://localhost:8081/auth/dev-token \
  -H "Content-Type: application/json" \
  -d '{"subject":"dev-user","tenantId":"tenant_local"}' | jq -r .accessToken
```

Store the token in your API client as `Bearer <token>`. The BFF requires this on all protected routes.

**Expected result:** `GET http://localhost:3000/api/v1/me` returns 200 with the dev user profile.

### Step 7: Run tests locally

```bash
# Full suite (may take several minutes)
make test

# Fast feedback loop — single service
cd services/application/catalog
npm test -- --watch

# Integration tests (requires Docker infra)
make test-integration
```

**Expected result:** Unit tests pass; integration tests connect to local Postgres and Redis.

### Step 8: Enable structured logging locally

Set in `.env`:

```bash
LOG_FORMAT=pretty
LOG_LEVEL=debug
CORRELATION_ID_HEADER=X-Correlation-Id
```

Tail aggregated logs:

```bash
make logs
# or per service:
docker compose -f infrastructure/docker/docker-compose.yml logs -f identity
```

**Expected result:** Log lines include `correlationId`, `tenantId`, and `serviceName` fields.

## Verification

- [ ] Toolchain versions match team standard
- [ ] IDE opens monorepo root with working IntelliSense
- [ ] Git hooks installed; format-on-save works
- [ ] Debugger attaches to BFF and at least one service
- [ ] `make dev` starts the stack without errors
- [ ] Authenticated API call succeeds against BFF
- [ ] `make test` passes for your area of work

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Import unresolved in IDE | Opened subfolder, not root | Reopen `epb-platform` root folder |
| Hot reload not picking up shared package changes | Symlink cache stale | Restart service; run `make build-packages` |
| Integration tests fail with connection refused | Infra not running | `make dev-infra` then retry |
| Debugger won't attach | Wrong `cwd` or port in use | Check `launch.json`; kill process on service port |
| `EACCES` on hooks script | Missing execute permission | `chmod +x scripts/install-hooks.sh` |
| Token expired | Dev JWT TTL elapsed | Request a new dev token |

## Reference

- Local tips: [Local Development Tips](76-local-development-tips.md)
- Debugging services: [Debugging Platform Services](75-debugging-platform-services.md)
- Environment variables: [Environment Configuration](27-environment-configuration.md)
- Unit tests: [Unit Testing Guide](16-unit-testing-guide.md)
- Integration tests: [Integration Testing Guide](17-integration-testing-guide.md)

## Related Chapters

- [Previous: Project Setup](01-project-setup.md)
- [Next: Repository Structure](03-repository-structure.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
