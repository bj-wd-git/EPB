# Queue Processing Guide

> **Volume:** 3 | **Chapter ID:** v3-34 | **Status:** reviewed

## What You Will Accomplish

You will process bulk resource import jobs asynchronously via the message queue.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Queue infrastructure running

## Steps

### Step 1: Accept import request via API

Return 202 Accepted with job ID immediately.

### Step 2: Publish job message to queue

`catalog.import.requested` with file reference and tenant ID.

### Step 3: Implement queue consumer

Process rows in batches of 100; update job status.

### Step 4: Expose job status endpoint

`GET /catalog/v1/import-jobs/{jobId}` — progress, errors.

**Expected result:** Large imports processed without blocking API.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Job status trackable
- [ ] Failed rows reported with line numbers

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Config not loaded | Wrong env file | Check .env and env var names |
| Service won't start | Missing dependency | Verify docker compose services running |
| 500 on startup | Invalid config value | Check logs for validation errors |

## Reference

- [Coding Standards](../Volume-1-Foundation/25-coding-standards.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)

## Related Chapters

- [Previous: Caching Patterns](33-caching-patterns.md)
- [Next: File Upload Integration](35-file-upload-integration.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
