# How to Write Integration Tests

> **Volume:** 3 | **Chapter ID:** v3-17 | **Status:** reviewed

## What You Will Accomplish

You will add integration tests that verify API contracts, database persistence, and message publishing for an EPB service using real (containerized) infrastructure. When finished, pull requests validate that HTTP endpoints, migrations, and tenant isolation work together before deployment.

## Prerequisites

- [Unit Testing Guide](16-unit-testing-guide.md) completed for the same service
- Docker running locally (see [Project Setup](01-project-setup.md))
- Service scaffold with `tests/integration/` directory
- Familiarity with [API Standards](../Volume-1-Foundation/18-api-standards.md)

## Steps

### Step 1: Prepare the integration test environment

Integration tests use isolated infrastructure — typically Testcontainers or a dedicated test database — never the developer's local `epb_dev` database.

```bash
cd services/application/catalog
ls tests/integration
```

Create a test configuration file `tests/integration/test.config.ts` (or equivalent):

```typescript
export const testConfig = {
  databaseUrl: process.env.TEST_DATABASE_URL
    ?? 'postgresql://epb:epb@localhost:5433/catalog_test',
  brokerUrl: process.env.TEST_BROKER_URL
    ?? 'amqp://guest:guest@localhost:5673',
};
```

Start test infrastructure:

```bash
docker compose -f tests/integration/docker-compose.test.yml up -d
```

**Expected result:** Postgres and message broker containers for testing are healthy on non-conflicting ports (5433, 5673).

### Step 2: Bootstrap the test database

Run migrations against the test database before each test suite:

```bash
TEST_DATABASE_URL=postgresql://epb:epb@localhost:5433/catalog_test \
  npm run migrate:up
```

In test setup code:

```typescript
beforeAll(async () => {
  await migrateUp(testConfig.databaseUrl);
  await app.start({ port: 0 }); // random port avoids conflicts
});

afterAll(async () => {
  await app.stop();
  await dockerComposeDown();
});
```

**Expected result:** Test database schema matches production migrations.

### Step 3: Create an API test harness

Build a test client that sends HTTP requests to your service's in-process server or test container:

```typescript
import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import { issueTestToken } from '@epb/shared-testing/auth';

describe('POST /api/v1/resources', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  it('creates a resource and returns 201 with standard envelope', async () => {
    const token = issueTestToken({ tenantId: 'tenant-a', roles: ['editor'] });

    const response = await request(app)
      .post('/api/v1/resources')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Correlation-Id', 'test-corr-001')
      .send({ code: 'RES-100', name: 'Integration Resource' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: { code: 'RES-100', status: 'ACTIVE' },
    });
  });
});
```

**Expected result:** Test issues a real HTTP request and receives the EPB standard response envelope.

### Step 4: Test tenant isolation at the API layer

Every integration test that reads or writes data must include a cross-tenant negative case:

```typescript
it('returns 404 when resource belongs to another tenant', async () => {
  const ownerToken = issueTestToken({ tenantId: 'tenant-a' });
  const otherToken = issueTestToken({ tenantId: 'tenant-b' });

  const created = await request(app)
    .post('/api/v1/resources')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ code: 'RES-200', name: 'Tenant A Resource' });

  const response = await request(app)
    .get(`/api/v1/resources/${created.body.data.id}`)
    .set('Authorization', `Bearer ${otherToken}`);

  expect(response.status).toBe(404);
});
```

**Expected result:** Cross-tenant access returns `404`, not `403`, per [API Standards](../Volume-1-Foundation/18-api-standards.md).

### Step 5: Verify persistence and side effects

After a mutation, assert database state and published events:

```typescript
it('persists resource and publishes ResourceCreated event', async () => {
  const token = issueTestToken({ tenantId: 'tenant-a' });

  await request(app)
    .post('/api/v1/resources')
    .set('Authorization', `Bearer ${token}`)
    .send({ code: 'RES-300', name: 'Persisted' });

  const row = await db.query(
    'SELECT * FROM resources WHERE code = $1 AND tenant_id = $2',
    ['RES-300', 'tenant-a']
  );
  expect(row.rows).toHaveLength(1);

  expect(eventCollector.events).toContainEqual(
    expect.objectContaining({ type: 'ResourceCreated', tenantId: 'tenant-a' })
  );
});
```

**Expected result:** Database row and domain event both exist after the API call.

### Step 6: Test error responses

Verify standard error format for validation and auth failures:

| Scenario | Expected status | Expected `error.code` |
|----------|-----------------|----------------------|
| Missing auth header | 401 | `UNAUTHORIZED` |
| Insufficient role | 403 | `FORBIDDEN` |
| Invalid request body | 400 | `VALIDATION_ERROR` |
| Unknown resource ID | 404 | `RESOURCE_NOT_FOUND` |

```typescript
it('returns VALIDATION_ERROR for missing code', async () => {
  const token = issueTestToken({ tenantId: 'tenant-a' });

  const response = await request(app)
    .post('/api/v1/resources')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'No Code' });

  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
});
```

**Expected result:** Error body matches [Error Handling](../Volume-1-Foundation/19-error-handling.md) structure.

### Step 7: Reset state between tests

Use transactions, truncation, or per-suite database recreation:

```typescript
beforeEach(async () => {
  await db.query('TRUNCATE resources, outbox_events RESTART IDENTITY CASCADE');
  eventCollector.clear();
});
```

Never depend on test execution order.

**Expected result:** Tests pass when run individually (`--testNamePattern`) and in random order.

### Step 8: Run integration tests in CI

CI should run integration tests in a job with Docker available, after unit tests pass:

```yaml
integration-tests:
  runs-on: ubuntu-latest
  services:
    postgres:
      image: postgres:16
      env:
        POSTGRES_PASSWORD: epb
      ports: ['5433:5432']
  steps:
    - run: npm run test:integration
```

**Expected result:** CI job completes in under five minutes for a typical service.

## Verification

- [ ] Tests live in `tests/integration/`
- [ ] Test database is isolated from development data
- [ ] Migrations run before test suite
- [ ] Standard API envelope and error format asserted
- [ ] Cross-tenant isolation tested
- [ ] Events and persistence verified for mutations
- [ ] State reset between tests; no order dependency
- [ ] CI runs integration tests with Docker services

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ECONNREFUSED` on database | Test container not ready | Add health-check wait in `beforeAll` |
| Migration version mismatch | Test DB stale | Drop and recreate test database |
| Port conflict | Fixed test port in use | Use `port: 0` or dedicated test ports |
| Flaky event assertions | Async publish not awaited | Use outbox pattern or `await eventCollector.waitFor()` |
| Tests pass locally, fail in CI | Missing Docker service | Mirror `docker-compose.test.yml` in CI job |

## Reference

| Topic | Location |
|-------|----------|
| Test auth tokens | `packages/shared-testing/auth` |
| API envelope | [API Standards](../Volume-1-Foundation/18-api-standards.md) |
| Migrations | [Database Migrations](29-database-migrations.md) |
| Unit tests | [Unit Testing Guide](16-unit-testing-guide.md) |
| E2E tests | [E2E Testing Guide](18-e2e-testing-guide.md) |

## Related Chapters

- [Previous: Unit Testing Guide](16-unit-testing-guide.md)
- [Next: E2E Testing Guide](18-e2e-testing-guide.md)
- [Multi-Tenant Setup](48-multi-tenant-setup.md)
- [EPB Glossary](../docs/GLOSSARY.md)

---

*Enterprise Platform Blueprint — Volume 3*
