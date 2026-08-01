# ADR-005: Transactional and Reporting Separation

## Status

Accepted

## Context

Transactional systems optimize for correctness, consistency, and low-latency writes. Reporting systems optimize for scan-heavy queries across large historical datasets — monthly aggregates, tenant dashboards, cross-entity analytics, and exported ledgers. When both workloads share one database and one query path, reporting queries lock tables, exhaust connection pools, and inflate P99 write latency.

Operations teams respond by scaling the primary database — paying for capacity that only heavy reads consume — while writes still contend with analytics.

## Decision

EPB treats transactional and reporting paths as architecturally distinct:

- Application services route operational CRUD through transactional stores and command handlers
- Dashboard and report queries target reporting infrastructure — never the transactional primary during heavy analytics
- Reporting stores are fed asynchronously via the Event Bus and ETL/stream pipelines
- Reporting workloads must never degrade transactional performance; if a report is slow, transactional latency must remain unaffected

Services may start with read/write separation on a single database, but the platform evolves toward dedicated reporting stores. The Report Engine and Dashboard Engine (Volume 2) query only reporting infrastructure.

## Consequences

**Positive:**
- Transactional P99 latency protected from analytics load
- Reporting stores optimized for scan-heavy queries (columnar, denormalized, indexed for aggregates)
- Independent scaling of transactional and reporting infrastructure
- Clear operational boundaries for capacity planning

**Negative:**
- Eventual consistency between transactional and reporting views
- Additional infrastructure for ETL, event consumption, and reporting stores
- Data pipeline failures can cause stale dashboards until caught and replayed

## References

- [Transactional vs Reporting](../Volume-1-Foundation/13-transactional-vs-reporting.md)
- [Read/Write Separation](../Volume-1-Foundation/12-read-write-separation.md)
- [Dashboard Engine](../Volume-2-Platform-Services/22-dashboard-engine.md)
- [Report Engine](../Volume-2-Platform-Services/23-report-engine.md)
