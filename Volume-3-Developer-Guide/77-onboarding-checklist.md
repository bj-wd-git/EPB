# How to Onboard a New Developer

> **Volume:** 3 | **Chapter ID:** v3-77 | **Status:** reviewed

## What You Will Accomplish

You will complete the EPB developer onboarding checklist so a new team member can clone the monorepo, run services locally, make a first change, and open a pull request within their first week.

## Prerequisites

- New developer has received: Git remote access, SSO credentials, secrets manager access (if applicable), and communication channel invites
- Onboarding buddy assigned from the platform team
- This checklist printed or tracked in the onboarding ticket

## Onboarding Timeline

| Day | Focus |
|-----|-------|
| 1 | Access, clone, local stack running |
| 2 | Architecture walkthrough, first read-only PR review |
| 3 | Small bug fix or doc change PR |
| 4–5 | Feature branch with tests, full PR cycle |

## Steps

### Step 1: Grant access

Verify the new developer has:

- [ ] Git repository read/write access
- [ ] CI/CD platform access (view pipelines)
- [ ] Container registry pull access
- [ ] Secrets manager read access (non-prod)
- [ ] Monitoring dashboard view access
- [ ] Issue tracker and documentation wiki
- [ ] Team chat channels (`#platform`, `#deploys`, `#incidents`)

**Expected result:** Developer can log in to all systems without blocker tickets.

### Step 2: Complete local environment setup

Follow these guides in order:

1. [Project Setup](01-project-setup.md) — clone, bootstrap, Docker infrastructure
2. [Development Environment](02-development-environment.md) — language runtime, IDE, linters
3. [Repository Structure](03-repository-structure.md) — monorepo layout

Verification commands:

```bash
git clone https://github.com/<org>/epb-platform.git
cd epb-platform
./scripts/bootstrap.sh
docker compose -f infrastructure/docker/docker-compose.yml ps
make build-packages
make dev-bff-web
curl -s http://localhost:3000/health | jq .
```

**Expected result:** BFF health returns `UP`; frontend loads in browser.

### Step 3: Read core architecture chapters

Assign reading (Day 1–2):

| Priority | Chapter | Why |
|----------|---------|-----|
| Required | [Layered Architecture](../Volume-1-Foundation/06-layered-architecture.md) | Layer boundaries |
| Required | [BFF Layer](../Volume-1-Foundation/08-bff-layer.md) | Entry point pattern |
| Required | [Independent Services](../Volume-1-Foundation/14-independent-services.md) | Service ownership |
| Required | [API Standards](../Volume-1-Foundation/18-api-standards.md) | Request/response contracts |
| Required | [Model Separation](../Volume-1-Foundation/11-model-separation.md) | DTO/entity/mapper pattern |
| Recommended | [Multi-Tenant Setup](48-multi-tenant-setup.md) | Tenant isolation |
| Recommended | [Git Workflow](24-git-workflow.md) | Branching and PR process |

**Expected result:** Developer can explain the Frontend → BFF → Services flow.

### Step 4: Run the test suite

```bash
make lint
make test-unit
make test-integration   # requires Docker
```

Understand the test pyramid from [Unit Testing Guide](16-unit-testing-guide.md):

- Unit tests: fast, no infrastructure
- Integration tests: API + database
- E2E tests: full stack (nightly)

**Expected result:** All tests pass locally; developer knows which test type to run for a given change.

### Step 5: Shadow a code review

Buddy assigns one open PR for the new developer to review (comments welcome, not required to approve):

- [ ] Read the PR description and linked issue
- [ ] Check folder structure against [Folder Structure](../Volume-1-Foundation/23-folder-structure.md)
- [ ] Verify tests are included
- [ ] Walk through the diff with buddy in a 30-minute session

Use [Code Review Checklist](22-code-review-checklist.md) as a guide.

**Expected result:** Developer understands EPB review expectations before their first PR.

### Step 6: Make a first contribution

Start with a low-risk change:

| Good first PR | Avoid as first PR |
|---------------|-------------------|
| Fix a typo in docs | Database migration |
| Add a unit test for existing code | Shared contract change |
| Small bug fix with test | Cross-service refactor |
| Improve error message | Security middleware change |

Workflow:

```bash
git checkout main && git pull
git checkout -b chore/onboarding-fix-typo
# make change
make lint && make test-unit
git commit -m "docs: fix broken link in catalog README"
git push -u origin chore/onboarding-fix-typo
# open PR
```

**Expected result:** First PR merged within Day 3–5.

### Step 7: Learn operational basics

Brief the new developer on:

| Topic | Guide |
|-------|-------|
| Environment variables | [Environment Configuration](27-environment-configuration.md) |
| Local debugging | [Local Development Tips](76-local-development-tips.md) |
| Creating a service | [Create New Service](04-create-new-service.md) |
| Creating an API | [Create New API](05-create-new-api.md) |
| Deploy process | [Deployment Guide](19-deployment-guide.md) |
| Incident response | [Incident Response Guide](79-incident-response-guide.md) |

**Expected result:** Developer knows where to find guides for common tasks.

### Step 8: Complete security awareness

- [ ] Read [Security Foundation](../Volume-1-Foundation/21-security-foundation.md)
- [ ] Complete [Checklists/security-checklist.md](../Checklists/security-checklist.md) walkthrough with buddy
- [ ] Understand: never commit secrets, never log PII, always scope by tenant
- [ ] Know how to report a security concern (channel or email)

**Expected result:** Developer signs security acknowledgment if required by organization policy.

### Step 9: Join on-call shadow (optional, week 2+)

- [ ] Added to on-call rotation schedule (after shadow period)
- [ ] Shadow one on-call shift with current on-call engineer
- [ ] Access to runbooks in `docs/runbooks/`
- [ ] Know escalation path for P1 incidents

**Expected result:** Developer can find the runbook and paging policy.

### Step 10: Sign off onboarding

Buddy and new developer confirm:

| Item | Done |
|------|------|
| Local stack runs | |
| Architecture reading complete | |
| Tests pass locally | |
| First PR merged | |
| Git workflow understood | |
| Security briefing complete | |
| Knows who to ask for help | |

Close the onboarding ticket. Schedule 30-day check-in.

**Expected result:** Onboarding ticket closed; developer is productive on feature work.

## Verification

- [ ] All access grants confirmed
- [ ] Local environment passes health checks
- [ ] Core architecture chapters read
- [ ] Test suite runs successfully
- [ ] First PR merged
- [ ] Security checklist reviewed
- [ ] Onboarding sign-off completed

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Docker won't start | WSL2 not enabled (Windows) | Enable WSL2; install Docker Desktop |
| `401` on all API calls | Missing dev token setup | Follow identity service README for local token |
| Package link errors | Shared libs not built | `make build-packages` |
| Overwhelmed by monorepo size | Trying to learn everything | Focus on one service; buddy assigns scope |
| First PR too large | Ambitious feature pick | Split into smaller PR; start with docs or tests |
| Access request pending | IT delay | Escalate Day 1; use read-only clone meanwhile |

## Reference

| Topic | Location |
|-------|----------|
| Full setup | [Project Setup](01-project-setup.md) |
| Dev environment | [Development Environment](02-development-environment.md) |
| Git process | [Git Workflow](24-git-workflow.md) |
| Code review | [Code Review Checklist](22-code-review-checklist.md) |
| Glossary | [EPB Glossary](../docs/GLOSSARY.md) |
| Handbook index | [README](../README.md) |

## Related Chapters

- [Previous: Local Development Tips](76-local-development-tips.md)
- [Next: Release Checklist](78-release-checklist.md)
- [Project Setup](01-project-setup.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
