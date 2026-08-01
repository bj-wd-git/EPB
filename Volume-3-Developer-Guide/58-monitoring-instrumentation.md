# Monitoring Instrumentation

> **Volume:** 3 | **Chapter ID:** v3-58 | **Status:** reviewed

## What You Will Accomplish

You will add Prometheus metrics and distributed tracing to the catalog service.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- [Monitoring and Observability](../Volume-1-Foundation/33-monitoring-observability.md) reviewed

## Steps

### Step 1: Export RED metrics

http_requests_total, http_errors_total, http_request_duration_seconds.

### Step 2: Add /metrics endpoint

Prometheus scrape target.

### Step 3: Propagate trace context

Extract traceparent header; create spans for DB and external calls.

### Step 4: Create Grafana dashboard

**Expected result:** Metrics visible in Grafana; traces in Jaeger.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] /metrics returns Prometheus format
- [ ] Traces link across BFF and catalog

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

- [Previous: Health Check Implementation](57-health-check-implementation.md)
- [Next: Error Handling Implementation](59-error-handling-implementation.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
