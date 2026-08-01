# How to Execute a Release

> **Volume:** 3 | **Chapter ID:** v3-78 | **Status:** reviewed

## What You Will Accomplish

You will execute a structured release of the EPB platform (or a single service) to production, including version tagging, migration, deployment, smoke testing, and communication. When finished, production runs the new version with a documented rollback path.

## Prerequisites

- All features for the release merged to `main` with green CI
- [Production Readiness](26-production-readiness.md) checklist signed off
- Release manager assigned; on-call engineer notified 24 hours in advance
- Maintenance window scheduled (if required for breaking migrations)
- [Deployment Guide](19-deployment-guide.md) understood

## Release Types

| Type | Version bump | Example |
|------|--------------|---------|
| Patch | `1.4.2` → `1.4.3` | Bug fix, no API change |
| Minor | `1.4.3` → `1.5.0` | New feature, backward compatible |
| Major | `1.5.0` → `2.0.0` | Breaking API or schema change |

## Steps

### Step 1: Create the release branch (optional)

For large releases, stabilize on a branch:

```bash
git checkout main
git pull origin main
git checkout -b release/1.5.0
```

For continuous delivery teams, release directly from `main` at a tagged commit.

**Expected result:** Release branch exists (if used) with only release-related commits allowed.

### Step 2: Generate the changelog

```bash
# List commits since last tag
git log v1.4.2..HEAD --oneline --no-merges

# Or use conventional-changelog / release tool
npm run changelog -- --from v1.4.2 --to HEAD
```

Changelog sections:

- **Added** — new features
- **Changed** — behavior changes (backward compatible)
- **Deprecated** — features scheduled for removal
- **Removed** — removed features
- **Fixed** — bug fixes
- **Security** — vulnerability fixes

**Expected result:** Changelog reviewed by service owners; no missing breaking changes.

### Step 3: Run full test suite

```bash
make lint
make test-unit
make test-integration
# E2E if release includes frontend or BFF changes:
npm run test:e2e
```

Confirm CI is green on the exact commit to be released:

```bash
git rev-parse HEAD
gh run list --commit $(git rev-parse HEAD)
```

**Expected result:** All test stages pass on the release commit.

### Step 4: Tag the release

```bash
git tag -a v1.5.0 -m "Release 1.5.0: resource export, notification improvements"
git push origin v1.5.0
```

Tag format: `v<major>.<minor>.<patch>` (semver).

**Expected result:** Tag visible in remote; CI triggers release build pipeline.

### Step 5: Build and publish release artifacts

CI on tag should:

1. Build container images for all changed services
2. Tag images with `1.5.0` and git SHA
3. Push to container registry
4. Publish changelog and release notes

Verify images:

```bash
docker pull registry.example.com/epb/catalog:1.5.0
docker inspect registry.example.com/epb/catalog:1.5.0 --format='{{.RepoDigests}}'
```

**Expected result:** Immutable images available in registry for each deployed service.

### Step 6: Deploy to staging and validate

Deploy to staging first — never skip:

```bash
# Trigger staging deploy workflow
gh workflow run deploy-staging.yml \
  -f service=catalog \
  -f version=1.5.0
```

Staging validation checklist:

- [ ] Smoke tests pass
- [ ] Manual QA of new features complete
- [ ] No error rate increase in staging dashboards (30 min observation)
- [ ] Migrations applied successfully

**Expected result:** Staging runs `v1.5.0` for 24+ hours without incidents (or shorter for patch releases per team policy).

### Step 7: Apply production migrations

During the maintenance window (if required):

```bash
kubectl apply -f infrastructure/k8s/jobs/catalog-migrate.yaml -n epb-production
kubectl wait --for=condition=complete job/catalog-migrate -n epb-production --timeout=600s
kubectl logs job/catalog-migrate -n epb-production
```

Rules:

- Backward-compatible migrations run before code deploy
- Breaking migrations require expand-contract pattern and coordinated deploy
- Abort release if migration fails — do not deploy new code

**Expected result:** Migration job completes with exit code 0.

### Step 8: Deploy to production

Deploy services in dependency order:

| Order | Service | Reason |
|-------|---------|--------|
| 1 | Platform services (identity, audit) | Auth required by all |
| 2 | Application services | Business logic |
| 3 | BFF | Routes to services |
| 4 | Frontend | Static assets last |

```bash
gh workflow run deploy-production.yml \
  -f service=catalog \
  -f version=1.5.0
```

Monitor rollout:

```bash
kubectl rollout status deployment/catalog -n epb-production --timeout=600s
```

**Expected result:** Rolling deploy completes; all pods healthy.

### Step 9: Run production smoke tests

```bash
npm run smoke:production -- --service=catalog
```

Manual checks:

- [ ] Login works
- [ ] Create/read/update resource works
- [ ] New feature flag behavior correct
- [ ] No 5xx errors in first 15 minutes

**Expected result:** Smoke tests pass; error rate flat in production dashboards.

### Step 10: Communicate and close

1. **Announce** release in `#deploys` channel:

   ```text
   Released v1.5.0 to production.
   Changes: [link to changelog]
   Services: catalog, bff-web
   Rollback: kubectl rollout undo deployment/catalog -n epb-production
   On-call: @engineer
   ```

2. **Update** release ticket with:
   - Tag and commit SHA
   - Migration revision
   - Deploy timestamp
   - Sign-off from release manager

3. **Monitor** for 24 hours — elevated alert sensitivity

4. **Close** release ticket after observation period

**Expected result:** Stakeholders informed; release ticket closed with audit trail.

## Rollback Procedure

If smoke tests or monitoring fail post-deploy:

```bash
# 1. Roll back application
kubectl rollout undo deployment/catalog -n epb-production

# 2. Verify previous version healthy
kubectl rollout status deployment/catalog -n epb-production
npm run smoke:production -- --service=catalog

# 3. Database: forward-fix only — do NOT run down migrations
# Create hotfix migration if schema changed

# 4. Communicate rollback in #deploys and #incidents
```

**Expected result:** Previous version serving traffic within 10 minutes of rollback decision.

## Verification

- [ ] Changelog complete and reviewed
- [ ] Full test suite green on release commit
- [ ] Version tag created and pushed
- [ ] Images built and published
- [ ] Staging validated before production
- [ ] Migrations applied successfully
- [ ] Production deploy completed with healthy pods
- [ ] Smoke tests pass in production
- [ ] Release communicated to stakeholders
- [ ] Rollback procedure documented and tested in staging

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Tag push rejected | Tag already exists | Bump patch version; never retag |
| Migration fails mid-release | Incompatible schema | Stop deploy; fix forward with new migration |
| Partial deploy (some services updated) | Manual deploy order error | Follow dependency order; roll back all or complete all |
| Smoke test fails post-deploy | Config difference prod vs staging | Compare env vars and secrets |
| Error spike after deploy | New bug or capacity issue | Roll back; open incident per [Incident Response Guide](79-incident-response-guide.md) |
| Changelog missing breaking change | Incomplete commit messages | Enforce conventional commits; manual review |

## Reference

| Topic | Location |
|-------|----------|
| Deploy steps | [Deployment Guide](19-deployment-guide.md) |
| Production gate | [Production Readiness](26-production-readiness.md) |
| CI/CD pipeline | [CI/CD Integration](25-cicd-integration.md) |
| Production checklist | [Checklists/production-readiness.md](../Checklists/production-readiness.md) |
| Incident process | [Incident Response Guide](79-incident-response-guide.md) |

## Related Chapters

- [Previous: Onboarding Checklist](77-onboarding-checklist.md)
- [Next: Incident Response Guide](79-incident-response-guide.md)
- [Git Workflow](24-git-workflow.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
