# How to Integrate CI/CD

> **Volume:** 3 | **Chapter ID:** v3-25 | **Status:** reviewed

## What You Will Accomplish

You will configure and extend the EPB CI/CD pipeline so every pull request runs lint, unit tests, integration tests, security scans, and image builds automatically. When finished, broken code cannot merge to `main`, and deployable artifacts are published on every green build.

## Prerequisites

- [Git Workflow](24-git-workflow.md) understood
- Access to CI platform (GitHub Actions, GitLab CI, or equivalent)
- Monorepo with `Makefile` or workspace scripts for build and test
- Familiarity with [Deployment Guide](19-deployment-guide.md)

## Pipeline Stages

```mermaid
flowchart LR
  Lint[Lint_and_Format] --> Unit[Unit_Tests]
  Unit --> Int[Integration_Tests]
  Int --> Sec[Security_Scan]
  Sec --> Build[Build_Image]
  Build --> Push[Push_Registry]
```

| Stage | Blocks merge | Typical duration |
|-------|--------------|------------------|
| Lint / format | Yes | 1–2 min |
| Unit tests | Yes | 2–5 min |
| Integration tests | Yes | 5–10 min |
| Security scan | Yes (high severity) | 2–3 min |
| Image build | No (on `main` only) | 5–15 min |
| E2E tests | No (nightly / post-merge) | 15–30 min |

## Steps

### Step 1: Locate the CI configuration

EPB stores CI at the monorepo root:

```bash
ls .github/workflows/    # GitHub Actions
# or
ls .gitlab-ci.yml        # GitLab CI
```

Primary workflow file: `.github/workflows/ci.yml`

**Expected result:** You can identify the main CI workflow and any service-specific workflows.

### Step 2: Configure path-based triggers

Run only affected jobs when files change:

```yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      catalog: ${{ steps.filter.outputs.catalog }}
    steps:
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            catalog:
              - 'services/application/catalog/**'
              - 'packages/shared-contracts/**'
```

**Expected result:** Changing only `catalog` does not trigger unrelated service test jobs.

### Step 3: Add the lint job

```yaml
lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
    - run: make lint
    - run: make format-check
```

Lint must fail on warnings your team treats as errors. Do not disable rules in CI without an ADR.

**Expected result:** PR with formatting violations fails the lint job.

### Step 4: Add unit test matrix

```yaml
unit-tests:
  needs: lint
  runs-on: ubuntu-latest
  strategy:
    matrix:
      service: [identity, catalog, notification]
  steps:
    - uses: actions/checkout@v4
    - run: npm ci
    - run: make build-packages
    - run: make test-unit-${{ matrix.service }}
```

Each service's unit tests run in parallel. Shared packages build first.

**Expected result:** Matrix runs one job per service; failures identify the broken service.

### Step 5: Add integration tests with services

```yaml
integration-tests:
  needs: unit-tests
  runs-on: ubuntu-latest
  services:
    postgres:
      image: postgres:16
      env:
        POSTGRES_USER: epb
        POSTGRES_PASSWORD: epb
        POSTGRES_DB: epb_test
      ports: ['5432:5432']
      options: >-
        --health-cmd pg_isready
        --health-interval 10s
        --health-timeout 5s
        --health-retries 5
  steps:
    - uses: actions/checkout@v4
    - run: npm ci && make build-packages
    - run: make test-integration
      env:
        TEST_DATABASE_URL: postgresql://epb:epb@localhost:5432/epb_test
```

**Expected result:** Integration tests connect to CI-managed Postgres.

### Step 6: Add security scanning

```yaml
security:
  needs: lint
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Dependency audit
      run: npm audit --audit-level=high
    - name: Container scan
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: fs
        severity: CRITICAL,HIGH
        exit-code: 1
```

Block merge on CRITICAL and HIGH findings. MEDIUM findings create tickets.

**Expected result:** Known vulnerable dependencies fail the pipeline.

### Step 7: Build and push container images

On `main` only, after all test jobs pass:

```yaml
build-images:
  if: github.ref == 'refs/heads/main'
  needs: [unit-tests, integration-tests, security]
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Build catalog image
      run: |
        docker build \
          -t ${{ env.REGISTRY }}/epb/catalog:${{ github.sha }} \
          -f services/application/catalog/Dockerfile .
    - name: Push
      run: docker push ${{ env.REGISTRY }}/epb/catalog:${{ github.sha }}
```

Tag images with git SHA for traceability. Add semver tags on release.

**Expected result:** Every green `main` build produces pushable images.

### Step 8: Configure branch protection

On the hosting platform, require for `main`:

| Rule | Setting |
|------|---------|
| Require PR | Yes |
| Required reviewers | 1+ |
| Required status checks | `lint`, `unit-tests`, `integration-tests`, `security` |
| Dismiss stale reviews | Yes |
| Require linear history | Optional (team preference) |

**Expected result:** Direct push to `main` is blocked; merge requires green CI.

### Step 9: Add deployment workflow (staging)

Separate workflow triggered manually or on tag:

```yaml
# .github/workflows/deploy-staging.yml
on:
  workflow_dispatch:
    inputs:
      service:
        description: Service to deploy
        required: true
      version:
        description: Image tag
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: |
          kubectl set image deployment/${{ inputs.service }} \
            ${{ inputs.service }}=${{ env.REGISTRY }}/epb/${{ inputs.service }}:${{ inputs.version }} \
            -n epb-staging
```

Use environment secrets for kubeconfig and registry credentials.

**Expected result:** Staging deploy is a deliberate, auditable action.

### Step 10: Monitor pipeline health

Track these metrics weekly:

- Median PR pipeline duration
- Flaky test rate (jobs that pass on retry)
- Queue time (time waiting for runners)
- Failed main builds (should be near zero)

**Expected result:** Pipeline completes in under 15 minutes for typical PRs.

## Verification

- [ ] CI runs on every pull request to `main`
- [ ] Path filters prevent unnecessary job runs
- [ ] Lint, unit, integration, and security stages block merge
- [ ] Shared packages build before service tests
- [ ] Images built and pushed on green `main` builds
- [ ] Branch protection requires status checks
- [ ] Staging deploy workflow uses environment secrets
- [ ] No secrets in workflow files or logs

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Integration tests pass locally, fail in CI | Different DB version or env | Pin Postgres image version; match env vars |
| Slow pipeline (>20 min) | Sequential jobs | Parallelize matrix; cache dependencies |
| Flaky integration tests | Race conditions | Add retries only after fixing root cause |
| `npm ci` fails | Lockfile out of sync | Regenerate lockfile in dedicated PR |
| Image push denied | Registry auth expired | Rotate credentials in environment secrets |
| Path filter skips needed job | Shared package change | Add `packages/**` to all service filters |

## Reference

| Topic | Location |
|-------|----------|
| CI workflows | `.github/workflows/` |
| Makefile targets | `Makefile` |
| Deploy process | [Deployment Guide](19-deployment-guide.md) |
| Production gate | [Production Readiness](26-production-readiness.md) |
| Security scan | [Checklists/security-checklist.md](../Checklists/security-checklist.md) |

## Related Chapters

- [Previous: Git Workflow](24-git-workflow.md)
- [Next: Production Readiness](26-production-readiness.md)
- [Deployment Guide](19-deployment-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
