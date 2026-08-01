# ADR-010: HMS Domain Service Boundaries

## Status

Accepted

## Context

HMS.md defines 37 enterprise domains across clinical, operational, and financial areas. A monolithic database or service would create coupling, scaling bottlenecks, and unclear ownership. EPB ADR-003 requires independent services with data ownership.

## Decision

Organize HMS Phase 1 as domain-scoped NestJS modules under `hms/services/` with schema-per-domain in PostgreSQL:

| Domain | Service | Schema | Owns |
|--------|---------|--------|------|
| Configuration | configuration | config | hospitals, branches, departments, doctors |
| Registration | registration | patient | patients, UHID sequences |
| Appointment | appointment | appointment | slots, appointments, queues |
| EMR | emr | emr | clinical profiles, notes, vitals |
| Audit | audit | audit | immutable audit events |

Phase 2+ domains (laboratory, pharmacy, billing, etc.) are scaffolded as empty modules with README stubs — no shared tables across domains. Cross-domain reads go through BFF aggregation or internal service APIs, never direct DB access.

## Consequences

**Positive:**
- Clear ownership per healthcare domain
- Independent deploy and scale path per service
- Aligns with HMS.md bounded-context map

**Negative:**
- Distributed transactions avoided — use saga/events for cross-domain workflows
- BFF aggregation required for composite screens (EMR view)

## References

- [HMS.md](../HMS.md)
- [ADR-003: Independent Services Data Ownership](./ADR-003-independent-services-data-ownership.md)
- [ADR-001: Layered Architecture with BFF](./ADR-001-layered-architecture-bff.md)
